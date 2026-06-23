/** Explosion critical hit table */
export const EXPLOSION = [
  { min: 1, max: 1, label: "Överrumplad", effect: "Du faller omkull. Ta 1 Stress." },
  { min: 2, max: 2, label: "Tillfällig dövhet", effect: "Sinnen-slag (hörsel) är minst Mycket Svåra under 1T12 minuter." },
  { min: 3, max: 3, label: "Splitter i huden", effect: "Smärtsamt. Lätt blödning. Ta 1 Stress." },
  { min: 4, max: 4, label: "Slungades iväg", effect: "Du flyger 1T12 meter och faller. Ta 1T12 KP skada (Kross) från fallet." },
  { min: 5, max: 5, label: "Tryckvågsskada", effect: "Lungorna skadas. Fysiska slag är minst Svåra. Ta 2 Stress." },
  { min: 6, max: 6, label: "Djupt splitter", effect: "Kraftig blödning. Splittret måste opereras ut (Kirurgi, Svårt)." },
  { min: 7, max: 7, label: "Örontrumma sprucken", effect: "Sinnen-slag (hörsel) är minst Mycket Svåra. Läketid: 1T12 månader." },
  { min: 8, max: 8, label: "Krossade revben", effect: "Fysik-slag är minst Mycket Svåra. Kraftig blödning. Läketid: 1T12 veckor." },
  { min: 9, max: 9, label: "Svårt skadat ben", effect: "Slå 1T12: 1-6 vänster, 7-12 höger ben. Benet obrukbart. Kraftig blödning. Läketid: 1T12 månader." },
  { min: 10, max: 10, label: "Svårt skadad arm", effect: "Slå 1T12: 1-6 vänster, 7-12 höger arm. Armen obrukbar. Kraftig blödning. Läketid: 1T12 månader." },
  { min: 11, max: 11, label: "Krossade revben – intern skada", effect: "Fysik-slag är minst Mycket Svåra. Kraftig blödning. Döende." },
  { min: 12, max: 12, label: "Massiv intern skada", effect: "Inre organ krossade av tryckvågen. Akut döende. Om du överlever: Permanent –2 på Fysik, permanent hörselskada." },
  { min: 13, max: 13, label: "Arm/ben avslivet", effect: "Slå 1T12 för kroppsdel (1-6: ben, 7-12: arm), sedan udda/jämnt för sida. Kraftig blödning. Akut döende. Permanent: Amputation." },
  { min: 14, max: 14, label: "Bortsprängd bröstorg", effect: "Akut döende. Om du överlever: Permanent –4 på Fysik." },
  { min: 15, max: 99, label: "Bortsprängd", effect: "Du dör omedelbart." },
];
