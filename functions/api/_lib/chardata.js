// Helpers for validating and naming the character snapshot the sheet sends.

export const MAX_DATA_BYTES = 1024 * 1024; // ceiling for one character (incl. an inline photo data: URI)

/** The snapshot must be a plain object (the sheet's serialize() output). */
export function validData(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}

/** Display name: explicit name, else the sheet's kodnamn/namn, else a fallback. */
export function resolveName(name, data) {
  if (typeof name === "string" && name.trim()) return name.trim().slice(0, 120);
  const f = (data && data.fields) || {};
  const fromSheet = String(f.kodnamn || f.namn || "").trim();
  return (fromSheet || "Namnlös rollperson").slice(0, 120);
}
