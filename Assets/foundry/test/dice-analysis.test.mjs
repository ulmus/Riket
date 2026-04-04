import { analyzeResults, isSuccess } from "../module/dice/irt-roll.mjs";
import { runSuite, assertEqual, assertDeepEqual } from "./test-helpers.mjs";

export function runDiceAnalysisTests() {
  return runSuite({
    "analyzeResults: all misses [1,5,9]": () => {
      const r = analyzeResults([1, 5, 9]);
      assertEqual(r.successes, 0);
      assertEqual(r.fokusEarned, 0);
    },

    "analyzeResults: mixed [10,11,12]": () => {
      const r = analyzeResults([10, 11, 12]);
      assertEqual(r.successes, 3);
      assertEqual(r.fokusEarned, 1);
    },

    "analyzeResults: all 12s [12,12,12]": () => {
      const r = analyzeResults([12, 12, 12]);
      assertEqual(r.successes, 3);
      assertEqual(r.fokusEarned, 3);
    },

    "analyzeResults: single die fail [1]": () => {
      const r = analyzeResults([1]);
      assertEqual(r.successes, 0);
      assertEqual(r.fokusEarned, 0);
    },

    "analyzeResults: single die success [10]": () => {
      const r = analyzeResults([10]);
      assertEqual(r.successes, 1);
      assertEqual(r.fokusEarned, 0);
    },

    "analyzeResults: single die fokus [12]": () => {
      const r = analyzeResults([12]);
      assertEqual(r.successes, 1);
      assertEqual(r.fokusEarned, 1);
    },

    "analyzeResults: empty array": () => {
      const r = analyzeResults([]);
      assertEqual(r.successes, 0);
      assertEqual(r.fokusEarned, 0);
    },

    "analyzeResults: boundary - 9 is not success": () => {
      const r = analyzeResults([9]);
      assertEqual(r.successes, 0);
    },

    "analyzeResults: boundary - 10 is success": () => {
      const r = analyzeResults([10]);
      assertEqual(r.successes, 1);
    },

    "analyzeResults: boundary - 11 is success but not fokus": () => {
      const r = analyzeResults([11]);
      assertEqual(r.successes, 1);
      assertEqual(r.fokusEarned, 0);
    },

    "analyzeResults: large pool [1,2,3,4,5,6,7,8,9,10,11,12]": () => {
      const r = analyzeResults([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      assertEqual(r.successes, 3);
      assertEqual(r.fokusEarned, 1);
    },

    "isSuccess: 1 success, difficulty 1 => true": () => assertEqual(isSuccess(1, 1), true),
    "isSuccess: 0 successes, difficulty 1 => false": () => assertEqual(isSuccess(0, 1), false),
    "isSuccess: 2 successes, difficulty 2 => true": () => assertEqual(isSuccess(2, 2), true),
    "isSuccess: 1 success, difficulty 2 => false": () => assertEqual(isSuccess(1, 2), false),
    "isSuccess: 3 successes, difficulty 3 => true": () => assertEqual(isSuccess(3, 3), true),
    "isSuccess: 2 successes, difficulty 3 => false": () => assertEqual(isSuccess(2, 3), false),
    "isSuccess: 5 successes, difficulty 1 => true": () => assertEqual(isSuccess(5, 1), true),
  });
}
