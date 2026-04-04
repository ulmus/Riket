/** Stick (Piercing) critical hit table */
export const STICK = [
  { min: 1, max: 1, label: "Ytlig rispa", effect: "Smärtsamt. Ta 1 Stress." },
  { min: 2, max: 2, label: "Skärsår", effect: "Smärtsamt. Smidighet-slag är minst Svåra tills behandlad." },
  { min: 3, max: 3, label: "Genomstucken lårmuskel", effect: "Halverad förflyttning och ta 1 Stress varje gång du förflyttar dig. Båda effekter gäller tills behandlad (Medicin). Lätt blödning." },
  { min: 4, max: 4, label: "Genomstucken hand", effect: "Slå 1T12, 1-6 vänster, 7-12 höger hand. Alla slag som görs med handen är minst Svåra och Lätt blödning tills behandlad (Medicin)." },
  { min: 5, max: 5, label: "Djupt sticksår", effect: "Kraftig blödning tills behandlad (Kirurgi). Ta 1 Stress." },
  { min: 6, max: 6, label: "Genomstucken hand/fot", effect: "Slå 1T12, 1-3 vänster fot, 4-6 höger fot, 7-9 vänster hand, 10-12 höger hand. Kroppsdelen är obrukbar tills behandlad (Medicin). Lätt blödning." },
  { min: 7, max: 7, label: "Stucken i armen", effect: "Slå 1T12: 1-6 vänster, 7-12 höger arm. Armen obrukbar. Kraftig blödning. Behandlas med Kirurgi (Svårt). Läketid: 1T12 veckor." },
  { min: 8, max: 8, label: "Genomstucken axel", effect: "Slå 1T12: 1-6 vänster, 7-12 höger axel. Kraftig blödning. Alla slag är minst Svåra. Behandlas med Kirurgi (Svårt). Läketid: 1T12 veckor." },
  { min: 9, max: 9, label: "Perforerad lunga", effect: "Du kippar efter luft. Endast en bihandling per runda tills behandlad (Kirurgi, Svårt). Kraftig blödning." },
  { min: 10, max: 10, label: "Njurträff", effect: "Extremt smärtsamt. Ta 2 Stress. Kraftig blödning. Behandlas med Kirurgi (Svårt)." },
  { min: 11, max: 11, label: "Stucken i magen", effect: "Kraftig blödning. Fysik-slag är minst Svåra. Döende: Överlevnadsslag per timme om obehandlad. Behandlas med Kirurgi (Svårt)." },
  { min: 12, max: 12, label: "Artärblödning", effect: "Kraftig blödning. Döende: Överlevnadsslag per minut tills blödningen stoppas (Kirurgi)." },
  { min: 13, max: 13, label: "Genomstucket hjärtsäck", effect: "Döende: Överlevnadsslag per runda. Behandlas med Kirurgi (Mycket Svårt). Om du överlever: Permanent –1 på Fysik." },
  { min: 14, max: 14, label: "Genomstucken halspulsåder", effect: "Kraftig blödning. Döende: Överlevnadsslag per runda. Behandlas med Kirurgi (Mycket Svårt). Om du överlever: Permanent –2 på Fysik och Analys (hjärnskada)." },
  { min: 15, max: 99, label: "Stucken genom hjärtat", effect: "Du dör omedelbart." },
];
