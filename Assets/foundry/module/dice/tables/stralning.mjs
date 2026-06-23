/** Strålning (Radiation) critical hit table */
export const STRALNING = [
  { min: 1, max: 1, label: "Illamående", effect: "Ta 1 Stress." },
  { min: 2, max: 2, label: "Svaghet", effect: "Fysik-slag är minst Svåra under 1T12 dagar." },
  { min: 3, max: 3, label: "Kräkningar", effect: "Du förlorar 1 Stress och kan inte äta under det kommande dygnet." },
  { min: 4, max: 4, label: "Hudutslag", effect: "Röda, brännskadeliknande utslag. Smidighet-slag är minst Svåra under 1T12 dagar." },
  { min: 5, max: 5, label: "Håravfall", effect: "Håret faller av i tussar. Ta 2 Stress." },
  { min: 6, max: 6, label: "Feber", effect: "Immunförsvaret reagerar. Alla slag är minst Svåra under 1T12 dagar." },
  { min: 7, max: 7, label: "Inre blödning", effect: "Lätt blödning. Kräver sjukhusvård (Kirurgi, Mycket Svårt) för att stoppa." },
  { min: 8, max: 8, label: "Benmärgsskada", effect: "Alla slag är minst Mycket Svåra. Kräver sjukhusvård." },
  { min: 9, max: 9, label: "Lungskada", effect: "Du kan inte både handla och förflytta dig samma runda. Alla slag är minst Mycket Svåra. Kräver sjukhusvård." },
  { min: 10, max: 10, label: "Njursvikt", effect: "Alla slag är minst Mycket Svåra. Kräver sjukhusvård." },
  { min: 11, max: 11, label: "Benmärgsskada – systemkollaps", effect: "Alla slag är minst Mycket Svåra. Döende." },
  { min: 12, max: 12, label: "Organsvikt", effect: "Lever och njurar slutar fungera. Akut döende. Om du överlever: Permanent –1 på Fysik." },
  { min: 13, max: 13, label: "Multipel organsvikt", effect: "Akut döende. Om du överlever: Permanent –2 på Fysik." },
  { min: 14, max: 14, label: "Total cellnedbrytning", effect: "Akut döende. Om du överlever: Permanent –3 på Fysik och –2 på Vilja." },
  { min: 15, max: 99, label: "Akut stråldöd", effect: "Kroppen kollapsar. Du dör inom 1T12 timmar, inga Överlevnadsslag eller vård kan rädda dig." },
];
