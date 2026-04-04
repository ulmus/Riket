/** Eld (Fire) critical hit table */
export const ELD = [
  { min: 1, max: 1, label: "Svedd", effect: "Obehagligt. Ta 1 Stress." },
  { min: 2, max: 2, label: "Ytlig brännskada", effect: "Smärtsamt. Finmotorik är minst Svårt om händerna är drabbade." },
  { min: 3, max: 3, label: "Bränd hud", effect: "Slå 1T12 för kroppsdel (1-3: vänster arm, 4-6: höger arm, 7-9: vänster ben, 10-12: höger ben). Slag som involverar det brända området är minst Svåra tills behandlad." },
  { min: 4, max: 4, label: "Brinnande kläder", effect: "Om du inte släcker (bihandling) tar du 3 skadetärningar nästa runda." },
  { min: 5, max: 5, label: "Djup brännskada", effect: "Extrem smärta. Ta 2 Stress. Alla slag är minst Svåra tills behandlad." },
  { min: 6, max: 6, label: "Brända händer", effect: "Du tappar vad du håller i. Kan inte använda händerna tills behandlad." },
  { min: 7, max: 7, label: "Bränt ansikte", effect: "Sinnen-slag (syn) är minst Mycket Svåra tills behandlad (Medicin). Lätt blödning. Läketid: 1T12 veckor." },
  { min: 8, max: 8, label: "Svåra brännskador", effect: "Slå 1T12 för kroppsdel. Alla fysiska slag är minst Mycket Svåra. Läketid: 1T12 veckor." },
  { min: 9, max: 9, label: "Inandad het gas", effect: "Lungorna skadas. Endast en bihandling per runda. Fysik-slag är minst Mycket Svåra. Behandlas med Medicin (Svårt). Läketid: 1T12 dagar." },
  { min: 10, max: 10, label: "Allvarliga brännskador", effect: "Alla slag är minst Mycket Svåra. Läketid: 1T12 månader." },
  { min: 11, max: 11, label: "Inandad het gas – lungskada", effect: "Lungorna svårt skadade. Endast en bihandling per runda. Döende: Överlevnadsslag per minut. Behandlas med Kirurgi (Mycket Svårt). Läketid: 1T12 månader." },
  { min: 12, max: 12, label: "Tredje gradens brännskada", effect: "Döende: Överlevnadsslag per minut. Behandlas med Kirurgi (Mycket Svårt). Om du överlever: Permanent svåra ärr, –1 på Smidighet. Läketid: 1T12 månader." },
  { min: 13, max: 13, label: "Förkolnad", effect: "Döende: Överlevnadsslag per runda. Behandlas med Kirurgi (Mycket Svårt). Om du överlever: Permanent –2 på Smidighet och Samspel. Läketid: 1T12 månader." },
  { min: 14, max: 14, label: "Förkolnade lungor", effect: "Andningsvävnad förstörd. Döende: Överlevnadsslag per runda. Behandlas med Kirurgi (Mycket Svårt). Om du överlever: Permanent –3 på Fysik (andningssvårigheter). Läketid: 1T12 månader." },
  { min: 15, max: 99, label: "Förbränd levande", effect: "Du dör omedelbart." },
];
