/**
 * I Rikets Tjänst - Core Dice Roller
 * d12 dice pools with Focus generation and spending.
 */

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

/**
 * Check if a roll meets the required difficulty.
 * @param {number} successes
 * @param {number} difficulty - 1 (Normal), 2 (Svårt), 3 (Mycket Svårt)
 * @returns {boolean}
 */
export function isSuccess(successes, difficulty) {
  return successes >= difficulty;
}

/* ---- Foundry-dependent functions ---- */

/**
 * Perform an attribute roll and post results to chat.
 * @param {Actor} actor - The Foundry actor
 * @param {object} options
 * @param {string} options.attr1 - First attribute key
 * @param {string} options.attr2 - Second attribute key
 * @param {number} [options.modifier=0]
 * @param {number} [options.difficulty=1]
 * @param {string} [options.label]
 */
export async function attributeRoll(actor, { attr1, attr2, modifier = 0, difficulty = 1, label = "" }) {
  const a1 = actor.system.attributes[attr1] ?? 0;
  const a2 = actor.system.attributes[attr2] ?? 0;
  const pool = Math.max(1, a1 + a2 + modifier);

  const roll = new Roll(`${pool}d12`);
  await roll.evaluate();
  const dice = roll.terms[0].results.map((r) => r.result);
  const { successes, fokusEarned } = analyzeResults(dice);
  const success = isSuccess(successes, difficulty);

  // Update Focus on actor
  if (fokusEarned > 0) {
    const current = actor.system.fokus.value ?? 0;
    await actor.update({ "system.fokus.value": current + fokusEarned });
  }

  const rollLabel = label || `${_attrLabel(attr1)} + ${_attrLabel(attr2)}`;
  const diffLabel = difficulty === 1 ? "Normalt" : difficulty === 2 ? "Svårt" : "Mycket Svårt";

  // Store roll data for Focus spending
  const rollId = `irt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Build chat HTML
  const html = _buildRollChat({
    rollLabel,
    diffLabel,
    difficulty,
    dice,
    successes,
    fokusEarned,
    success,
    rollId,
    actorId: actor.id,
    fokusSpent: 0,
    komplikation: false,
  });

  // Store pending roll for Focus spend
  if (!success) {
    _storePendingRoll(rollId, {
      actorId: actor.id,
      dice: [...dice],
      successes,
      fokusEarned,
      difficulty,
      rollLabel,
      diffLabel,
      fokusSpent: 0,
    });
  }

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: html,
    rolls: [roll],
    sound: CONFIG.sounds.dice,
  });
}

/**
 * Handle Focus spending from chat button click.
 * @param {string} rollId
 * @param {number} amount - Number of Focus to spend
 * @param {boolean} useStress - Use Stress instead of Focus
 */
export async function spendFokusOnRoll(rollId, amount, useStress = false) {
  const pending = _getPendingRoll(rollId);
  if (!pending) {
    ui.notifications.warn("Det slaget finns inte längre tillgängligt.");
    return;
  }

  const actor = game.actors.get(pending.actorId);
  if (!actor) return;

  const resource = useStress ? "system.stress.value" : "system.fokus.value";
  const current = useStress ? (actor.system.stress.value ?? 0) : (actor.system.fokus.value ?? 0);

  if (!useStress && current < amount) {
    ui.notifications.warn(`Inte tillräckligt med Fokus! (Har: ${current}, Behöver: ${amount})`);
    return;
  }

  // Roll extra dice
  const roll = new Roll(`${amount}d12`);
  await roll.evaluate();
  const newDice = roll.terms[0].results.map((r) => r.result);
  const extra = analyzeResults(newDice);

  // Update pending data
  pending.dice.push(...newDice);
  pending.successes += extra.successes;
  pending.fokusEarned += extra.fokusEarned;
  pending.fokusSpent += amount;

  // Update actor resources
  const updates = {};
  if (useStress) {
    updates["system.stress.value"] = current + amount;
  } else {
    updates["system.fokus.value"] = current - amount + extra.fokusEarned;
  }
  // Add any new Focus earned from extra dice (even when spending stress)
  if (useStress && extra.fokusEarned > 0) {
    updates["system.fokus.value"] = (actor.system.fokus.value ?? 0) + extra.fokusEarned;
  }
  await actor.update(updates);

  const success = isSuccess(pending.successes, pending.difficulty);
  const komplikation = !success && pending.fokusSpent > 0;

  if (success || komplikation) {
    _removePendingRoll(rollId);
  }

  const html = _buildRollChat({
    rollLabel: pending.rollLabel + " (uppdaterat)",
    diffLabel: pending.diffLabel,
    difficulty: pending.difficulty,
    dice: pending.dice,
    successes: pending.successes,
    fokusEarned: pending.fokusEarned,
    success,
    rollId: success ? null : rollId,
    actorId: pending.actorId,
    fokusSpent: pending.fokusSpent,
    komplikation,
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

function _buildRollChat({ rollLabel, diffLabel, difficulty, dice, successes, fokusEarned, success, rollId, actorId, fokusSpent, komplikation }) {
  let html = `<div class="irt-roll-card">`;
  html += `<div class="irt-roll-header">${rollLabel}</div>`;
  html += `<div class="irt-roll-body">`;

  // Dice
  html += `<div class="irt-dice-tray">`;
  for (const d of dice) {
    html += `<span class="${_dieClass(d)}">${d}</span>`;
  }
  html += `</div>`;

  // Result
  const resultClass = success ? "irt-result--success" : "irt-result--fail";
  html += `<div class="irt-result ${resultClass}">`;
  html += `${successes} Framgång${successes !== 1 ? "ar" : ""}`;
  if (difficulty > 1) html += ` (behöver ${difficulty})`;
  html += `</div>`;

  // Focus earned
  if (fokusEarned > 0) {
    html += `<div class="irt-fokus-earned">&#10022; +${fokusEarned} Fokus</div>`;
  }

  // Focus spent
  if (fokusSpent > 0) {
    html += `<div class="irt-info-row"><span class="irt-label">Fokus spenderat:</span> <span>${fokusSpent}</span></div>`;
  }

  // Komplikation
  if (komplikation) {
    html += `<div class="irt-komplikation">&#9888; KOMPLIKATION! Fokus spenderat men slaget misslyckades.</div>`;
  }

  // Spend buttons (only if failed and not a komplikation)
  if (!success && !komplikation && rollId) {
    html += `<div class="irt-spend-buttons">`;
    html += `<span class="irt-label">Spendera Fokus:</span>`;
    for (let i = 1; i <= 3; i++) {
      html += ` <button class="irt-spend-btn" data-roll-id="${rollId}" data-amount="${i}" data-use-stress="false">+${i}</button>`;
    }
    html += `<br><span class="irt-label">Spendera Stress:</span>`;
    for (let i = 1; i <= 3; i++) {
      html += ` <button class="irt-spend-btn" data-roll-id="${rollId}" data-amount="${i}" data-use-stress="true">+${i}</button>`;
    }
    html += `</div>`;
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
      const useStress = btn.dataset.useStress === "true";
      await spendFokusOnRoll(rollId, amount, useStress);
    });
  });
}
