/** Gift (Poison) critical hit table */
export const GIFT = [
  { min: 1, max: 1, label: "Illamående", effect: "Ta 1 Stress." },
  { min: 2, max: 2, label: "Yrsel", effect: "Alla slag är minst Svåra under 1T12 minuter." },
  { min: 3, max: 3, label: "Magkramper", effect: "Fysik-slag är minst Svåra under närmsta dygnet eller tills behandlad (Medicin)." },
  { min: 4, max: 4, label: "Förvirring", effect: "Analys-slag är minst Svåra under närmsta dygnet eller tills behandlad (Medicin). Ta 1 Stress." },
  { min: 5, max: 5, label: "Muskelspasmer", effect: "Du tappar vad du håller i. Smidighet-slag är minst Svåra under närmsta dygnet eller tills behandlad (Medicin)." },
  { min: 6, max: 6, label: "Hallucinationer", effect: "Du ser och hör saker som inte finns. Alla slag är minst Mycket Svåra under närmsta dygnet eller tills behandlad (Medicin, Svårt). Ta 2 Stress." },
  { min: 7, max: 7, label: "Kramper", effect: "Du faller och rycker okontrollerat i 1T12 rundor. Kan inte agera." },
  { min: 8, max: 8, label: "Svår förgiftning", effect: "Alla slag är minst Mycket Svåra. Behandlas med Medicin (Svårt)." },
  { min: 9, max: 9, label: "Andnöd", effect: "Du kan inte både handla och förflytta dig samma runda. Alla slag är minst Mycket Svåra." },
  { min: 10, max: 10, label: "Lever-/njursvikt", effect: "Alla slag är minst Mycket Svåra. Kräver sjukhusvård." },
  { min: 11, max: 11, label: "Svår andnöd", effect: "Du kan inte både handla och förflytta dig samma runda, och dina handlingar är ett steg svårare. Akut döende om ingen motgift." },
  { min: 12, max: 12, label: "Hjärtarytmi", effect: "Ta 2 Stress. Akut döende." },
  { min: 13, max: 13, label: "Neurologisk skada", effect: "Slår ut nervsystemet. Akut döende. Om du överlever: Permanent –1 på Smidighet." },
  { min: 14, max: 14, label: "Systemisk kollaps", effect: "Akut döende (kräver motgift för att stabiliseras). Om du överlever: Permanent –1 på Fysik." },
  { min: 15, max: 99, label: "Dödlig gift", effect: "Du dör omedelbart." },
];
