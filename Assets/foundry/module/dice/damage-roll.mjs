/**
 * I Rikets Tjänst - Damage Roller
 * Handles damage dice, KP calculation, and critical hit integration.
 */

import { lookupCritical, criticalModifier } from "./critical-tables.mjs";

/* ---- Pure helper functions (testable without Foundry) ---- */

/**
 * Analyze damage dice results.
 * @param {number[]} dice - Array of d12 results
 * @returns {{ kp: number, critCount: number, critDice: number[] }}
 */
export function analyzeDamage(dice) {
  let kp = 0;
  let critCount = 0;
  const critDice = [];
  for (const d of dice) {
    if (d >= 10) {
      kp++;
      if (d === 12) {
        critCount++;
        critDice.push(d);
      }
    }
  }
  return { kp, critCount, critDice };
}

/**
 * Calculate total damage after applying weapon Skada and armor Skydd.
 * @param {object} params
 * @param {number[]} params.dice - Damage dice results
 * @param {number} params.weaponSkada - Weapon's flat damage value
 * @param {number} params.skydd - Target's armor/protection value
 * @returns {{ totalKP: number, kpFromDice: number, critCount: number }}
 */
export function calculateDamage({ dice, weaponSkada = 0, skydd = 0 }) {
  const { kp, critCount } = analyzeDamage(dice);
  const totalKP = Math.max(0, kp + weaponSkada - skydd);
  return { totalKP, kpFromDice: kp, critCount };
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
 * Perform a damage roll and post to chat.
 * @param {object} options
 * @param {number} options.numDice - Number of damage dice (= attack successes)
 * @param {number} options.weaponSkada - Weapon Skada value
 * @param {string} options.damageType - Damage type key for critical table
 * @param {string} options.weaponName - Display name
 * @param {number} options.skydd - Target armor
 * @param {boolean} options.penetrerande - Penetrerande property
 * @param {Actor} [options.actor] - Rolling actor for speaker
 */
export async function damageRoll({ numDice, weaponSkada = 0, damageType = "kross", weaponName = "Skada", skydd = 0, penetrerande = false, actor = null }) {
  const pool = Math.max(1, numDice);
  const roll = new Roll(`${pool}d12`);
  await roll.evaluate();
  const dice = roll.terms[0].results.map((r) => r.result);
  const { totalKP, kpFromDice, critCount } = calculateDamage({ dice, weaponSkada, skydd });

  let critResult = null;
  let critRollValue = null;
  if (critCount > 0) {
    const critRoll = new Roll("1d12");
    await critRoll.evaluate();
    const baseRoll = critRoll.terms[0].results[0].result;
    const extraTwelves = critCount - 1;
    critRollValue = calcCritRoll(baseRoll, weaponSkada, extraTwelves, penetrerande);
    critResult = lookupCritical(damageType, critRollValue);
  }

  const html = _buildDamageChat({
    weaponName,
    dice,
    totalKP,
    kpFromDice,
    weaponSkada,
    skydd,
    critCount,
    critRollValue,
    critResult,
    damageType,
  });

  const speaker = actor ? ChatMessage.getSpeaker({ actor }) : ChatMessage.getSpeaker();
  await ChatMessage.create({
    speaker,
    content: html,
    rolls: [roll],
    sound: CONFIG.sounds.dice,
  });
}

/**
 * Show a damage roll dialog to the user.
 * @param {object} weapon - Weapon item data
 * @param {Actor} actor
 */
export async function damageRollDialog(weapon, actor) {
  const content = `
    <form>
      <div class="form-group">
        <label>Skadetärningar (antal framgångar)</label>
        <input type="number" name="numDice" value="1" min="1" />
      </div>
      <div class="form-group">
        <label>Målets Skydd</label>
        <input type="number" name="skydd" value="0" min="0" />
      </div>
    </form>
  `;

  return new Promise((resolve) => {
    new Dialog({
      title: `Skadeslag: ${weapon.name}`,
      content,
      buttons: {
        roll: {
          icon: '<i class="fas fa-dice"></i>',
          label: "Slå",
          callback: async (html) => {
            const numDice = parseInt(html.find('[name="numDice"]').val()) || 1;
            const skydd = parseInt(html.find('[name="skydd"]').val()) || 0;
            const props = (weapon.system.properties ?? "").toLowerCase();
            await damageRoll({
              numDice,
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

/* ---- Chat HTML builder ---- */

function _dieClass(val) {
  if (val === 12) return "irt-die irt-die--fokus";
  if (val >= 10) return "irt-die irt-die--success";
  return "irt-die";
}

function _esc(str) {
  if (typeof foundry !== "undefined" && foundry.utils?.escapeHTML) {
    return foundry.utils.escapeHTML(str);
  }
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function _buildDamageChat({ weaponName, dice, totalKP, kpFromDice, weaponSkada, skydd, critCount, critRollValue, critResult, damageType }) {
  let html = `<div class="irt-roll-card irt-damage-card">`;
  html += `<div class="irt-roll-header">${_esc(weaponName)}</div>`;
  html += `<div class="irt-roll-body">`;

  // Dice
  html += `<div class="irt-dice-tray">`;
  for (const d of dice) {
    html += `<span class="${_dieClass(d)}">${d}</span>`;
  }
  html += `</div>`;

  // Damage breakdown
  html += `<div class="irt-damage-total">${totalKP} KP skada</div>`;
  if (weaponSkada > 0 || skydd > 0) {
    html += `<div class="irt-damage-breakdown">`;
    html += `<span>${kpFromDice} (tärningar) + ${weaponSkada} (Skada)`;
    if (skydd > 0) html += ` − ${skydd} (Skydd)`;
    html += `</span></div>`;
  }

  // Critical hit
  if (critCount > 0 && critResult) {
    const critText = `${critResult.label}: ${critResult.effect}`;
    html += `<div class="irt-critical-hit">`;
    html += `<div class="irt-critical-header">&#128128; Kritisk träff! (${critRollValue} på ${damageType})</div>`;
    html += `<div class="irt-critical-label">${_esc(critResult.label)}</div>`;
    html += `<div class="irt-critical-effect">${_esc(critResult.effect)}</div>`;
    html += `<button class="irt-copy-crit-btn" data-crit-text="${_esc(critText)}" title="Kopiera kritisk effekt"><i class="fas fa-clipboard"></i> Kopiera</button>`;
    html += `</div>`;
  } else if (critCount > 0) {
    html += `<div class="irt-critical-hit">`;
    html += `<div class="irt-critical-header">&#128128; Kritisk träff!</div>`;
    html += `<div class="irt-critical-effect">Slå på tabellen för ${damageType}.</div>`;
    html += `</div>`;
  }

  html += `</div></div>`;
  return html;
}
