/** Kross (Blunt) critical hit table */
export const KROSS = [
  { min: 1, max: 1, label: "Blåmärke", effect: "Smärtsamt men ofarligt. Ta 1 Stress." },
  { min: 2, max: 2, label: "Andan slagen ur dig", effect: "Du tappar andan. Nästa runda kan du antingen handla eller förflytta dig, inte båda." },
  { min: 3, max: 3, label: "Stukat finger", effect: "Slå 1T12 för kroppsdel (1-3: vänster hand, 4-6: höger hand, 7-9: vänster fot, 10-12: höger fot). Finmotorik är minst Svårt tills det är behandlat." },
  { min: 4, max: 4, label: "Örfil", effect: "Du är desorienterad. Sinnen-slag är minst Svåra under 1T12 rundor." },
  { min: 5, max: 5, label: "Slagen till marken", effect: "Du faller omkull och tappar vad du håller i. Ta 1 Stress." },
  { min: 6, max: 6, label: "Knäckt revben", effect: "Smärtsamt att andas. 1 Stress varje gång du rullar för Fysik eller Strid tills behandlad." },
  { min: 7, max: 7, label: "Krossad hand", effect: "Slå 1T12: 1-6 vänster, 7-12 höger hand. Handen är obrukbar tills behandlad (Kirurgi). Du tappar omedelbart vad du håller i. Läketid: 1T12 veckor." },
  { min: 8, max: 8, label: "Hjärnskakning", effect: "Du är yr. Om du misslyckas med Analys- eller Sinnen-slag tappar du din nästa handling." },
  { min: 9, max: 9, label: "Brutet ben", effect: "Slå 1T12: 1-6 vänster, 7-12 höger ben. Du faller omkull. Du kan inte gå eller springa, endast krypa (1 meter per runda). Behandlas med Kirurgi. Läketid: 1T12 veckor." },
  { min: 10, max: 10, label: "Bruten arm", effect: "Slå 1T12: 1-6 vänster, 7-12 höger arm. Armen är obrukbar. Försök att använda den misslyckas automatiskt. Behandlas med Kirurgi. Läketid: 1T12 veckor." },
  { min: 11, max: 11, label: "Skalltrauma", effect: "Du blir medvetslös. Slå Fysik + Vilja varje runda för att vakna. Akut döende. Permanent: –1 på Analys-slag under tidspress." },
  { min: 12, max: 12, label: "Krossad skalle", effect: "Akut döende. Om du överlever: Permanent –2 på Analys och Sinnen." },
  { min: 13, max: 13, label: "Krossat ansikte", effect: "Akut döende. Om du överlever: Permanent –2 på Sinnen och Samspel (vanställd)." },
  { min: 14, max: 14, label: "Krossad bröstorg", effect: "Inre organ svårt skadade. Akut döende. Om du överlever: Permanent –3 på Fysik." },
  { min: 15, max: 99, label: "Krossad till döds", effect: "Du dör omedelbart." },
];
