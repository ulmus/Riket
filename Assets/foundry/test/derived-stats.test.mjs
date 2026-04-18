import { calcTalighet, calcStabilitet, calcForflyttning, calcSlagstyrka, calcKpMax, calcSkadeniva, calcAllDerived } from "../module/helpers/derived-stats.mjs";
import { runSuite, assertEqual, assertDeepEqual } from "./test-helpers.mjs";

export function runDerivedStatsTests() {
  return runSuite({
    "calcTalighet: 1+1 => 2": () => assertEqual(calcTalighet(1, 1), 2),
    "calcTalighet: 2+3 => 5": () => assertEqual(calcTalighet(2, 3), 5),
    "calcTalighet: 3+3 => 6": () => assertEqual(calcTalighet(3, 3), 6),
    "calcTalighet: 5+4 => 9": () => assertEqual(calcTalighet(5, 4), 9),
    "calcTalighet: 5+5 => 10": () => assertEqual(calcTalighet(5, 5), 10),

    "calcStabilitet: Vilja 1 => 2": () => assertEqual(calcStabilitet(1), 2),
    "calcStabilitet: Vilja 2 => 2": () => assertEqual(calcStabilitet(2), 2),
    "calcStabilitet: Vilja 3 => 3": () => assertEqual(calcStabilitet(3), 3),
    "calcStabilitet: Vilja 4 => 3": () => assertEqual(calcStabilitet(4), 3),
    "calcStabilitet: Vilja 5 => 4": () => assertEqual(calcStabilitet(5), 4),

    "calcForflyttning: 2+3 => 5": () => assertEqual(calcForflyttning(2, 3), 5),
    "calcForflyttning: 5+5 => 10": () => assertEqual(calcForflyttning(5, 5), 10),
    "calcForflyttning: 1+1 => 2": () => assertEqual(calcForflyttning(1, 1), 2),

    "calcSlagstyrka: Fysik 1 => 0": () => assertEqual(calcSlagstyrka(1), 0),
    "calcSlagstyrka: Fysik 2 => 1": () => assertEqual(calcSlagstyrka(2), 1),
    "calcSlagstyrka: Fysik 3 => 1": () => assertEqual(calcSlagstyrka(3), 1),
    "calcSlagstyrka: Fysik 4 => 2": () => assertEqual(calcSlagstyrka(4), 2),
    "calcSlagstyrka: Fysik 5 => 2": () => assertEqual(calcSlagstyrka(5), 2),

    "calcKpMax: 2+3 => 5": () => assertEqual(calcKpMax(2, 3), 5),
    "calcKpMax: 5+5 => 10": () => assertEqual(calcKpMax(5, 5), 10),
    "calcKpMax: 1+1 => 2": () => assertEqual(calcKpMax(1, 1), 2),

    "calcSkadeniva: 0 damage => oskadd": () => assertEqual(calcSkadeniva(0, 5), "oskadd"),
    "calcSkadeniva: at talighet => oskadd": () => assertEqual(calcSkadeniva(5, 5), "oskadd"),
    "calcSkadeniva: above talighet => sarad": () => assertEqual(calcSkadeniva(6, 5), "sarad"),
    "calcSkadeniva: at 2x talighet => sarad": () => assertEqual(calcSkadeniva(10, 5), "sarad"),
    "calcSkadeniva: above 2x talighet => medvetslos": () => assertEqual(calcSkadeniva(11, 5), "medvetslos"),
    "calcSkadeniva: above 3x talighet => doende": () => assertEqual(calcSkadeniva(16, 5), "doende"),
    "calcSkadeniva: above 4x talighet => dod": () => assertEqual(calcSkadeniva(21, 5), "dod"),

    "calcAllDerived: example character (Fysik 2, Vilja 4, Smidighet 3)": () => {
      const result = calcAllDerived({ fysik: 2, vilja: 4, smidighet: 3 });
      assertEqual(result.talighet, 6);
      assertEqual(result.stabilitet, 3);
      assertEqual(result.forflyttning, 5);
      assertEqual(result.slagstyrka, 1);
      assertEqual(result.kpMax, 6);
    },

    "calcAllDerived: min values (all 1s)": () => {
      const result = calcAllDerived({ fysik: 1, vilja: 1, smidighet: 1 });
      assertEqual(result.talighet, 2);
      assertEqual(result.stabilitet, 2);
      assertEqual(result.forflyttning, 2);
      assertEqual(result.slagstyrka, 0);
      assertEqual(result.kpMax, 2);
    },

    "calcAllDerived: max values (all 5s)": () => {
      const result = calcAllDerived({ fysik: 5, vilja: 5, smidighet: 5 });
      assertEqual(result.talighet, 10);
      assertEqual(result.stabilitet, 4);
      assertEqual(result.forflyttning, 10);
      assertEqual(result.slagstyrka, 2);
      assertEqual(result.kpMax, 10);
    },
  });
}
