# Regelgranskning inför publikation

En genomläsning av hela regelverket (alla filer under `content/Regler/` samt [[Introduktion]], [[Terminologi]] och `index.md`) med fokus på **språk**, **pedagogiskt upplägg**, **konsekventa regler** och **luckor**. Dokumentet är arbetsmaterial och publiceras inte på webbplatsen.

## Sammanfattning

Regelverket är i grunden starkt: mekaniken är enhetlig (Egenskap + Egenskap i T12, framgång på 10+), tonen är konsekvent genomförd, [[Stridsexempel]] är en pedagogisk pärla och spelledarkapitlet håller ovanligt hög klass. Det som återstår inför publikation är i fallande prioritet:

1. **Rätta direkta regelmotsägelser** — främst Chockfaktor för automateld (fyra olika värden på fyra ställen), definitionen av *stridstränad*, och en föråldrad Sammanbrottstabell i [[Terminologi]].
2. **Skriva om stabiliserings-/behandlingsreglerna** — samspelet mellan svårighet, framgångar-som-steg och blödning går inte ihop, och regelbokens eget stridsexempel följer inte reglerna som de är skrivna.
3. **Täppa luckor** — bl.a. tillståndslista, rustningstabell, umbärandeslag som en förmåga hänvisar till men som inte finns, samt vad ammunition 0 betyder.
4. **Språktvätt** — ett dussin konkreta fel (bl.a. "bygga rapport", "Du förlorar 1 Stress", felräknat sömnmedelsexempel) plus några anakronismer (5,56 mm-kulspruta och miljonprogramshus 1961).
5. **Omstrukturera lätt** — samla Fokus/Stress-reglerna, flytta [[Aktiviteter]] till kärnreglerna, och lägg en tillstånds- och utrustningssida.

---

## 1. Regelmotsägelser och buggar

Listade i fallande allvarlighetsgrad. Filhänvisningar inom parentes.

### 1.1 Chockfaktor för automateld — fyra olika värden

- `Vapen.md` §Automateld: "Chockslag med Chockfaktor **2**".
- `Strid och skada.md` §Skjuta tillbaka mot nedhållande eld: grund 1, "+1 om automateld" = **2** (samt −1 från skydd, +2 om många skjuter).
- `Trauma, chock och stress.md` §Chock, exempellistan: "Skjuta tillbaka mot nedhållande eld – Chock 1 (**3** om automateld)".
- `Förmågor.md` §Täckande eld: "Chockfaktor **3** (2 om stridstränade)".

**Förslag:** Bestäm ett kanoniskt värde (förslagsvis grundfaktor 1, +1 automateld, −1 från skydd, +2 många skyttar — dvs. modellen i Strid och skada), skriv den på *ett* ställe och låt övriga tre hänvisa dit. Justera Täckande eld så den refererar samma skala.

### 1.2 Vad är "stridstränad"?

Tre olika källor till egenskapen, ingen samlad definition:

- `Förmågor.md` §Stridsträning (Krav: Strid 3) — "Du räknas som *stridstränad*…".
- `Expertiser.md` §Soldat — fotnot: "En Soldat räknas som stridstränad…".
- `Stridsexempel.md` — "Tjuren är stridstränad (**Expertis: Officer**)", vilket ingen regel säger.

**Förslag:** Definiera *stridstränad* på ett ställe (lämpligen i [[Trauma, chock och stress]] eller [[Strid och skada]]): "Du är stridstränad om du har förmågan Stridsträning eller någon av expertiserna Soldat, Officer eller Polis" (eller det urval som är avsett). Låt förmågan och expertisfotnoterna hänvisa dit.

### 1.3 Terminologi-sidan är föråldrad på flera punkter

- **Sammanbrottseffekter:** Terminologis tabell (Skakad, Panik, Raseri, Förstelning, Desperat handling, Tillbakadragande) matchar inte den faktiska Sammanbrottstabellen i `Trauma, chock och stress.md` (Skakad, Uppjagad, Utbrott, Panikångest, Raseri, Traumat aktiverat, Trauma förvärrat). Detta ser ut som en äldre version av tabellen.
- **Döende-raden i skadestegstabellen:** Terminologi säger att man vid > 3 × Tålighet blir **Döende** ("långsam grad, slag per timme") — men `Strid och skada.md` säger att KP-chock gör dig **Akut döende** direkt. Nästa rad i Terminologi säger dessutom själv "KP-chock startar här" under Akut döende, så tabellen motsäger sig själv.
- **Komplikation:** "vid etta på slag efter att ha spenderat Fokus" — regeln är etta *på en tillagd tärning*, inte på hela slaget.

**Förslag:** Gör en systematisk synk av Terminologi mot kapitlen, eller ännu hellre: banta Terminologi till rena definitioner (en mening per term, utan siffror) och låt alla värden bo i respektive kapitel. Duplicerade tabeller är den vanligaste källan till drift.

### 1.4 Stabilisering/behandling — regeltexten går inte ihop

`Strid och skada.md` §Stabilisering säger både "Den vårdtyp och **svårighet** som den kritiska träffens rad anger" *och* "**Varje framgång** tar ner dig ett steg … **Effekt** kan kliva ner ytterligare steg". De tre påståendena är sinsemellan oförenliga:

- Om varje framgång = ett steg, vad gör då svårigheten? (Ett Mycket Svårt slag med 3 framgångar — är det 3 steg, eller 1 lyckat + 0 Effekt?)
- "Effekt kan kliva ner ytterligare steg" är redundant om varje framgång redan är ett steg.
- I `Stridsexempel.md` stoppar Silke med **ett** slag (Mycket Svårt, 3 framgångar, 0 Effekt) *både* Kraftig blödning (två steg: Kraftig → Lätt → Inget) *och* kliver Radar två steg (Akut döende → Stabil). Det går inte att räkna hem med någon av läsningarna — exemplet följer inte reglerna.

**Förslag:** Välj en modell och skriv om avsnittet med ett räkneexempel. Enklast och mest konsekvent med resten av systemet: *svårigheten måste klaras för att behandlingen alls ska verka; ett lyckat slag kliver ner ett steg, plus ett steg per Effekt; att stoppa blödning är en del av samma behandling.* Uppdatera sedan Stridsexempel, `Läkning & vård.md` (fotnot ¹) och Snabbreferens ("behandling = ett steg per framgång") så alla säger samma sak.

### 1.5 Kritiska träffar: rader som saknar utlovad behandlingsinfo

`Kritiska träffar.md` lovar: "Varje rad i tabellerna nedan anger explicit vilken vårdtyp och svårighetsgrad som krävs." Men t.ex.:

- **Skjutvapen 12 (Artärträff)** anger ingen vårdtyp/svårighet alls — trots att Stridsexempel behandlar just den träffen (och där antar Kirurgi, Svår).
- **Hugg 12 (Ben avhugget)** anger ingen behandling, och till skillnad från Hugg 13 (Arm avhuggen, Permanent: −2 Smidighet) ger den avhuggna benet inget attributavdrag.

**Förslag:** Gå igenom alla nio tabeller rad för rad och komplettera vårdtyp/svårighet där det saknas, samt se över att Permanent-avdragen är symmetriska mellan tabellerna (arm av vs. ben av).

### 1.6 Komplikationsregeln felbeskriven i Grundregler

`Grundregler.md` §Fokus, punktlistan: "Lägga till extra tärningar efter slag (…; **misslyckande ger komplikation**)". Enligt §Komplikationer (och Snabbreferens och Terminologi-intentionen) utlöses komplikationen av en **etta på en tillagd tärning**, inte av att slaget misslyckas. **Förslag:** ändra parentesen till "etta på tillagd tärning ger komplikation".

### 1.7 Rörligt mål: alla anfall eller bara avståndsanfall?

- `Strid och skada.md` §Rörligt mål: "Alla **avståndsattacker** mot dig är ett steg svårare."
- `Snabbreferens.md`: "är **alla anfall** mot dig ett steg svårare."
- `Grundregler.md`: "är du svårare att träffa" (ospecificerat).

**Förslag:** avståndsattacker är rimligen avsikten (en stormande motståndare ska inte straffas). Rätta Snabbreferens.

### 1.8 Stress i stället för Fokus — villkoret skiljer sig

- `Grundregler.md`: "**om du inte har tillräckligt mycket Fokus kvar**, istället ta en eller flera Stress".
- `Terminologi.md`: "Alla lägen där fokus kan användas kan istället Stress användas" (ovillkorat).
- `Trauma, chock och stress.md`: "Du kan också ta Stress istället för att spendera Fokus" (ovillkorat).

Får man alltså spara sitt Fokus och ta Stress frivilligt? **Förslag:** bestäm (Grundreglers villkorade version verkar vara designintentionen enligt spelledarkapitlet) och formulera identiskt överallt. Förtydliga också om taket "lika många Stress som din Stabilitet" gäller *per tillfälle* (Grundregler säger "per gång") eller något annat.

### 1.9 Hjälpa till: framgångar eller Effekt?

- `Aktiviteter.md` §Hjälpa till: "Eventuella **framgångar** blir bonustärningar."
- `Förmågor.md` §Taktik och stöd (ingressen): "hämtar sin styrka ur slagets **Effekt**".
- `Förmågor.md` §Övertygande cover: "ger din **Effekt** +2 bonustärningar istället för +1".

Om biaktörens slag är Normalt är skillnaden en hel tärning (första framgången går åt till att lyckas eller inte). **Förslag:** bestäm och använd samma ord. Enklast: "varje framgång ger +1 tärning" (då behöver hjälpslaget ingen svårighet alls), eller "lyckat hjälpslag ger +1 tärning per Effekt +1" — men bara en av dem.

### 1.10 Genererar Lätta slag Fokus och kritiska träffar?

`Expertiser.md` §Normal blir Lätt: "**Lätta** aktiviteter genererar aldrig Fokus." Samtidigt säger `Strid och skada.md` §Avståndsattacker att en Lätt attack "slås bara för att se hur hög Effekten blir" — ger tolvor där Fokus och kritiska träffar? Regeln om Fokus-fria Lätta slag står dessutom bara i Expertiser, inte i Grundregler där den hör hemma. **Förslag:** flytta regeln till `Grundregler.md` §Svårighetsgrader och besvara frågan uttryckligen (rimligen: ett frivilligt Lätt-slag ger Effekt och kritiska träffar men inte Fokus — eller ta bort undantaget helt för enkelhets skull).

### 1.11 Krafternas balansguide-tabell är bakvänd

`Krafter.md` §Snabbguide har kolumnrubrikerna "Starkare = Billigare" och "Svagare = Kraftfullare", vilket inte betyder något — och raderna ("Fokuskostnad: Lägre | Högre") går inte att läsa åt något håll. **Förslag:** skriv om till t.ex. kolumnerna *Element* / *Gör kraften starkare* / *Kompensera med* — eller ersätt tabellen med tre punktsatser.

### 1.12 Fryspelare bryter mot spelets egen designregel

`Att spelleda I Rikets Tjänst.md`: "**Bonusar ibland, men aldrig avdrag**" — inga negativa tärningsmodifikationer finns i spelet. Men exempelkraften Fryspelare (`Krafter.md`) ger "−1 på fysiska slag". Även Pulsstörare låter mål "slå **Vilja**" (en ensam egenskap — allt annat i systemet slås med Egenskap + Egenskap). **Förslag:** ändra Fryspelare till "fysiska handlingar är ett steg svårare" och Pulsstörare till t.ex. *Fysik + Vilja*.

### 1.13 Räckviddsband: "Beröring" kontra "Bredvid"

Kraftkonstruktionens räckviddstabell (`Krafter.md` steg 3) börjar på **Beröring**, medan stridskapitlet och Snabbreferens använder **Bredvid** som närmaste band. Tabellen säger samtidigt "Banden är desamma som vapnens räckviddsband". **Förslag:** använd Bredvid även i Krafter (eller definiera Beröring som en *begränsning*, vilket Stötchock redan gör).

### 1.14 Expertiser och förmågor hos SLP som inte finns

`Spelledarpersoner.md` använder **Expertis: Byråkrat** (Byråkraten) och **Expertis: Vetenskapsman** (Frigg-kontakten) — ingen av dem finns i [[Expertiser]]. Chaufförs-SLP:n har förmågan **Trimma** utan att uppfylla kravet (Analys 2 — den har Analys 2, ok, men kontrollera gärna alla SLP-byggen systematiskt). **Förslag:** lägg till Byråkrat och Vetenskapsman/Forskare som expertiser (båda är rimliga i genren), eller byt ut dem.

### 1.15 Vad ger en ny expertis vid köp — och vid start?

- `Skapa och utveckla en rollperson.md` steg 1: "Expertisen kan också **ge** vissa förmågor eller resurser."
- Samma fil, EP-listan: "7 EP för att lägga till en ny expertis **och dess förmågor**."
- `Förmågor.md`/`Expertiser.md`: expertisen **låser upp** förmågor, som köps separat (2 EP).

Får man alltså expertisförmågorna på köpet eller inte? **Förslag:** klargör. Rimligast: expertisen ger bara tillgång; ändra EP-raden till "7 EP för en ny expertis (dess förmågor köps som vanligt)".

### 1.16 Sömnmedelsexemplet räknar fel

`Särskilda situationer.md` §Sömnmedel: "Kloroform i dubbel dos ger Somnar 5+ och Döende 10+. **På 9–10 somnar offret, på 11–12 är offret Akut döende.**" Med de angivna trösklarna ska det vara: 5–9 somnar, 10–12 Akut döende. **Förslag:** rätta exemplet.

### 1.17 Strålning rad 3: "Du förlorar 1 Stress"

`Kritiska träffar.md` §Strålning, rad 3 (Kräkningar): "Du **förlorar** 1 Stress" — att bli av med Stress är positivt; alla andra rader säger "Ta X Stress". **Förslag:** ändra till "Ta 1 Stress".

### 1.18 Två versioner av hisspitchen

Introduktion: "Som **Legion of Super-Heroes** om John Le Carré hade skrivit manus." Spelledarkapitlet: "**Golden Age Comics** om John Le Carré hade skrivit manus." Välj en. (Notera också stavningen: **John le Carré**, litet "le".)

---

## 2. Luckor — saknat innehåll

### 2.1 Tillstånd saknar samlad definition

Tillstånd definieras utspritt eller inte alls:

- **Påverkad** — används i `Grundregler.md` ("Vissa tillstånd, som Sårad eller Påverkad…") men definieras bara i förbifarten inne i Sömnmedel och på en kritrad.
- **Liggande** — effekten (alla handlingar i strid ett steg svårare tills du reser dig) står bara inne i förmågan Fällning, trots att både aktiv väjning ("hamnar du på marken") och flera kritrader ("Slagen till marken") gör folk liggande. Gäller något särskilt för avståndsattacker mot liggande mål?
- **Omtumlad** (Uppercut), **Bedövad**, **Bländad** (ENS-arketypen), **Brinnande** (finns, i Särskilda situationer) — spridda.

**Förslag:** en kort sektion "Tillstånd" i [[Strid och skada]] (eller egen sida) med Sårad, Påverkad, Liggande, Fastlåst, Brinnande, Medvetslös, Döende/Akut döende — plus rad i Terminologi. Detta är den enskilt mest värdefulla pedagogiska kompletteringen.

### 2.2 Fältmässig hänvisar till regler som inte finns

`Förmågor.md` §Fältmässig: "du behöver inte slå de slag för *Fysik + Vilja* (eller ta den Stress) som SL annars kräver" för köld, hetta, hunger, utmattning och sömnbrist. Dessa umbärandeslag är aldrig definierade någonstans. **Förslag:** lägg ett kort avsnitt om umbäranden (köld/hetta/sömnbrist/svält — förslagsvis i [[Särskilda situationer]]), även om det bara är tre meningar och en tabell. Där hör även **drunkning/kvävning** hemma (nämns i Övriga-tabellens ingress men saknar regler).

### 2.3 Rustnings- och utrustningstabell saknas

`Vapen.md` §Skydd säger bara "Normalt kroppsskydd ger 1 poäng Skydd, medan kraftigare rustningar kan ge mer". Stridsexemplet använder "insydda plåtar (Skydd 2)" och "knogjärn (Skada 3?)" och SLP-kapitlet "kroppsskydd (Skydd 1)" och "pistol med ljuddämpare" — inget av detta finns i någon tabell. **Förslag inför publikation:** en kort utrustningssida med Skydd-värden (tjock rock 1, kroppsskydd 1, insydda plåtar/väst 2, …), knogjärn, ljuddämpare (effekt?), första-hjälpen-kit (+1) och läkarväska (+2) (nämns bara i Läkning & vård), kikarsikte, dyrkar, radio. [[Tjänster och gods]] täcker priser men inte spelvärden.

### 2.4 Ammunition: vad händer vid 0 — och vad är en salva?

`Vapen.md` §Ammunition: värdet sjunker per strid och av "kort salva" / "lång salva" — begreppen salva definieras aldrig (Automateld beskriver bara Effekt-spridning). Vad innebär ammunition 0 — tomt vapen tills omladdning? Återställer omladdning hela värdet? **Förslag:** tre förtydligande meningar. (Första meningen i avsnittet är dessutom trasig: "ett värde för ammunition som motsvarar ett för antalet skott…".)

### 2.5 Momentum och Fokus — återställs Fokus även nedåt?

"Återställs till Momentum" — om en karaktär har 5 Fokus och ny scen har Momentum 1, tappar hen 4? Spelledarkapitlets designresonemang antyder ja (motverka hamstring), men det sägs aldrig rakt ut. Finns något tak för hur mycket Fokus man kan samla under en scen? **Förslag:** en mening i `Grundregler.md` §Fokus till Momentum: "Fokus sätts till Momentum vid ny scen — även om du hade fler."

### 2.6 Överraskning och bakhåll

Det finns Chockslag för bakhåll och förmågan Överraskningsattack, samt Lätt-svårighet för omedvetna mål — men ingen regel för hur en strid *börjar* vid överraskning (agerar den överraskade i runda 1? slås initiativ som vanligt?). **Förslag:** kort stycke i [[Strid och skada]] §Initiativ.

### 2.7 Övrigt smått

- **Initiativ vid lika värden** — avgör hur (högst Strid? omslag?).
- **EP och språk** — kan språkpoäng köpas för EP? Ökar de när Analys/Samspel höjs?
- **Två superegenskaper?** — "max 5 poäng per egenskap" tillåter i teorin att köpa upp en andra egenskap till 5 via EP (5 EP är dessutom samma pris oavsett från vilken nivå). Avsiktligt?
- **Krafter: motståndsslag** — Silkes *Förslag* motstås med Samspel + Vilja (att motstå tankekontroll med sin egen charm?); överväg Vilja-baserat motstånd som norm i kraftkapitlets konstruktionsguide.
- **Kritrader utan behandling i Terminologi** — Skadesteg-tabellen där bör pekas om till kapitlet i stället för att dubblera värden (se 1.3).
- **Läkning & vård, "Stabilisera sårad"-raden**: meningen "Ytterligare skada innan läkt så går det upp igen" är ofullständig — skriv ut ("Tar patienten ny skada innan såren läkt blir hen Sårad igen").
- **Blödningstabellen i Läkning & vård** säger "från **svår** till lätt till inget" — tillståndet heter **Kraftig** blödning.

---

## 3. Språk

### 3.1 Direkta fel

| Plats | Nu | Bör vara |
| --- | --- | --- |
| `Expertiser.md` §Förhörsledare | "bygga grundläggande **rapport**", "med **rapportbyggande**" | Falsk vän från engelskans *rapport* (=samförstånd). Skriv "bygga förtroende/samförstånd". |
| `Kritiska träffar.md` Stick 13 | "**Genomstucket** hjärtsäck" | "Genomstucken hjärtsäck" (en hjärtsäck). |
| `Kritiska träffar.md` Gift 15+ | "**Dödlig** gift" | "Dödligt gift". |
| `Förmågor.md` §Genomlysning | "**ett motsägelsefullt detalj**" | "en motsägelsefull detalj". |
| `Förmågor.md` §Fint | "Spendera **en fokus** för att tvinga målet ta din följande attack" | "Spendera 1 Fokus för att tvinga målet **att** ta …". |
| `Krafter.md` §Förstärkta krafter | "måste … vara **kopplat** till ditt trauma" | "kopplad" (kraften). |
| `Vapen.md` §Ammunition | "ett värde för ammunition som motsvarar ett för antalet skott som skjuts" | Trasig mening — skriv om (se 2.4). |
| `Introduktion.md` §Känsliga ämnen | Satsradning ("…kan vara känsliga, det förekommer…") och stycket slutar i en hängande mening: "Exempel på system som kan underlätta är TTRPG Safety Toolkit," | Dela upp i meningar; avsluta meningen. Google Drive-länken bör dessutom ersättas med en stabil källa inför publikation. |
| `Skapa och utveckla en rollperson.md` §Koncept | Flera frågor slutar med punkt ("Hade du precis startat en familj eller var du nyskild med utflugna barn.", "…armen i mitella.") | Frågetecken. |
| `Kritiska träffar.md` Skjutvapen 1 | "**Splitskada**" | "Splitterskada" (eller "rikoschettskada"). |

### 3.2 Stilbrott (stilguiden säger "inga anglicismer, inget informellt språk")

- "**Ok** – Du klarar av det" (Sammanbrottstabellen, två filer) → t.ex. "**Håller ihop** – Du klarar av det".
- "**kolla** trösklar" (`Strid och skada.md` §Sammanfattning) → "kontrollera trösklarna".
- "en **integral** del av strid" (`Strid och skada.md`) → "en central del" / "en integrerad del".
- "**klimaktiskt** slut" (`Att spelleda….md`) → "i samband med ett klimax".
- "Klassisk **pickning**" (`Aktiviteter.md`, Dyrka lås) → "dyrkning".
- "'**openers**'" (`Aktiviteter.md`, Få folk att prata) → svenskt ord ("ingångar", "samtalsöppnare").
- "**MacGyver-lösning**" (`Aktiviteter.md`) — informellt *och* en referens till en TV-serie från 1985; byt till "improviserad lösning".
- "fötterna i svenska myllan **sen** generationer" (`Skapa….md`) → "sedan".

### 3.3 Anakronismer och faktafel (spelet utspelar sig 1961)

- **"Kulspruta 5.56 mm"** (`Vapen.md`) — kalibern 5,56 mm fanns inte i tjänst 1961. Byt till t.ex. "Kulspruta 6,5 mm" (ksp m/14–29) eller stryk raden och behåll 7,62. Notera även decimaltecknet: tabellen blandar "5.56" och "7,62" — svenska använder komma.
- **"miljonprojekts-husen i Bredäng"** (`Att spelleda….md`) — miljonprogrammet beslutades 1965 och Bredäng byggdes 1962–65; 1961 finns husen inte. Byt till t.ex. Vällingby (invigt 1954) — "hypermoderna ABC-staden Vällingby" ger samma effekt och är korrekt.
- **"St Petersburgs polis"** (`Aktiviteter.md`, Kurirjakt i Leningrad) — staden hette Leningrad; polisen kallas rimligen "Leningrads milis".

### 3.4 Ton och formuleringar i övrigt

- Snabbreferensens "Sikta = **−1 svårighet**" bryter mot konventionen att svårighet uttrycks i steg ("ett steg lättare").
- `Förmågor.md` §Trimma: "ökar en effekt med 50 % eller motsvarande (SL avgör)" — procentsatser är främmande för systemet i övrigt; formulera i steg eller bonustärningar.
- Ordet **"runda"** används både för stridsrundor (≈5 sekunder) och för varv i långa aktiviteter (`Aktiviteter.md`, där en "runda" kan vara flera minuters förhör). Överväg "varv" eller "omgång" för aktiviteter, så att "runda" alltid betyder samma sak.
- `Aktiviteter.md`: "Spana från gömsle — **Samspel** + Sinnen" ser ut som ett skrivfel (Samspel för ensam observation?); rimligen *Vilja + Sinnen* eller *Sinnen + Smidighet*.

---

## 4. Pedagogiskt upplägg

### 4.1 Det som fungerar bra — bevara

- **Snabbreferensen** är precis rätt ambitionsnivå och stämmer (nästan) alltid med kapitlen.
- **Stridsexemplet** med inskjutna regelkommentarer i kursiv är bokens bästa pedagogiska grepp. Det förtjänar syskon (se 4.3).
- **Spelledarkapitlets designfilosofi-avsnitt** (varför Fokus/Momentum/Stress finns) är ovanligt och värdefullt.
- Sannolikhetstabellen i spelledarkapitlet, med tumregler för när Svår/Mycket Svår är rätt, är utmärkt.
- Expertisernas trestegslista (Lätt/Normal/Svår per expertis) gör abstrakta expertiser konkreta.

### 4.2 Strukturella förbättringar

1. **Samla Fokus-/Stress-ekonomin.** Reglerna för Fokus står i dag i fem filer (Grundregler, Strid och skada, Förmågor-ingressen, Krafter steg 2/5, spelledarkapitlet). Gör `Grundregler.md` §Fokus till den kanoniska texten (inklusive "Lätta slag ger inget Fokus", komplikationer, Stress-ventilen, Momentum-återställning även nedåt) och låt övriga ställen hänvisa.
2. **Flytta [[Aktiviteter]] från `Spelleda/` till kärnreglerna.** Sidan är spelarvänd (Grundregler §Vanliga slag pekar redan dit) och hjälpreglerna (biaktör, motstånd, kapplöpning) används av spelarna. `Spelleda/` bör bara innehålla SL-material.
3. **Bryt ut "Förflyttning" ur "Sekundära egenskaper".** Förflyttning är en handling, inte ett värde — den står i dag som sekundär egenskap i Grundregler, Terminologi och rollpersonsskapandet, vilket får nya läsare att leta efter en siffra. Lista den under handlingar och låt sekundära egenskaper vara Tålighet, Stabilitet och KP-trösklarna.
4. **En "Tillstånd"-sektion** (se 2.1) och **en utrustningssida** (se 2.3).
5. **Kapitelordning för en tryckt bok** (Manuskript.md finns redan som manifest):
   1. Introduktion (värld, ton, säkerhetsverktyg)
   2. Grundregler (mekanik, svårighet, Effekt, Fokus/Momentum/Stress-ekonomin)
   3. Skapa och utveckla en rollperson
   4. Expertiser → Förmågor → Krafter
   5. Aktiviteter (uppgraderad till spelarkapitel)
   6. Strid och skada → Vapen (+utrustning) → Kritiska träffar → Läkning & vård → Särskilda situationer
   7. Trauma, chock och stress
   8. Stridsexempel
   9. Att spelleda → Spelledarpersoner
   10. Snabbreferens + Terminologi som appendix
   Notera att [[Trauma, chock och stress]] i dag ligger under "Strid och händelser" trots att traumavalet är steg 2 i karaktärsskapandet — i en bok bör åtminstone traumakategorierna presenteras i eller intill rollpersonskapitlet.
6. **Minska tabellduplikation.** Sammanbrottstabellen (två ställen), vårdtypstabellen (två ställen), skadestegen (tre ställen) och döende-stegen (fyra ställen) är redan i otakt på sina håll (se 1.3). Behåll dubbletterna bara i Snabbreferens (som uttryckligen är en spegel) och låt allt annat länka.

### 4.3 Kompletterande material som lyfter boken

- **Ett aktivitetsexempel i Stridsexempel-stil** — en skuggning eller ett förhör med biaktörer, tidspress och ett Sammanbrott, med samma kursiva regelkommentarer. Strid har sitt praktexempel; spionhantverket (spelets kärna!) har bara korta skisser.
- **Ett genomarbetat exempel på karaktärsskapande** — följ en spelare från koncept via trauma till färdiga krafter. Kraftkonstruktionen är spelets svåraste moment för nya spelare och har i dag bara färdiga slutresultat som exempel.
- **Ett kraftkonstruktions-exempel med kostnadsresonemang** — visa *varför* Iskristaller kostar 1 Fokus och Fryspelare 2, steg för steg genom steg 1–5. Snabbguiden (när den rättats, se 1.11) räcker inte ensam.
- **Sammanbrottstabellens första slag kan aldrig ge 13+** (1T12 utan modifikation) — värt en notis, så att spelare förstår att förvärrat trauma bara hotar den som passerat flera gränser. Detsamma gäller att kritiska tabellernas rad 13–15+ bara nås med tolvor/Penetrerande — en mening om detta avdramatiserar tabellernas längd.

---

## 5. Prioriterad åtgärdslista

**Måste (regelfel som ger olika utfall vid olika bord):**

1. Chockfaktor för automateld — ett kanoniskt värde (1.1)
2. Stabilisering/behandling — skriv om med exempel; synka Stridsexempel, Läkning & vård, Snabbreferens (1.4)
3. Synka Terminologi (Sammanbrottseffekter, Döende-raden, Komplikation) (1.3)
4. Definiera *stridstränad* (1.2)
5. Komplettera kritrader utan behandling (1.5) och rätta "förlorar 1 Stress" (1.17), sömnmedelsexemplet (1.16), komplikationsregeln i Grundregler (1.6)

**Bör (luckor som spelare kommer att fråga om):**

1. Tillståndssektion (2.1)
2. Umbärande- och drunkningsregler (2.2)
3. Rustnings-/utrustningstabell (2.3) och ammunition/salvor (2.4)
4. Momentum-återställning nedåt (2.5)
5. Rörligt mål-formuleringen (1.7), hjälpregeln framgång/Effekt (1.9), Lätta slag och Fokus (1.10)

**Före tryck (språk och struktur):**

1. Språkfelen i 3.1–3.2, anakronismerna i 3.3
2. Rätta balansguiden i Krafter (1.11), Fryspelare/Pulsstörare (1.12), Beröring→Bredvid (1.13)
3. Flytta Aktiviteter, samla Fokus-reglerna, kapitelordning (4.2)
4. Nya exempel: aktivitet, karaktärsskapande, kraftkonstruktion (4.3)
