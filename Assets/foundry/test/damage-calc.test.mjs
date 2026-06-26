import { calculateDamage, calcCritRoll } from "../module/dice/damage-roll.mjs";
import { criticalModifier } from "../module/dice/critical-tables.mjs";
import { runSuite, assertEqual } from "./test-helpers.mjs";

export function runDamageCalcTests() {
  return runSuite({
    "calculateDamage: 3 successes, skada 1, skydd 0 => 4 KP": () => {
      const r = calculateDamage({ successes: 3, weaponSkada: 1, skydd: 0 });
      assertEqual(r.totalKP, 4);
    },

    "calculateDamage: 0 successes, skada 2 => 2 KP (still hits for Skada)": () => {
      const r = calculateDamage({ successes: 0, weaponSkada: 2, skydd: 0 });
      assertEqual(r.totalKP, 2);
    },

    "calculateDamage: 2 successes, skada 1, skydd 3 => 0 KP (armor absorbs)": () => {
      const r = calculateDamage({ successes: 2, weaponSkada: 1, skydd: 3 });
      assertEqual(r.totalKP, 0);
    },

    "calculateDamage: minimum 0 KP (no negative)": () => {
      const r = calculateDamage({ successes: 0, weaponSkada: 0, skydd: 5 });
      assertEqual(r.totalKP, 0);
    },

    "calculateDamage: 1 success, skada 3, skydd 1 => 3 KP": () => {
      const r = calculateDamage({ successes: 1, weaponSkada: 3, skydd: 1 });
      assertEqual(r.totalKP, 3);
    },

    "calculateDamage: high successes, no skada, no skydd": () => {
      const r = calculateDamage({ successes: 6, weaponSkada: 0, skydd: 0 });
      assertEqual(r.totalKP, 6);
    },

    "criticalModifier: 0 extra, not penetrerande => 0 (Skada never applies)": () => {
      assertEqual(criticalModifier(0, false), 0);
    },

    "criticalModifier: 1 extra, not penetrerande => 1": () => {
      assertEqual(criticalModifier(1, false), 1);
    },

    "criticalModifier: 0 extra, penetrerande => +2 flat": () => {
      assertEqual(criticalModifier(0, true), 2);
    },

    "criticalModifier: 2 extra, penetrerande => 4": () => {
      assertEqual(criticalModifier(2, true), 4);
    },

    "criticalModifier: with critTalighet => subtracts": () => {
      assertEqual(criticalModifier(0, false, 2), -2);
    },

    "calcCritRoll: base 7, 0 extra, not penetrerande => 7": () => {
      assertEqual(calcCritRoll(7, 0, false), 7);
    },

    "calcCritRoll: base 7, 1 extra, penetrerande => 10": () => {
      assertEqual(calcCritRoll(7, 1, true), 10);
    },
  });
}
