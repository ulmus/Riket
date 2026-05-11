/**
 * I Rikets Tjänst - Derived Stats Calculator
 * Pure functions for calculating secondary attributes and damage thresholds.
 * No Foundry dependency - testable with Node.js.
 */

/**
 * Calculate Tålighet (Toughness) from Fysik and Vilja.
 * Formula: Fysik + Vilja
 */
export function calcTalighet(fysik, vilja) {
  return fysik + vilja;
}

/**
 * Calculate Stabilitet (Stability).
 * Fixed at 3 for all characters.
 */
export function calcStabilitet(_vilja) {
  return 3;
}

/**
 * Calculate Förflyttning (Movement) from Fysik + Smidighet.
 */
export function calcForflyttning(fysik, smidighet) {
  return fysik + smidighet;
}

/**
 * Calculate KP max from Fysik + Vilja.
 */
export function calcKpMax(fysik, vilja) {
  return fysik + vilja;
}

/**
 * Determine damage level (skadenivå) from total KP damage and Tålighet.
 * Returns: "oskadd" | "sarad" | "medvetslos" | "doende" | "dod"
 */
export function calcSkadeniva(kpDamage, talighet) {
  if (kpDamage > 4 * talighet) return "dod";
  if (kpDamage > 3 * talighet) return "doende";
  if (kpDamage > 2 * talighet) return "medvetslos";
  if (kpDamage > talighet) return "sarad";
  return "oskadd";
}

/**
 * Calculate Sammanbrott (Breakdown) bonus from Stress and Stabilitet.
 * Formula: max(0, (floor(Stress / Stabilitet) - 1)) * 2
 * Each threshold beyond the first adds +2.
 */
export function calcSammanbrottsBonus(stress, stabilitet) {
  if (stabilitet <= 0) return 0;
  return Math.max(0, Math.floor(stress / stabilitet) - 1) * 2;
}

/**
 * Calculate all derived stats from primary attributes.
 * Returns an object with all secondary values.
 */
export function calcAllDerived(attrs) {
  const talighet = calcTalighet(attrs.fysik, attrs.vilja);
  const kpMax = calcKpMax(attrs.fysik, attrs.vilja);
  return {
    talighet,
    forflyttning: calcForflyttning(attrs.fysik, attrs.smidighet),
    kpMax,
  };
}
