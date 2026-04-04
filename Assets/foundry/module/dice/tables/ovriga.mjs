/** Övriga (Other) critical hit table - fall, suffocation, electricity, hypothermia, etc. */
export const OVRIGA = [
  { min: 1, max: 1, label: "Skärrad", effect: "Ta 1 Stress." },
  { min: 2, max: 2, label: "Stukad led", effect: "Slå 1T12 för kroppsdel (1-3: vänster arm, 4-6: höger arm, 7-9: vänster ben, 10-12: höger ben). Slag med drabbad kroppsdel är minst Svåra under 1T12 dagar." },
  { min: 3, max: 3, label: "Smärta", effect: "Ta 1 Stress. Alla slag är minst Svåra under 1T12 rundor." },
  { min: 4, max: 4, label: "Tappat andan", effect: "Förlorar din nästa handling." },
  { min: 5, max: 5, label: "Desorienterad", effect: "Sinnen- och Analys-slag är minst Mycket Svåra under 1T12 minuter." },
  { min: 6, max: 6, label: "Slagen till marken", effect: "Du faller omkull. Ta 1 Stress." },
  { min: 7, max: 7, label: "Bedövad", effect: "Du kan inte agera nästa runda." },
  { min: 8, max: 8, label: "Bruten kroppsdel", effect: "Slå 1T12 för kroppsdel (1-3: vänster arm, 4-6: höger arm, 7-9: vänster ben, 10-12: höger ben). Kroppsdelen obrukbar tills behandlad (Kirurgi). Läketid: 1T12 veckor." },
  { min: 9, max: 9, label: "Medvetslös", effect: "Du vaknar efter 1T12 minuter eller när du behandlas." },
  { min: 10, max: 10, label: "Intern skada", effect: "Alla slag är minst Mycket Svåra. Behandlas med Kirurgi (Svårt)." },
  { min: 11, max: 11, label: "Svår intern skada", effect: "Alla slag är minst Mycket Svåra. Döende: Överlevnadsslag per timme." },
  { min: 12, max: 12, label: "Svår systemisk skada", effect: "Döende: Överlevnadsslag per minut. Om du överlever: Permanent –1 på Fysik." },
  { min: 13, max: 13, label: "Kritisk organsvikt", effect: "Döende: Överlevnadsslag per runda." },
  { min: 14, max: 14, label: "Total systemkollaps", effect: "Döende: Överlevnadsslag per runda. Om du överlever: Permanent –2 på Fysik och Vilja." },
  { min: 15, max: 99, label: "Katastrofal skada", effect: "Du dör omedelbart." },
];
