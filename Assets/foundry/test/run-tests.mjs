/**
 * I Rikets Tjänst - Test Runner
 * Zero-dependency test runner using Node.js built-in assert.
 * Run: node Assets/foundry/test/run-tests.mjs
 */

import { runDerivedStatsTests } from "./derived-stats.test.mjs";
import { runDiceAnalysisTests } from "./dice-analysis.test.mjs";
import { runDamageCalcTests } from "./damage-calc.test.mjs";
import { runCriticalLookupTests } from "./critical-lookup.test.mjs";

const suites = [
  { name: "Derived Stats", fn: runDerivedStatsTests },
  { name: "Dice Analysis", fn: runDiceAnalysisTests },
  { name: "Damage Calculation", fn: runDamageCalcTests },
  { name: "Critical Table Lookup", fn: runCriticalLookupTests },
];

let totalPass = 0;
let totalFail = 0;

for (const suite of suites) {
  console.log(`\n--- ${suite.name} ---`);
  const { pass, fail } = suite.fn();
  totalPass += pass;
  totalFail += fail;
}

console.log(`\n${"=".repeat(40)}`);
console.log(`Total: ${totalPass} passed, ${totalFail} failed`);
if (totalFail > 0) {
  process.exit(1);
} else {
  console.log("All tests passed!");
}
