import { CRITICAL_TABLES, DAMAGE_TYPE_KEYS, lookupCritical } from "../module/dice/critical-tables.mjs";
import { runSuite, assertEqual, assertTruthy, assertNull } from "./test-helpers.mjs";

export function runCriticalLookupTests() {
  const tests = {};

  // Test that all 10 tables exist
  tests["all 10 damage types present"] = () => {
    const expected = ["kross", "stick", "hugg", "eld", "skjutvapen", "explosion", "gift", "blodning", "stralning", "ovriga"];
    for (const key of expected) {
      assertTruthy(CRITICAL_TABLES[key], `Missing table: ${key}`);
    }
    assertEqual(DAMAGE_TYPE_KEYS.length, 10);
  };

  // Test each table has 15 entries covering 1-15+
  for (const key of DAMAGE_TYPE_KEYS) {
    tests[`${key}: has 15 entries`] = () => {
      assertEqual(CRITICAL_TABLES[key].length, 15, `${key} should have 15 entries`);
    };

    tests[`${key}: covers range 1-15+`] = () => {
      const table = CRITICAL_TABLES[key];
      // First entry should start at 1
      assertEqual(table[0].min, 1, `${key} first entry min`);
      // Last entry should go to 99 (15+)
      assertTruthy(table[table.length - 1].max >= 15, `${key} last entry should cover 15+`);
      // No gaps: each entry's min should be prev entry's max + 1
      for (let i = 1; i < table.length; i++) {
        assertEqual(table[i].min, table[i - 1].max + 1, `${key} gap between entries ${i - 1} and ${i}`);
      }
    };

    tests[`${key}: all entries have label and effect`] = () => {
      for (const entry of CRITICAL_TABLES[key]) {
        assertTruthy(entry.label, `${key} entry missing label`);
        assertTruthy(entry.effect, `${key} entry missing effect`);
      }
    };
  }

  // Specific lookup tests
  tests["lookupCritical: kross 1 => Blåmärke"] = () => {
    const r = lookupCritical("kross", 1);
    assertEqual(r.label, "Blåmärke");
  };

  tests["lookupCritical: skjutvapen 15 => Huvudskott (death)"] = () => {
    const r = lookupCritical("skjutvapen", 15);
    assertEqual(r.label, "Huvudskott");
    assertTruthy(r.effect.includes("dör omedelbart"));
  };

  tests["lookupCritical: skjutvapen 20 => also death (clamped to 15+)"] = () => {
    const r = lookupCritical("skjutvapen", 20);
    assertEqual(r.label, "Huvudskott");
  };

  tests["lookupCritical: invalid damage type => null"] = () => {
    const r = lookupCritical("nonexistent", 5);
    assertNull(r);
  };

  tests["lookupCritical: roll 0 clamped to 1"] = () => {
    const r = lookupCritical("kross", 0);
    assertEqual(r.label, "Blåmärke");
  };

  tests["lookupCritical: negative roll clamped to 1"] = () => {
    const r = lookupCritical("kross", -3);
    assertEqual(r.label, "Blåmärke");
  };

  tests["lookupCritical: hugg 15+ => Avhugget huvud/halshugg"] = () => {
    const r = lookupCritical("hugg", 15);
    assertEqual(r.label, "Avhugget huvud/halshugg");
  };

  tests["lookupCritical: eld 7 => Bränt ansikte"] = () => {
    const r = lookupCritical("eld", 7);
    assertEqual(r.label, "Bränt ansikte");
  };

  tests["lookupCritical: blodning 13 => Hjärtstillestånd"] = () => {
    const r = lookupCritical("blodning", 13);
    assertEqual(r.label, "Hjärtstillestånd");
  };

  return runSuite(tests);
}
