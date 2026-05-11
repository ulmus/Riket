/**
 * I Rikets Tjänst - Damage Resolver
 *
 * Damage is calculated directly from the attack roll - no separate damage roll.
 * KP damage = attack successes + weapon Skada − Skydd (minimum 0).
 * Every 12 on the attack roll triggers a critical hit (in addition to granting 1 Focus).
 */

import { lookupCritical, criticalModifier } from "./critical-tables.mjs";

/* ---- Pure helper functions (testable without Foundry) ---- */

/**
 * Calculate total KP damage from attack successes, weapon Skada and target Skydd.
 * @param {object} params
 * @param {number} params.successes - Number of 10+ results on the attack roll
 * @param {number} [params.weaponSkada=0] - Weapon's flat damage bonus
 * @param {number} [params.skydd=0] - Target's armor/protection value
 * @returns {{ totalKP: number }}
 */
export function calculateDamage({ successes, weaponSkada = 0, skydd = 0 }) {
  const totalKP = Math.max(0, successes + weaponSkada - skydd);
  return { totalKP };
}

/**
 * Calculate the critical hit roll total.
 * @param {number} baseRoll - The 1d12 roll for the critical table
 * @param {number} weaponSkada
 * @param {number} extraTwelves - Number of 12s beyond the first
 * @param {boolean} penetrerande
 * @returns {number}
 */
export function calcCritRoll(baseRoll, weaponSkada, extraTwelves, penetrerande = false) {
  return baseRoll + criticalModifier(weaponSkada, extraTwelves, penetrerande);
}

/* ---- Foundry-dependent functions ---- */

/**
 * Resolve damage from an attack roll and post to chat.
 * No dice are rolled for the damage itself; only for the critical table lookup (if any).
 *
 * @param {object} options
 * @param {number} options.successes - Attack roll successes (10+)
 * @param {number} [options.twelveCount=0] - Number of 12s on the attack roll
 * @param {number} [options.weaponSkada=0]
 * @param {string} [options.damageType="kross"]
 * @param {string} [options.weaponName="Skada"]
 * @param {number} [options.skydd=0]
 * @param {boolean} [options.penetrerande=false]
 * @param {Actor} [options.actor]
 */
export async function damageRoll({ successes, twelveCount = 0, weaponSkada = 0, damageType = "kross", weaponName = "Skada", skydd = 0, penetrerande = false, actor = null }) {
  const { totalKP } = calculateDamage({ successes, weaponSkada, skydd });

  let critResult = null;
  let critRollValue = null;
  let critRoll = null;
  if (twelveCount > 0) {
    critRoll = new Roll("1d12");
    await critRoll.evaluate();
    const baseRoll = critRoll.terms[0].results[0].result;
    const extraTwelves = twelveCount - 1;
    critRollValue = calcCritRoll(baseRoll, weaponSkada, extraTwelves, penetrerande);
    critResult = lookupCritical(damageType, critRollValue);
  }

  const html = _buildDamageChat({
    weaponName,
    successes,
    totalKP,
    weaponSkada,
    skydd,
    twelveCount,
    critRollValue,
    critResult,
    damageType,
  });

  const speaker = actor ? ChatMessage.getSpeaker({ actor }) : ChatMessage.getSpeaker();
  await ChatMessage.create({
    speaker,
    content: html,
    rolls: critRoll ? [critRoll] : [],
    sound: CONFIG.sounds.dice,
  });
}

/**
 * Show a damage resolution dialog for a weapon attack.
 * Framgångar are optional — the player chooses how many to apply to damage.
 * @param {object} weapon - Weapon item data
 * @param {Actor} actor
 */
export async function damageRollDialog(weapon, actor) {
  const content = `
    <form>
      <p style="margin:0 0 8px;font-size:11px;color:#666">
        Skada ${weapon.system.damage ?? 0} är garanterad vid träff.
        Framgångar är valfria – de kan användas till skada eller andra effekter.
      </p>
      <div class="form-group">
        <label>Framgångar till skada (valfritt)</label>
        <input type="number" name="successes" value="0" min="0" />
      </div>
      <div class="form-group">
        <label>Antal 12:or på attackslaget</label>
        <input type="number" name="twelveCount" value="0" min="0" />
      </div>
      <div class="form-group">
        <label>Målets Skydd</label>
        <input type="number" name="skydd" value="0" min="0" />
      </div>
    </form>
  `;

  return new Promise((resolve) => {
    new Dialog({
      title: `Skada: ${weapon.name}`,
      content,
      buttons: {
        roll: {
          icon: '<i class="fas fa-burst"></i>',
          label: "Räkna skada",
          callback: async (html) => {
            const successes = parseInt(html.find('[name="successes"]').val()) || 0;
            const twelveCount = parseInt(html.find('[name="twelveCount"]').val()) || 0;
            const skydd = parseInt(html.find('[name="skydd"]').val()) || 0;
            const props = (weapon.system.properties ?? "").toLowerCase();
            await damageRoll({
              successes,
              twelveCount,
              weaponSkada: weapon.system.damage ?? 0,
              damageType: weapon.system.damageType ?? "kross",
              weaponName: weapon.name,
              skydd,
              penetrerande: props.includes("penetrerande"),
              actor,
            });
            resolve(true);
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Avbryt",
          callback: () => resolve(false),
        },
      },
      default: "roll",
    }).render(true);
  });
}

/**
 * Show a damage picker dialog triggered from an attack roll chat card.
 * Displays how many framgångar are available and lets the player choose how many to apply to damage.
 */
export async function damageRollFromAttack({ availableSuccesses, twelveCount, weaponSkada, damageType, weaponName, penetrerande, actor }) {
  const content = `
    <form>
      <p style="margin:0 0 8px;font-size:11px;color:#666">
        <strong>${_esc(weaponName)}</strong> — Skada ${weaponSkada} KP garanterat vid träff.<br>
        Framgångar tillgängliga: <strong>${availableSuccesses}</strong> (valfri bonus till skada eller andra effekter).
      </p>
      <div class="form-group">
        <label>Framgångar till skada (0–${availableSuccesses})</label>
        <input type="number" name="successesForDamage" value="0" min="0" max="${availableSuccesses}" />
      </div>
      <div class="form-group">
        <label>Målets Skydd</label>
        <input type="number" name="skydd" value="0" min="0" />
      </div>
    </form>
  `;

  return new Promise((resolve) => {
    new Dialog({
      title: `Skada: ${weaponName}`,
      content,
      buttons: {
        roll: {
          icon: '<i class="fas fa-burst"></i>',
          label: "Räkna skada",
          callback: async (html) => {
            const successesForDamage = Math.min(
              parseInt(html.find('[name="successesForDamage"]').val()) || 0,
              availableSuccesses
            );
            const skydd = parseInt(html.find('[name="skydd"]').val()) || 0;
            await damageRoll({
              successes: successesForDamage,
              twelveCount,
              weaponSkada,
              damageType,
              weaponName,
              skydd,
              penetrerande,
              actor,
            });
            resolve(true);
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Avbryt",
          callback: () => resolve(false),
        },
      },
      default: "roll",
    }).render(true);
  });
}

/* ---- Chat HTML builder ---- */

function _esc(str) {
  if (typeof foundry !== "undefined" && foundry.utils?.escapeHTML) {
    return foundry.utils.escapeHTML(str);
  }
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function _buildDamageChat({ weaponName, successes, totalKP, weaponSkada, skydd, twelveCount, critRollValue, critResult, damageType }) {
  let html = `<div class="irt-roll-card irt-damage-card">`;
  html += `<div class="irt-roll-header">${_esc(weaponName)}</div>`;
  html += `<div class="irt-roll-body">`;

  // Damage total
  html += `<div class="irt-damage-total">${totalKP} KP skada</div>`;
  html += `<div class="irt-damage-breakdown">`;
  const parts = [`<strong>${weaponSkada}</strong> Skada`];
  if (successes > 0) parts.push(`+ <strong>${successes}</strong> framgång${successes !== 1 ? "ar" : ""}`);
  if (skydd > 0) parts.push(`− <strong>${skydd}</strong> Skydd`);
  html += `<span>${parts.join(" ")}</span>`;
  html += `</div>`;

  // Critical hit
  if (twelveCount > 0 && critResult) {
    const critText = `${critResult.label}: ${critResult.effect}`;
    html += `<div class="irt-critical-hit">`;
    html += `<div class="irt-critical-header">&#128128; Kritisk träff! (${critRollValue} på ${damageType})</div>`;
    html += `<div class="irt-critical-label">${_esc(critResult.label)}</div>`;
    html += `<div class="irt-critical-effect">${_esc(critResult.effect)}</div>`;
    html += `<button class="irt-copy-crit-btn" data-crit-text="${_esc(critText)}" title="Kopiera kritisk effekt"><i class="fas fa-clipboard"></i> Kopiera</button>`;
    html += `</div>`;
  } else if (twelveCount > 0) {
    html += `<div class="irt-critical-hit">`;
    html += `<div class="irt-critical-header">&#128128; Kritisk träff!</div>`;
    html += `<div class="irt-critical-effect">Slå på tabellen för ${damageType}.</div>`;
    html += `</div>`;
  }

  html += `</div></div>`;
  return html;
}
