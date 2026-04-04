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
  if (!_deepEqual(actual, expected)) {
    throw new Error(`${msg ? msg + ": " : ""}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function _deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => _deepEqual(a[k], b[k]));
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
