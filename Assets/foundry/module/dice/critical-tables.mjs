/**
 * I Rikets Tjänst - Critical Hit Tables
 * Re-exports all 10 damage type tables and provides lookup function.
 */

import { KROSS } from "./tables/kross.mjs";
import { STICK } from "./tables/stick.mjs";
import { HUGG } from "./tables/hugg.mjs";
import { ELD } from "./tables/eld.mjs";
import { SKJUTVAPEN } from "./tables/skjutvapen.mjs";
import { EXPLOSION } from "./tables/explosion.mjs";
import { GIFT } from "./tables/gift.mjs";
import { BLODNING } from "./tables/blodning.mjs";
import { STRALNING } from "./tables/stralning.mjs";
import { OVRIGA } from "./tables/ovriga.mjs";

export const CRITICAL_TABLES = {
  kross: KROSS,
  stick: STICK,
  hugg: HUGG,
  eld: ELD,
  skjutvapen: SKJUTVAPEN,
  explosion: EXPLOSION,
  gift: GIFT,
  blodning: BLODNING,
  stralning: STRALNING,
  ovriga: OVRIGA,
};

export const DAMAGE_TYPE_KEYS = Object.keys(CRITICAL_TABLES);

/**
 * Look up a critical hit effect by damage type and roll result.
 * @param {string} damageType - One of the DAMAGE_TYPE_KEYS
 * @param {number} roll - The modified critical hit roll (1T12 + modifiers)
 * @returns {{ label: string, effect: string } | null}
 */
export function lookupCritical(damageType, roll) {
  const table = CRITICAL_TABLES[damageType];
  if (!table) return null;
  const clamped = Math.max(1, roll);
  const entry = table.find((e) => clamped >= e.min && clamped <= e.max);
  return entry ? { label: entry.label, effect: entry.effect } : null;
}

/**
 * Calculate the critical hit roll modifier.
 * Weapon Skada does NOT modify the critical roll. Only Penetrerande (+2),
 * extra 12s (+1 each) and the target's critical toughness (−X) apply.
 * @param {number} extraTwelves - Number of 12s beyond the first on the attack roll
 * @param {boolean} penetrerande - Whether the weapon has the Penetrerande property
 * @param {number} critTalighet - Target's critical toughness modifier (usually 0)
 * @returns {number}
 */
export function criticalModifier(extraTwelves = 0, penetrerande = false, critTalighet = 0) {
  const penetrationBonus = penetrerande ? 2 : 0;
  return penetrationBonus + extraTwelves - critTalighet;
}
