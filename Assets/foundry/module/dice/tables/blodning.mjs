/** Blödning (Bleeding) critical hit table */
export const BLODNING = [
  { min: 1, max: 1, label: "Yrsel", effect: "Ta 1 Stress." },
  { min: 2, max: 2, label: "Svaghet", effect: "Fysik-slag är minst Svåra tills blodet ersätts." },
  { min: 3, max: 3, label: "Kallsvettig", effect: "Ta 1 Stress. Förflyttning –2 meter." },
  { min: 4, max: 4, label: "Skakningar", effect: "Du tappar vad du håller i." },
  { min: 5, max: 5, label: "Blodförlust", effect: "Du blir kallare. Alla slag är minst Svåra." },
  { min: 6, max: 6, label: "Kollapsande blodtryck", effect: "Du faller omkull. Kan bara krypa (1 meter per runda)." },
  { min: 7, max: 7, label: "Synförlust", effect: "Svartnande syn. Sinnen-slag (syn) är minst Mycket Svåra." },
  { min: 8, max: 8, label: "Förlorar medvetandet", effect: "Du svimmar. Vaknar om du stabiliseras eller efter 1T12 minuter." },
  { min: 9, max: 9, label: "Chock", effect: "Medvetslös. Kräver stabilisering för att vakna." },
  { min: 10, max: 10, label: "Hypovolemisk chock", effect: "Medvetslös. Alla slag är minst Mycket Svåra om du vaknar. Kräver stabilisering och vård." },
  { min: 11, max: 11, label: "Svår hypovolemisk chock", effect: "Akut döende." },
  { min: 12, max: 12, label: "Organsvikt", effect: "Akut döende. Permanent: –1 på Fysik." },
  { min: 13, max: 13, label: "Hjärtstillestånd", effect: "Akut döende (kräver hjärt-lungräddning för att stabiliseras)." },
  { min: 14, max: 14, label: "Total cirkulationskollaps", effect: "Akut döende. Om du överlever: Permanent –2 på Fysik och Vilja (hjärnskada)." },
  { min: 15, max: 99, label: "Förblödd till döds", effect: "Du dör omedelbart." },
];
