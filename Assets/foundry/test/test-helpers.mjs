/**
 * Minimal test helper - no dependencies.
 */

export function runSuite(tests) {
  let pass = 0;
  let fail = 0;
  for (const [name, fn] of Object.entries(tests)) {
    try {
      fn();
      console.log(`  PASS  ${name}`);
      pass++;
    } catch (e) {
      console.log(`  FAIL  ${name}: ${e.message}`);
      fail++;
    }
  }
  return { pass, fail };
}

export function assertEqual(actual, expected, msg = "") {
  if (actual !== expected) {
    throw new Error(`${msg ? msg + ": " : ""}expected ${expected}, got ${actual}`);
  }
}

export function assertDeepEqual(actual, expected, msg = "") {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(`${msg ? msg + ": " : ""}expected ${e}, got ${a}`);
  }
}

export function assertTruthy(val, msg = "") {
  if (!val) {
    throw new Error(`${msg ? msg + ": " : ""}expected truthy value, got ${val}`);
  }
}

export function assertNull(val, msg = "") {
  if (val !== null) {
    throw new Error(`${msg ? msg + ": " : ""}expected null, got ${JSON.stringify(val)}`);
  }
}
