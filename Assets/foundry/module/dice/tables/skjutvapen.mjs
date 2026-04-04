/** Skjutvapen (Firearms) critical hit table */
export const SKJUTVAPEN = [
  { min: 1, max: 1, label: "Rikoschett", effect: "Splitskada. Ta 1 Stress." },
  { min: 2, max: 2, label: "Genomskott i mjukvävnad", effect: "Lätt blödning tills behandlad." },
  { min: 3, max: 3, label: "Skottsår i arm", effect: "Slå 1T12: 1-6 vänster, 7-12 höger arm. Slag med den armen är minst Svåra. Lätt blödning." },
  { min: 4, max: 4, label: "Skottsår i ben", effect: "Slå 1T12: 1-6 vänster, 7-12 höger ben. Förflyttning halverad. Lätt blödning." },
  { min: 5, max: 5, label: "Kula fastnad", effect: "Smärtsamt. Ta 1 Stress. Måste opereras ut (Kirurgi). Fysik-slag är minst Svåra tills utopererad." },
  { min: 6, max: 6, label: "Genomskjuten hand", effect: "Slå 1T12: 1-6 vänster, 7-12 höger hand. Handen obrukbar tills behandlad. Lätt blödning." },
  { min: 7, max: 7, label: "Skottsår i magen", effect: "Kraftig blödning. Alla slag är minst Svåra. Behandlas med Kirurgi (Svårt)." },
  { min: 8, max: 8, label: "Genomskjuten axel", effect: "Slå 1T12: 1-6 vänster, 7-12 höger axel. Armen obrukbar. Kraftig blödning. Läketid: 1T12 veckor." },
  { min: 9, max: 9, label: "Lungskott", effect: "Endast en bihandling per runda. Kraftig blödning. Läketid: 1T12 veckor." },
  { min: 10, max: 10, label: "Njurskott", effect: "Ta 2 Stress. Kraftig blödning. Behandlas med Kirurgi (Svårt)." },
  { min: 11, max: 11, label: "Lungskott – kollapsad lunga", effect: "Endast en bihandling per runda. Kraftig blödning. Döende: Överlevnadsslag per timme." },
  { min: 12, max: 12, label: "Artärträff", effect: "Kraftig blödning. Döende: Överlevnadsslag per minut." },
  { min: 13, max: 13, label: "Hjärtskott", effect: "Döende: Överlevnadsslag per runda. Om du överlever: Permanent –2 på Fysik." },
  { min: 14, max: 14, label: "Ryggradsskott", effect: "Döende: Överlevnadsslag per runda. Om du överlever: Permanent: Förlamning." },
  { min: 15, max: 99, label: "Huvudskott", effect: "Du dör omedelbart." },
];
