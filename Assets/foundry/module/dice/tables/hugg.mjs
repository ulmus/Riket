/** Hugg (Slashing) critical hit table */
export const HUGG = [
  { min: 1, max: 1, label: "Ytligt snitt", effect: "Ta 1 Stress." },
  { min: 2, max: 2, label: "Köttskada", effect: "Blodigt men ytligt. Lätt blödning tills behandlad." },
  { min: 3, max: 3, label: "Senan skuren", effect: "Slå 1T12 för kroppsdel (1-3: vänster arm, 4-6: höger arm, 7-9: vänster ben, 10-12: höger ben). Smidighet-slag är minst Svåra med drabbad kroppsdel tills behandlad." },
  { min: 4, max: 4, label: "Djupt hugg i arm", effect: "Slå 1T12: 1-6 vänster, 7-12 höger arm. Du tappar vad du håller i. Lätt blödning. Armen obrukbar tills behandlad." },
  { min: 5, max: 5, label: "Djupt hugg i ben", effect: "Slå 1T12: 1-6 vänster, 7-12 höger ben. Kraftig blödning. Förflyttning halverad tills behandlad." },
  { min: 6, max: 6, label: "Ansikte skuret", effect: "Blod i ögonen. Sinnen-slag (syn) är minst Mycket Svåra tills du torkar bort blodet (en handling). Lätt blödning." },
  { min: 7, max: 7, label: "Skadat öga", effect: "Slå 1T12: 1-6 vänster, 7-12 höger öga. Sinnen-slag (syn) och avståndsattacker är minst Mycket Svåra. Kraftig blödning. Läketid: 1T12 veckor." },
  { min: 8, max: 8, label: "Djupt brösthugg", effect: "Kraftig blödning. Alla slag är minst Svåra. Läketid: 1T12 veckor." },
  { min: 9, max: 9, label: "Svårt skadat ben", effect: "Slå 1T12: 1-6 vänster, 7-12 höger ben. Du faller. Kan bara krypa. Kraftig blödning. Läketid: 1T12 månader." },
  { min: 10, max: 10, label: "Svårt skadad arm", effect: "Slå 1T12: 1-6 vänster, 7-12 höger arm. Armen obrukbar. Kraftig blödning. Läketid: 1T12 månader." },
  { min: 11, max: 11, label: "Djupt brösthugg med organskada", effect: "Kraftig blödning. Alla slag är minst Mycket Svåra. Döende: Överlevnadsslag per timme." },
  { min: 12, max: 12, label: "Ben avhugget", effect: "Slå 1T12: 1-6 vänster, 7-12 höger ben. Du faller. Kan inte gå. Kraftig blödning. Döende: Överlevnadsslag per minut. Permanent: Amputation." },
  { min: 13, max: 13, label: "Arm avhuggen", effect: "Slå 1T12: 1-6 vänster, 7-12 höger arm. Kraftig blödning. Döende: Överlevnadsslag per runda. Permanent: Amputation." },
  { min: 14, max: 14, label: "Klyvning av bröstkorgen", effect: "Inre organ skärs sönder. Döende: Överlevnadsslag per runda. Om du överlever: Permanent –3 på Fysik." },
  { min: 15, max: 99, label: "Avhugget huvud/halshugg", effect: "Du dör omedelbart." },
];
