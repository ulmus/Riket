import { analyzeDamage, calculateDamage, calcCritRoll } from "../module/dice/damage-roll.mjs";
import { criticalModifier } from "../module/dice/critical-tables.mjs";
import { runSuite, assertEqual } from "./test-helpers.mjs";

export function runDamageCalcTests() {
  return runSuite({
    "analyzeDamage: [10,11,12] => 3 kp, 1 crit": () => {
      const r = analyzeDamage([10, 11, 12]);
      assertEqual(r.kp, 3);
      assertEqual(r.critCount, 1);
    },

    "analyzeDamage: [5,3,2] => 0 kp, 0 crit": () => {
      const r = analyzeDamage([5, 3, 2]);
      assertEqual(r.kp, 0);
      assertEqual(r.critCount, 0);
    },

    "analyzeDamage: [12,12,12] => 3 kp, 3 crit": () => {
      const r = analyzeDamage([12, 12, 12]);
      assertEqual(r.kp, 3);
      assertEqual(r.critCount, 3);
    },

    "analyzeDamage: [1,9,10] => 1 kp, 0 crit": () => {
      const r = analyzeDamage([1, 9, 10]);
      assertEqual(r.kp, 1);
      assertEqual(r.critCount, 0);
    },

    "analyzeDamage: empty => 0 kp, 0 crit": () => {
      const r = analyzeDamage([]);
      assertEqual(r.kp, 0);
      assertEqual(r.critCount, 0);
    },

    "calculateDamage: dice [10,11,12], skada 1, skydd 0 => 4 KP": () => {
      const r = calculateDamage({ dice: [10, 11, 12], weaponSkada: 1, skydd: 0 });
      assertEqual(r.totalKP, 4);
      assertEqual(r.critCount, 1);
    },

    "calculateDamage: dice [5,3,2], skada 2, skydd 0 => 2 KP (flat only)": () => {
      const r = calculateDamage({ dice: [5, 3, 2], weaponSkada: 2, skydd: 0 });
      assertEqual(r.totalKP, 2);
      assertEqual(r.critCount, 0);
    },

    "calculateDamage: dice [10,11], skada 1, skydd 3 => 0 KP (armor absorbs)": () => {
      const r = calculateDamage({ dice: [10, 11], weaponSkada: 1, skydd: 3 });
      assertEqual(r.totalKP, 0);
    },

    "calculateDamage: minimum 0 KP (no negative)": () => {
      const r = calculateDamage({ dice: [1, 2, 3], weaponSkada: 0, skydd: 5 });
      assertEqual(r.totalKP, 0);
    },

    "calculateDamage: dice [12], skada 3, skydd 1 => 3 KP": () => {
      const r = calculateDamage({ dice: [12], weaponSkada: 3, skydd: 1 });
      assertEqual(r.totalKP, 3);
      assertEqual(r.critCount, 1);
    },

    "criticalModifier: skada 1, 0 extra, not penetrerande => 1": () => {
      assertEqual(criticalModifier(1, 0, false), 1);
    },

    "criticalModifier: skada 2, 1 extra, not penetrerande => 3": () => {
      assertEqual(criticalModifier(2, 1, false), 3);
    },

    "criticalModifier: skada 2, 0 extra, penetrerande => 4": () => {
      assertEqual(criticalModifier(2, 0, true), 4);
    },

    "criticalModifier: skada 3, 2 extra, penetrerande => 8": () => {
      assertEqual(criticalModifier(3, 2, true), 8);
    },

    "criticalModifier: with critTalighet => subtracts": () => {
      assertEqual(criticalModifier(1, 0, false, 2), -1);
    },

    "calcCritRoll: base 7, skada 1, 0 extra => 8": () => {
      assertEqual(calcCritRoll(7, 1, 0, false), 8);
    },

    "calcCritRoll: base 7, skada 2, 1 extra, penetrerande => 12": () => {
      assertEqual(calcCritRoll(7, 2, 1, true), 12);
    },
  });
}
