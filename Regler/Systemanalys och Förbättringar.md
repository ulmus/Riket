# Systemanalys och Förbättringar: Egenskaper/Expertis/Förmågor

## Nulägesanalys

### Styrkor i det nuvarande systemet

1. **Tydlig mekanik**: T12-systemet med framgångar på 10+ och Fokus på 12 är elegant och lätt att förstå.
2. **Flexibel Egenskapskombination**: Att kombinera två egenskaper ger stor flexibilitet och uppmuntrar kreativ problemlösning.
3. **Tematisk koppling**: Expertiser ger både mekaniska fördelar och narrativ identitet.
4. **Resurshantering**: Fokus och Stress skapar intressanta valsituationer.
5. **Komplett skada- och stridssystem**: Detaljerade regler för kritiska träffar och blödning ger taktiskt djup.

### Identifierade problem och luckor

#### 1. Expertis-Förmågor interaktion

**Problem:**
- Ingen tydlig dokumentation om hur Expertiser interagerar med Förmågor som inte är Expertisförmågor
- Oklart om Expertis-bonus (+1) kan kombineras fritt med alla Förmågor
- Begränsat antal Expertisförmågor (endast 2 per Expertis)

**Exempel på förvirring:**
- Kan en Läkare med förmågan "Slagsmål" använda sin Expertis-bonus när hen lägger förband under eld?
- Får en Officer med "Skarpskytt" sin Expertis-bonus vid ledning i strid?

#### 2. Förmågor-täckning för combat builds

**Befintliga combat builds:**
- ✅ **Fäktare**: Fäktning, Fint, Ripost (3 förmågor)
- ✅ **Obeväpnad fighter**: Slagsmål, Jujutsu, Fällning, Fastlåsning, Uppercut (5 förmågor)
- ✅ **Automatvapenskytt**: Automatsalva, Täckande eld, Undertryckande eld (3 förmågor)
- ✅ **Skarpskytt**: Skarpskytt, Mästerskott, Kallblodig träff (3 förmågor)
- ✅ **Pistolskytt**: Pistolskytt, Snabbskott, Skottväxling (3 förmågor)

**Saknade combat builds:**
- ❌ **Tank/Försvarare**: Inga förmågor för att ta skada för andra eller förbättra försvar
- ❌ **Stödjare/Medic i strid**: Begränsade combat-medicin förmågor
- ❌ **Närstridsvapen** (utöver fäktning): Inga förmågor för batong, yxa, spjut
- ❌ **Granat/Sprängexpert**: Inga stridsorienterade förmågor för sappör
- ❌ **Skjoldväktare**: Inga förmågor för att skydda eller positionera sig
- ❌ **Brottsling/Infiltratör i strid**: Inga förmågor för bakstick, fällor etc.

#### 3. Team-support och situationella förmågor

**Begränsad teamsupport:**
- Endast Officer har riktiga team-buff förmågor (Elddisciplin, Initieringsorder)
- Inga förmågor för att dela Fokus eller manipulera andras Fokus
- Begränsad interaktion med andras Stress

**Saknade situationella bonusar:**
- Inga förmågor för terrängfördel
- Begränsade positioneringsförmågor
- Inga förmågor för att utnyttja fiendens svagheter

#### 4. Bonus-typer och stacking

**Problem:**
- Ingen tydlig kategorisering av bonustyper
- Oklart vilka bonusar som stackar
- Ingen begränsning på maximala bonusar

**Nuvarande bonustyper som används:**
- +X tärningar till slag
- +X på slag (läggs till efter tärningsslag?)
- +X skadetärningar
- +X skada
- +X svårighet för motståndare
- Bonus-framgångar
- Fokus-manipulation

#### 5. Förmågor och Fokus-ekonomi

**Problem:**
- De flesta förmågor kostar 1 Fokus
- Begränsad variation i kostnad/nytta
- Ingen tydlig princip för när en förmåga ska kosta Fokus vs vara gratis med begränsning

#### 6. Progression och utveckling

**Problem:**
- Ingen dokumenterad progression för hur man får fler Förmågor
- Ingen dokumenterad väg för att få fler Expertiser
- Oklart hur karaktärer utvecklas bortom grundskapande

## Förslag till förbättringar

### 1. Förtydliga Expertis-Förmågor interaktion

#### Princip 1: Expertis och allmänna Förmågor

**Regel:**
- Expertis +1 gäller **alltid** när du använder de aktiviteter som listas under expertisen
- Expertis +1 gäller **inte** automatiskt för Förmågor, såvida det inte uttryckligen står i Förmågans text
- Vissa Förmågor kan ha text som "om du har relevant Expertis, lägg till ytterligare +1"

**Exempel:**
```
## Fältmedicinare i strid (nytt förslag)
*Krav:* Expertis: Läkare eller Fältmedicinare
Du kan ge Akutvård som en Bihandling istället för Huvudhandling under strid.
```

#### Princip 2: Expertis-bonusar stackar med Förmågor

**Regel:**
- Om en Förmåga ger +1 på ett slag och din Expertis också gäller, får du totalt +2
- Detta är avsiktligt och belönar specialisering

### 2. Nya combat builds - Förmågor

#### Tank/Försvarare

```markdown
## Sköldväktare

*Krav:* Fysik 2, Strid 2
Du är expert på att skydda andra. När en allierad inom 2 meter attackeras kan du spendera en Reaktion för att ge dem +1 tärning på deras försvar.

## Ge täckning

*Krav:* Sköldväktare
Som en Bihandling kan du placera dig så att en allierad får fördel av ditt skydd. Välj en allierad inom 2 meter. Attacker mot den allierade måste först träffa dig. Du kan försvara dig normalt. Effekten varar till din nästa tur.

## Offervilja

*Krav:* Ge täckning, Vilja 3
När en allierad inom 2 meter skulle ta skada kan du spendera 1 Fokus och en Reaktion för att ta all skadan själv istället. Du kan inte försvara dig mot denna skada.

## Järnvilja

*Krav:* Fysik 3, Vilja 3
När du tar skada som skulle göra dig Sårad eller Medvetslös kan du spendera 1 Fokus för att ignorera den tillståndseffekten till slutet av scenen. Du tar fortfarande skadan och kan fortfarande bli Döende.

## Uthärda

*Krav:* Järnvilja
Du kan spendera 1 Stress istället för 1 Fokus för att aktivera Järnvilja. Max 1 Stress per scen på detta sätt.
```

#### Närstridsvapen (brute force)

```markdown
## Tung vapensföring

*Krav:* Fysik 3, Strid 2
Du är tränad i tunga närstridsvapen (yxa, slägga, tvåhandsvapen). +1 på slag med sådana vapen.

## Genomslagskraft

*Krav:* Tung vapensföring
Dina attacker med tunga närstridsvapen ignorerar 1 poäng Skydd och får +1 på kritiska träffar.

## Svepande slag

*Krav:* Tung vapensföring
Som en Huvudhandling kan du spendera 1 Fokus för att attackera alla fiender inom 2 meter med ditt tunga närstridsvapen. Slå en attack - alla träffade tar skada.

## Batongexpert

*Krav:* Strid 2, Smidighet 2
+1 på attacker med batong och liknande klubbor. Du kan välja att göra icke-dödlig skada utan avdrag.

## Förlamande slag

*Krav:* Batongexpert
När du träffar med batong kan du spendera 1 Fokus. Målet måste slå Fysik + Vilja eller förlora sin nästa Huvudhandling (förutom att ta skada).
```

#### Sniper/Prickskytt (utbyggnad)

```markdown
## Andningskontroll

*Krav:* Skarpskytt
Om du använder din Huvudhandling för att Sikta (istället för Bihandling) får du +2 istället för +1 på nästa attack.

## Perfekt timing

*Krav:* Mästerskott
Du kan spendera 1 Fokus för att göra din attack innan initiativet slås. Detta räknas som ett bakhåll om målet inte är medvetet om dig.

## Hjärtskott

*Krav:* Kallblodig träff, Strid 4
När du använder Mästerskott kan du spendera ytterligare 1 Fokus (totalt 2) för att öka kritisk bonus med +2 istället för att öka skalan.

## Viljeskott

*Krav:* Mästerskott
När du träffar ett mål kan du spendera 1 Fokus. Målet måste slå för Rädsla (Vilja + relevant egenskap, svårighet 0) eller ta 1 Stress.
```

#### Medic/Combat Medic

```markdown
## Fältmedicinare i strid

*Krav:* Expertis: Läkare eller Fältmedicinare
Du kan ge Akutvård som en Bihandling istället för Huvudhandling under strid, men slaget får +1 svårighet.

## Stridsstabilisering

*Krav:* Fältmedicinare i strid
När du stabiliserar en Döende allierad minskar du också dennes Stress med 1 per framgång på ditt vårdslag.

## Adrenalininjektion

*Krav:* Expertis: Apotekare eller Läkare
Som en Bihandling kan du spendera 1 Fokus för att ge en allierad (eller dig själv) +2 på Fysik och Smidighet till slutet av nästa runda. Efter effekten tar målet 1 Stress.

## Smärtlindring

*Krav:* Expertis: Apotekare eller Läkare  
Som en Huvudhandling kan du behandla en Sårad allierad. Vid lyckat Smidighet + Analys-slag ignorerar allierade svårighetsmodifikationen från Sårad till slutet av scenen.

## Medicinsk expertis

*Krav:* Expertis: Läkare
När du behandlar kritiska träffar får du +1 på alla vårdslag och kan återrulla en tärning per slag.
```

#### Infiltratör/Sneak Attacker

```markdown
## Bakstick

*Krav:* Smidighet 3, Strid 2
När du attackerar ett mål som inte är medvetet om dig, eller som du är bakom, får du +2 skadetärningar och +1 på kritiska träffar.

## Tyst ner

*Krav:* Bakstick
När du gör en obeväpnad attack mot ett mål som inte är medvetet om dig kan du spendera 1 Fokus. Vid träff blir målet medvetslöst istället för att ta skada (om det är ungefär din storlek).

## Svag punkt

*Krav:* Bakstick, Sinnen 3
Som en Bihandling kan du studera en fiende. Slå Sinnen + Strid. Vid framgång identifierar du en svag punkt - nästa attack mot denna fiende (av vem som helst i laget) får +1 per framgång på attackslaget.

## Yrvänd

*Krav:* List 2, Smidighet 2
När en fiende träffar dig i närstrid kan du spendera 1 Fokus och en Reaktion för att omedelbart förflyttta dig 2 meter utan att provocera attacker.
```

#### Sprängexpert i strid

```markdown
## Stridssprängning

*Krav:* Expertis: Sappör
Du kan rigga och placera spräng under strid. Att rigga spräng tar en Huvudhandling (istället för flera minuter).

## Precision

*Krav:* Stridssprängning
När du laddar spräng kan du spendera 1 Fokus. Vid detonation kan du välja exakt vilka mål inom explosionsradien som drabbas och vilka som inte gör det.

## Granatkastare

*Krav:* Strid 2, Smidighet 2
+1 på attacker med kastade granater och sprängladdningar. Du får också +5 meter på kastdistans.

## Diversionsgranat

*Krav:* Granatkastare
När du kastar en granat kan du spendera 1 Fokus. Alla som ser/hör explosionen (även de som inte träffas) måste slå för Rädsla (Vilja + Strid, svårighet 0) eller ta 1 Stress.
```

### 3. Team-support förmågor

```markdown
## Lagarbete

*Krav:* Samspel 2
När du hjälper en allierad och får minst 1 framgång, genererar du 1 Fokus (åt dig själv, inte allierade).

## Inspirera

*Krav:* Samspel 3
Som en Bihandling kan du spendera 1 Fokus för att ge en allierad inom hörhåll +1 Fokus. Fungerar bara om allierade har mindre Fokus än sitt maximum.

## Dela bördan

*Krav:* Samspel 3, Vilja 2
Som en Bihandling kan du spendera 1 Stress för att låta en allierad minska sin Stress med 1. Ni måste kunna prata med varandra.

## Taktisk koordinering

*Krav:* Strid 3, Analys 2
Som en Huvudhandling kan du analysera stridsläget och ge order. Slå Strid + Analys. Varje framgång ger dig en "Taktikpoäng". Du kan spendera Taktikpoäng (1:1) för att ge allierade +1 tärning på deras attacker eller försvar. Taktikpoäng försvinner i slutet av din nästa tur.

## Hörnstenstrupp

*Krav:* Vilja 3
Allierade inom 5 meter från dig får +1 på alla Rädsla-slag. Du måste vara vid medvetande.

## Föregå med exempel

*Krav:* Vilja 3, Strid 2
När du lyckas med en attack kan du spendera 1 Fokus. Välj en allierad som ser dig - denna allierad får +2 tärningar på sin nästa attack.

## Nödåterställning

*Krav:* Samspel 3, Vilja 3
En gång per scen kan du som en Huvudhandling återställa alla allieraders Fokus till Momentum (som om en ny scen börjat). Detta kostar dig 2 Stress.
```

### 4. Situationella och taktiska förmågor

```markdown
## Terrängutnyttjare

*Krav:* Sinnen 2, Smidighet 2
Du kan som en Bihandling identifiera fördelaktig terräng. Slå Sinnen + Smidighet. Vid framgång får du +1 på ditt nästa slag om du positionerar dig vid denna plats (kräver förflyttning dit).

## Höjdfördel

*Krav:* Smidighet 2, Strid 2
När du attackerar från högre position än målet får du +1 på attackslaget.

## Kontrollera avstånd

*Krav:* Strid 3, Smidighet 2
När en fiende försöker förflytta sig närmare eller längre bort från dig kan du spendera 1 Fokus och en Reaktion för att göra en attack mot dem. Om du träffar avbryts deras förflyttning.

## Vunnen grund

*Krav:* Fysik 2, Vilja 2
När du tar skydd bakom något kan du spendera 1 Fokus. Till din nästa tur får du +2 Skydd (istället för det skydd positionen normalt ger).

## Röksignal

*Krav:* Analyserar 2
Du bär alltid rökgranater. När du skapar rök kan du spendera 1 Fokus för att dina allierade kan se perfekt genom röken (men fiender kan inte).

## Spärra vägen

*Krav:* Fysik 2, Strid 2
Som en Reaktion när en fiende försöker passera förbi dig kan du försöka blockera. Slå Fysik + Strid mot fiendens Smidighet + Fysik. Vid framgång avbryts fiendens förflyttning.

## Ompositionering

*Krav:* Smidighet 3
Efter att du gjort en attack kan du spendera 1 Fokus för att omedelbart förflytta dig din Förflyttning som en gratis handling.
```

### 5. Förmågor med alternativa kostnader

```markdown
## Desperat skott

*Krav:* Strid 3
När du skulle missa en avståndsattack kan du spendera 1 Stress för att återrulla alla missar i slaget. Detta fungerar bara en gång per slag.

## Levande sköld

*Krav:* Fysik 3, Strid 2, List 2
När du är i närstrid med en fiende kan du som en Bihandling spendera 1 Fokus för att greppa dem. Till din nästa tur får alla avståndsattacker mot dig +2 svårighet (risk att träffa fången).

## Berserkerraseri

*Krav:* Fysik 3, Strid 3
Du kan aktivera raseri som en fri handling när du tar skada. Du tar 1 Stress per runda raseriet är aktivt. Medan raseriet är aktivt:
- +2 på alla närstridsattacker
- +2 skadetärningar i närstrid
- Du kan inte använda Fokus
- Du måste attackera närmaste fiende

Du kan avsluta raseriet i början av din tur.

## Kall precision

*Krav:* Analys 3, Strid 3
När du är Sårad kan du spendera 1 Stress som en fri handling. Till slutet av din nästa tur ignorerar du alla svårighetsmodifikationer från skador och får +1 på alla attackslag.

## Sista kraften

*Krav:* Vilja 4
När du blir Medvetslös kan du omedelbart spendera all din kvarvarande Fokus för att stanna vid medvetande i 1 runda per Fokus spenderat. Efter detta faller du medvetslös oavsett skadeläge.
```

### 6. Förmågor för olika vapenkategorier

```markdown
## Hagelgevärsexpert

*Krav:* Strid 2, Fysik 2
+1 på attacker med hagelgevär. När du skjuter på kort håll (inom 10m) får målet -1 på försvar mot din attack.

## Pumpactionsdisciplin

*Krav:* Hagelgevärsexpert
Du kan ladda om hagelgevär som en gratis handling istället för en bihandling.

## K-pistexpert

*Krav:* Strid 2, Fysik 2
+1 på attacker med k-pistar. Du kan kontrollera rekyl bättre och ignorerar den första svårighetsökningen från Kort salva.

## Kulspruta

*Krav:* Fysik 3, Strid 3
+1 på attacker med kulspruta. Du kan bära och manövrera kulsprutor utan avdrag.

## Kulsprutäbastion

*Krav:* Kulspruta
När du skjuter med uppsatt kulspruta (tar en bihandling att sätta upp) får du +2 tärningar på attacker istället för +1.
```

## Riktlinjer för balans

### Bonustyper och stacking

**Bonustyper:**
1. **Tärningsbonus** (+X tärningar) - stackar alltid
2. **Slagbonus** (+X efter tärningsslag) - stackar med olika källor, max +3 totalt
3. **Skadebonus** (+X skadetärningar) - stackar alltid
4. **Svårighetsmodifikation** (påverkar motståndarens slag) - stackar, ingen max
5. **Kritisk bonus** (+X på kritiska träffar) - stackar alltid
6. **Skalbonus** (ökar skadetärning från T12 till T20) - ej stackande, tar högsta

**Stackningsregler:**
- Samma bonus från samma förmåga stackar inte (kan inte använda Sikta två gånger)
- Samma bonus från olika förmågor stackar
- Expertis-bonus stackar med alla förmågor
- Max +5 tärningar från bonusar (exklusive grundegenskaper)

### Fokuskostnad

**Riktlinjer:**
- **0 Fokus**: Alltid aktiv eller mycket begränsad användning
- **1 Fokus**: Standard aktiv förmåga, används ofta
- **2 Fokus**: Kraftfull förmåga med stor påverkan
- **3+ Fokus**: "Ultimate" förmåga, används sällan

**Alternativa kostnader:**
- Stress kan användas istället för Fokus vid desperation
- Vissa förmågor kan ha Stress som primär kostnad (Berserkerraseri)
- Vissa förmågor kan kosta både Fokus och Stress för maximal effekt

### Handlingsekonomi

**Bihandling vs Huvudhandling:**
- Bihandling: Snabb boost, enkelt defensivt, positionering
- Huvudhandling: Attacker, komplicerade manövrar, kraftfulla effekter
- Reaktion: Defensivt, motattacker, opportunistiskt

### Krav för förmågor

**Egenskapskrav:**
- Nivå 2: Grundläggande specialisering
- Nivå 3: Avancerad specialisering
- Nivå 4: Mästerskap (sällsynt)

**Kedjekrav:**
- Grundförmåga → Avancerad → Expert
- Max 3-4 förmågor i en kedja
- Varje steg ska kännas som verklig progression

## Implementation och testning

### Fas 1: Kärnförmågor
- Implementera tank/försvarare förmågor
- Implementera team-support förmågor
- Implementera situationella förmågor

### Fas 2: Combat builds
- Testa och balansera närstridsvapen
- Testa och balansera medic i strid
- Testa och balansera infiltratör

### Fas 3: Specialisering
- Implementera vapenkategori-förmågor
- Implementera terräng- och taktikförmågor
- Implementera alternativa kostnader

### Balanstest

**Testscenarier:**
1. 1v1 närstrid mellan två builds
2. Teamstrid 3v3 med olika roller
3. Långdistansstrid med täckning
4. Mixed combat (närstrid + avstånd)
5. Survival scenario (med Stress och Fokus-utmattning)

**Metriker att följa:**
- Genomsnittlig skada per runda
- Fokus-konsumtion per strid
- Överlevnad efter 5 rundor
- Användbarhet utanför strid
- Kul-faktor (subjektivt)

## Sammanfattning

Detta dokument ger en fullständig analys av det nuvarande systemet och föreslår:
1. **60+ nya förmågor** för att täcka luckor i combat builds
2. **Tydliga regler** för bonusstacking och interaktion
3. **Team-support mekaniker** för mer kooperativt spel
4. **Situationella förmågor** för taktiskt djup
5. **Alternativa kostnader** för mer varierad resurshantering

Nästa steg är att integrera dessa förmågor i [[Förmågor]] och uppdatera [[Expertiser]] med nya kopplingar.
