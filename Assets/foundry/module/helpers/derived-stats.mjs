/**
 * I Rikets Tjänst - Derived Stats Calculator
 * Pure functions for calculating secondary attributes and damage thresholds.
 * No Foundry dependency - testable with Node.js.
 */

/**
 * Calculate Tålighet (Toughness) from Fysik.
 * Formula: 1 + ceil(Fysik / 2)
 */
export function calcTalighet(fysik) {
  return 1 + Math.ceil(fysik / 2);
}

/**
 * Calculate Stabilitet (Stability) from Vilja.
 * Formula: 1 + ceil(Vilja / 2)
 */
export function calcStabilitet(vilja) {
  return 1 + Math.ceil(vilja / 2);
}

/**
 * Calculate Förflyttning (Movement) from Fysik + Smidighet.
 */
export function calcForflyttning(fysik, smidighet) {
  return fysik + smidighet;
}

/**
 * Calculate Slagstyrka (Melee Bonus) from Fysik.
 * Formula: floor(Fysik / 2)
 */
export function calcSlagstyrka(fysik) {
  return Math.floor(fysik / 2);
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
  const talighet = calcTalighet(attrs.fysik);
  const kpMax = calcKpMax(attrs.fysik, attrs.vilja);
  return {
    talighet,
    stabilitet: calcStabilitet(attrs.vilja),
    forflyttning: calcForflyttning(attrs.fysik, attrs.smidighet),
    slagstyrka: calcSlagstyrka(attrs.fysik),
    kpMax,
  };
}
