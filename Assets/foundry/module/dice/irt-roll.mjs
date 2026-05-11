/**
 * I Rikets Tjänst - Core Dice Roller
 * d12 dice pools with Focus generation and spending.
 *
 * Difficulty is NOT part of the roll - the GM determines it, sometimes after
 * seeing the result. The roller simply reports successes and Focus earned,
 * and allows spending Focus/Stress to add more dice.
 */

import { damageRoll, damageRollFromAttack } from "./damage-roll.mjs";

/* ---- Pure helper functions (testable without Foundry) ---- */

/**
 * Analyze an array of d12 results.
 * @param {number[]} dice - Array of die results (1-12)
 * @returns {{ successes: number, fokusEarned: number }}
 */
export function analyzeResults(dice) {
  let successes = 0;
  let fokusEarned = 0;
  for (const d of dice) {
    if (d >= 10) successes++;
    if (d === 12) fokusEarned++;
  }
  return { successes, fokusEarned };
}

/* ---- Foundry-dependent functions ---- */

/**
 * Perform an attribute roll and post results to chat.
 * @param {Actor} actor - The Foundry actor
 * @param {object} options
 * @param {string} options.attr1 - First attribute key
 * @param {string} options.attr2 - Second attribute key
 * @param {number} [options.modifier=0]
 * @param {string} [options.label]
 */
export async function attributeRoll(actor, { attr1, attr2, modifier = 0, label = "", weapon = null }) {
  const a1 = actor.system.attributes[attr1] ?? 0;
  const a2 = actor.system.attributes[attr2] ?? 0;
  const pool = Math.max(1, a1 + a2 + modifier);

  const roll = new Roll(`${pool}d12`);
  await roll.evaluate();
  const dice = roll.terms[0].results.map((r) => r.result);
  const { successes, fokusEarned } = analyzeResults(dice);

  // Update Focus on actor
  if (fokusEarned > 0) {
    const current = actor.system.fokus.value ?? 0;
    await actor.update({ "system.fokus.value": current + fokusEarned });
  }

  const rollLabel = label || `${_attrLabel(attr1)} + ${_attrLabel(attr2)}`;

  // Store roll data for Focus spending
  const rollId = `irt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Build chat HTML
  const fokusAvailable = (actor.system.fokus.value ?? 0);
  const stabilitet = actor.system.stabilitet ?? 3;
  // Serialize weapon data for chat embedding
  const weaponData = weapon ? {
    name: weapon.name,
    damage: weapon.system.damage ?? 0,
    damageType: weapon.system.damageType ?? "kross",
    penetrerande: (weapon.system.properties ?? "").toLowerCase().includes("penetrerande"),
  } : null;

  const html = _buildRollChat({
    rollLabel,
    dice,
    successes,
    fokusEarned,
    rollId,
    actorId: actor.id,
    fokusSpent: 0,
    fokusAvailable,
    stabilitet,
    weaponData,
  });

  // Always store for potential Focus spend (GM decides if it failed)
  _storePendingRoll(rollId, {
    actorId: actor.id,
    dice: [...dice],
    successes,
    fokusEarned,
    rollLabel,
    fokusSpent: 0,
    weaponData,
  });

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: html,
    rolls: [roll],
    sound: CONFIG.sounds.dice,
  });
}

/**
 * Handle Focus/Stress spending from chat button click.
 * Automatically splits amount between available Focus and Stress.
 * @param {string} rollId
 * @param {number} amount - Total extra dice to add
 */
export async function spendFokusOnRoll(rollId, amount) {
  const pending = _getPendingRoll(rollId);
  if (!pending) {
    ui.notifications.warn("Det slaget finns inte längre tillgängligt.");
    return;
  }

  const actor = game.actors.get(pending.actorId);
  if (!actor) return;
  if (!actor.isOwner) {
    ui.notifications.warn("Du har inte behörighet att ändra denna karaktär.");
    return;
  }

  const currentFokus = actor.system.fokus.value ?? 0;
  const currentStress = actor.system.stress.value ?? 0;
  const stabilitet = actor.system.stabilitet ?? 3;

  // Split amount between Focus and Stress
  const fokusToUse = Math.min(amount, currentFokus);
  const stressToUse = amount - fokusToUse;

  if (stressToUse > stabilitet) {
    ui.notifications.warn(`Inte tillräckligt! Max ${currentFokus} Fokus + ${stabilitet} Stress.`);
    return;
  }

  // Roll extra dice
  const roll = new Roll(`${amount}d12`);
  await roll.evaluate();
  const newDice = roll.terms[0].results.map((r) => r.result);
  const extra = analyzeResults(newDice);
  const complicationsFromFokus = newDice.filter((d) => d === 1).length;

  // Update pending data
  pending.dice.push(...newDice);
  pending.successes += extra.successes;
  pending.fokusEarned += extra.fokusEarned;
  pending.fokusSpent += amount;
  pending.complications = (pending.complications ?? 0) + complicationsFromFokus;

  // Update actor resources
  const updates = {};
  updates["system.fokus.value"] = currentFokus - fokusToUse + extra.fokusEarned;
  if (stressToUse > 0) {
    updates["system.stress.value"] = currentStress + stressToUse;
  }
  await actor.update(updates);

  // Refresh timeout on pending roll so it stays available
  pending.timestamp = Date.now();

  const updatedFokus = currentFokus - fokusToUse + extra.fokusEarned;
  const html = _buildRollChat({
    rollLabel: pending.rollLabel + " (uppdaterat)",
    dice: pending.dice,
    successes: pending.successes,
    fokusEarned: pending.fokusEarned,
    rollId: null,
    actorId: pending.actorId,
    fokusSpent: pending.fokusSpent,
    fokusAvailable: updatedFokus,
    stabilitet,
    weaponData: pending.weaponData,
    complications: pending.complications ?? 0,
  });

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: html,
    rolls: [roll],
    sound: CONFIG.sounds.dice,
  });
}

/* ---- Pending roll storage ---- */

const _pendingRolls = new Map();

function _storePendingRoll(id, data) {
  data.timestamp = Date.now();
  _pendingRolls.set(id, data);
  // Cleanup rolls older than 10 minutes
  const cutoff = Date.now() - 600_000;
  for (const [key, val] of _pendingRolls) {
    if (val.timestamp < cutoff) _pendingRolls.delete(key);
  }
}

function _getPendingRoll(id) {
  return _pendingRolls.get(id) ?? null;
}

function _removePendingRoll(id) {
  _pendingRolls.delete(id);
}

/* ---- Chat HTML builder ---- */

function _attrLabel(key) {
  const labels = {
    analys: "Analys", fysik: "Fysik", list: "List", samspel: "Samspel",
    sinnen: "Sinnen", smidighet: "Smidighet", strid: "Strid", vilja: "Vilja",
  };
  return labels[key] ?? key;
}

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

function _buildRollChat({ rollLabel, dice, successes, fokusEarned, rollId, actorId, fokusSpent, fokusAvailable, stabilitet, weaponData = null, complications = 0 }) {
  let html = `<div class="irt-roll-card">`;
  html += `<div class="irt-roll-header">${_esc(rollLabel)}</div>`;
  html += `<div class="irt-roll-body">`;

  // Dice
  html += `<div class="irt-dice-tray">`;
  for (const d of dice) {
    html += `<span class="${_dieClass(d)}">${d}</span>`;
  }
  html += `</div>`;

  // Result summary: show successes and which difficulty levels pass
  html += `<div class="irt-result">`;
  html += `${successes} Framgång${successes !== 1 ? "ar" : ""}`;
  html += `</div>`;

  html += `<div class="irt-difficulty-summary">`;
  if (successes === 0) {
    html += `<span class="irt-diff-fail">Misslyckat</span>`;
  } else {
    const levels = [
      { min: 1, label: "Normalt", css: "irt-diff-normal" },
      { min: 2, label: "Svårt", css: "irt-diff-svart" },
      { min: 3, label: "Mycket Svårt", css: "irt-diff-mycketsvart" },
    ];
    for (const lv of levels) {
      const pass = successes >= lv.min;
      html += `<span class="${lv.css} ${pass ? "irt-diff-pass" : "irt-diff-fail"}">${lv.label} ${pass ? "✓" : "✗"}</span>`;
    }
  }
  html += `</div>`;

  // Focus earned
  if (fokusEarned > 0) {
    html += `<div class="irt-fokus-earned">&#10022; +${fokusEarned} Fokus</div>`;
  }

  // Complications from focus dice (1s on extra dice)
  if (complications > 0) {
    const times = complications === 1 ? "Komplikation" : `${complications} Komplikationer`;
    html += `<div class="irt-komplikation">&#9888; ${times} — SL avgör vad som händer.</div>`;
  }

  // Focus spent
  if (fokusSpent > 0) {
    html += `<div class="irt-info-row"><span class="irt-label">Fokus spenderat:</span> <span>${fokusSpent}</span></div>`;
  }

  // Spend buttons: single row, yellow for Focus then red for Stress
  const maxSpend = (fokusAvailable ?? 0) + (stabilitet ?? 0);
  if (rollId && maxSpend > 0) {
    html += `<div class="irt-spend-buttons">`;
    html += `<span class="irt-label">Lägg till tärningar:</span>`;
    for (let i = 1; i <= maxSpend; i++) {
      const btnClass = i <= (fokusAvailable ?? 0) ? "irt-spend-btn irt-spend-btn--fokus" : "irt-spend-btn irt-spend-btn--stress";
      html += ` <button class="${btnClass}" data-roll-id="${rollId}" data-amount="${i}">+${i}</button>`;
    }
    html += `<div class="irt-spend-explainer">Gul = Fokus, Röd = Stress</div>`;
    html += `</div>`;
  }

  // Damage resolution button for weapon attacks
  if (weaponData && successes > 0) {
    html += `<div class="irt-roll-damage-row">`;
    html += `<button class="irt-roll-damage-btn" data-successes="${successes}" data-twelve-count="${fokusEarned}" data-weapon-name="${_esc(weaponData.name)}" data-weapon-skada="${weaponData.damage}" data-damage-type="${weaponData.damageType}" data-penetrerande="${weaponData.penetrerande}" data-actor-id="${actorId}">`;
    const critNote = fokusEarned > 0 ? ` + ${fokusEarned} krit` : "";
    html += `<i class="fas fa-burst"></i> Räkna skada (${successes} framgång${successes !== 1 ? "ar" : ""}${critNote})`;
    html += `</button></div>`;
  }

  html += `</div></div>`;
  return html;
}

/**
 * Register chat message listener for Focus spend buttons.
 * Call this once during system init.
 */
export function registerChatListeners() {
  Hooks.on("renderChatMessage", (_msg, html) => {
    html.find(".irt-spend-btn").on("click", async (ev) => {
      ev.preventDefault();
      const btn = ev.currentTarget;
      const rollId = btn.dataset.rollId;
      const amount = parseInt(btn.dataset.amount) || 1;
      await spendFokusOnRoll(rollId, amount);
    });

    html.find(".irt-roll-damage-btn").on("click", async (ev) => {
      ev.preventDefault();
      const btn = ev.currentTarget;
      const actorId = btn.dataset.actorId;
      const actor = game.actors.get(actorId) ?? null;
      await damageRollFromAttack({
        availableSuccesses: parseInt(btn.dataset.successes) || 0,
        twelveCount: parseInt(btn.dataset.twelveCount) || 0,
        weaponSkada: parseInt(btn.dataset.weaponSkada) || 0,
        damageType: btn.dataset.damageType || "kross",
        weaponName: btn.dataset.weaponName || "Skada",
        penetrerande: btn.dataset.penetrerande === "true",
        actor,
      });
    });

    html.find(".irt-copy-crit-btn").on("click", async (ev) => {
      ev.preventDefault();
      const text = ev.currentTarget.dataset.critText;
      await navigator.clipboard.writeText(text);
      ui.notifications.info("Kritisk effekt kopierad.");
    });
  });
}
