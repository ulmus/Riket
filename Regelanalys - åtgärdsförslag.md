# Regelanalys - åtgärdsförslag

Det här dokumentet sammanfattar föreslagna åtgärder efter regelanalysen av **I Rikets Tjänst**. Fokus är konsekvens, pedagogiskt upplägg, ändamålsenlighet vid spelbordet och stöd för spelledaren.

Målet är inte att förenkla bort spelets taktiska identitet. Målet är att göra reglerna lättare att köra vid bordet, minska tolkningsbördan för SL och göra de centrala procedurerna entydiga.

## Rekommenderad arbetsordning

1. Rätta regelkonflikter som kan ge olika utfall vid bordet.
2. Förtydliga procedurer som används ofta: Stress, Fokus, skada, vård, Expertis.
3. Flytta eller dubblera pedagogiskt nödvändiga referenser så att läsaren får dem innan de behövs.
4. Lägg till SL-verktyg för operationer, konsekvenser, SLP och Momentum.
5. Först därefter: bygg ut mer avancerat stöd för krafter, täckmantlar och resurser.

## Fas 1: Regelkonsekvens

### Kritiska träffar

**Problem:** [[Kritiska träffar]] säger att en 12:a på attackslaget ger kritisk träff, medan [[Strid och skada]] och [[Terminologi]] kräver att attacken träffar och gör minst 1 KP efter Skydd.

**Åtgärd:** Gör detta till den enda regeln:

- En 12:a på attackslaget ger alltid 1 Fokus.
- En kritisk träff utlöses bara om attacken träffar och gör minst 1 KP skada efter Skydd.
- Flera 12:or ger +1 per ytterligare 12:a på kritslaget.

Uppdatera särskilt inledningen i [[Kritiska träffar]], sammanfattningen i [[Strid och skada]] och formuleringen om Skydd i [[Vapen]].

### Explosioner och handgranater

**Problem:** [[Vapen]] anger handgranat med Skada 6, medan [[Särskilda situationer#Explosioner]] anger handgranat/mindre bomb med Skadevärde 4.

**Åtgärd:** Välj en av två modeller:

- Rekommenderat: Vapentabellen anger `Skadevärde 4` och hänvisar till explosionsreglerna.
- Alternativt: Behåll vapnets Skada 6 och ta bort den separata handgranatsraden i explosionstabellen.

Den första modellen är renare eftersom explosionsreglerna redan har avstånd, trånga utrymmen, splitter och skydd.

### Sikta

**Problem:** Grundregeln gör sikta till ett steg lättare, men förmågan [[Förmågor#Andningskontroll]] beskriver sikta som +2 i stället för +1.

**Åtgärd:** Skriv all sikteffekt som svårighetssteg:

- Sikta: ett steg lättare.
- Andningskontroll: sikta med gevär gör anfallet två steg lättare, till lägst Lätt.

Det bevarar principen att negativa och positiva omständigheter i första hand hanteras med svårighetssteg, inte tärningsavdrag.

### Stress i stället för Fokus

**Problem:** Vissa texter säger att Stress kan ersätta saknat Fokus, medan andra låter som att Stress bara används när Fokus är helt slut.

**Åtgärd:** Standardisera till:

> Räcker inte ditt Fokus kan du ersätta resten med Stress, högst lika många Stress som din Stabilitet per tillfälle.

Uppdatera [[Grundregler]], [[Snabbreferens]], [[Att spelleda I Rikets Tjänst]] och exempeltexten så samma formulering används.

### Vård och stabilisering

**Problem:** Akutvård, stabilisering, blödning och KP-chock använder delvis olika tidsåtgång och egenskapskombinationer.

**Åtgärd:** Dela upp vårdproceduren i två nivåer:

| Åtgärd              | Tid               | Slag                                | Verkan                                                     |
| ------------------- | ----------------- | ----------------------------------- | ---------------------------------------------------------- |
| Akut åtgärd         | 1 runda           | Kirurgi eller Medicin enligt skadan | Stoppar eller minskar akut effekt, främst Kraftig blödning |
| Stabilisering       | 1 minut           | Vårdtyp enligt skadan               | Flyttar Döende ett steg nedåt per framgång                 |
| Fortsatt behandling | 1 timme eller mer | Vårdtyp enligt skadan               | Nytt försök om förutsättningarna förbättras                |

Bestäm samtidigt om KP-chock utan kritisk träff ska stabiliseras med **Medicin** (_Analys + Sinnen_) eller akutvård (_Analys + Smidighet_). Rekommendation: använd **Medicin** för diagnos/stabilisering och **Kirurgi** för blödning, brutna ben och öppna skador.

### Sårad och behandling

**Problem:** [[Läkning & vård]] säger att `Stabilisera sårad` tar bort Sårad, men [[Strid och skada]] säger att Sårad beror på KP över Tålighet och [[Läkning & vård]] säger att Medicin inte läker KP.

**Åtgärd:** Välj en tydlig modell:

- Rekommenderat: Sårad kvarstår tills KP-skadan är nere på Tålighet eller lägre.
- Fältvård kan i stället ge ett tillfälligt undantag: ignorera Sårad i en scen, men KP-tröskeln ändras inte.

Det gör att skadegränserna fortsätter vara begripliga.

## Fas 2: Pedagogik och läsordning

### Flytta snabbreferens och terminologi

**Problem:** [[Snabbreferens]] och [[Terminologi]] ligger sist i regelboken, trots att [[Grundregler]] hänvisar till dem direkt.

**Åtgärd:** Ändra läsordningen i [[Manuskript]]:

1. [[Introduktion]]
2. [[Snabbreferens]]
3. [[Grundregler]]
4. [[Terminologi]] eller en kortare begreppsöversikt

Om Terminologi ska ligga kvar sist som uppslagsdel bör Grundregler få en egen kort begreppslista i spelordning.

### Flytta trauma tidigare

**Problem:** Rollpersonsskapandet kräver Trauma tidigt, och krafter bygger på aktiverat Trauma, men [[Trauma, chock och stress]] kommer efter kraftkapitlet.

**Åtgärd:** Flytta [[Trauma, chock och stress]] före [[Skapa och utveckla en rollperson]], eller lägg in en komplett traumaminireferens i rollpersonskapitlet.

### Expertisflöde

**Problem:** Expertis kan läsas som ett generellt krav för alla aktiviteter. Det riskerar att varje slag börjar med en diskussion om relevant Expertis.

**Åtgärd:** Skriv om kärnregeln:

> När en aktivitet faller inom din Expertis sänks svårigheten ett steg. Svårigheterna i expertislistorna är skrivna för den som har relevant Expertis. Saknar du den Expertisen är aktiviteten ett steg svårare.

Lägg till en kort flödesruta:

1. Sätt grundsvårighet efter situationen.
2. Om aktiviteten matchar relevant Expertis: ett steg lättare.
3. Om aktiviteten är en specialiserad expertisaktivitet och karaktären saknar Expertis: ett steg svårare.
4. Tillämpa tillstånd som Sårad och Påverkad.

### Sammanbrottsgränser

**Problem:** Reglerna säger att Stress måste passera en gräns, men det kräver mental räkning.

**Åtgärd:** Lägg till tabell i [[Trauma, chock och stress]] och [[Snabbreferens]]:

| Stabilitet | Slå vid Stress | Modifierare    |
| ---------: | -------------- | -------------- |
|          3 | 4, 7, 10, 13   | +0, +1, +2, +3 |
|          2 | 3, 5, 7, 9     | +0, +1, +2, +3 |
|          1 | 2, 3, 4, 5     | +0, +1, +2, +3 |

## Fas 3: Spelbordstempo

### Attackprocedur

**Problem:** En attack kräver många steg: träff, Effekt, Skada, Skydd, KP, Stress, kritisk träff, krittabell och eventuella tillstånd.

**Åtgärd:** Lägg en tydlig attackruta i [[Strid och skada]]:

1. Slå anfallet och räkna Framgångar.
2. Jämför med Svårighet. Överskott blir Effekt.
3. Räkna KP-skada: Effekt + Skada - Skydd.
4. Markera KP och Stress.
5. Om en 12:a finns och minst 1 KP går igenom: slå kritisk träff.

Lägg även till en förenklad regel för statister: om en statist blir Sårad eller får kritisk träff är den normalt utslagen, flyr eller ger upp enligt SL.

### Aktiviteter och konsekvenser

**Problem:** Aktivitetsreglerna fungerar, men SL saknar konsekvensmenyer för misslyckanden, delvis lyckade slag och Effekt.

**Åtgärd:** Lägg till en sida med konsekvenser:

| Situation | Möjlig konsekvens                                                |
| --------- | ---------------------------------------------------------------- |
| Spaning   | Målet byter rutt, en tredje part ser rollpersonerna, larmnivå +1 |
| Intrång   | Verktyg går sönder, spår lämnas, tid går förlorad                |
| Förhör    | Målet kräver gentjänst, ger halvsanning, blir rädd               |
| Jakt      | Avstånd ändras, fordon skadas, publik eller polis blandas in     |
| Sabotage  | Effekten blir fördröjd, för stor, synlig eller spårbar           |

### Förmågor med tom normal framgång

**Problem:** Vissa förmågor ger effekt bara på Effekt. Då kan en lyckad handling utan Effekt kännas som att den inte gjorde något.

**Åtgärd:** Skriv förmågor i formatet:

- **Vid framgång:** grundverkan.
- **Per Effekt:** förstärkning.

Om avsikten är att bara Effekt gör något, skriv: `Vid framgång utan Effekt: du skapar läget men får ingen mekanisk bonus.`

## Fas 4: SL-stöd

### Operationsmall

**Problem:** SL-kapitlet ger bra tonråd men få konkreta verktyg för att bygga uppdrag.

**Åtgärd:** Lägg till en operationsmall:

- **Uppdrag:** Vad T-kontoret säger att rollpersonerna ska göra.
- **Dold sanning:** Vad uppdraget egentligen handlar om.
- **Aktörer:** Namn, agenda, resurser, vad de vet.
- **Tre ledtrådar:** Minst tre vägar till nästa centrala insikt.
- **Klocka:** Vad händer vid steg 1-6 om rollpersonerna dröjer.
- **Larmnivå:** Hur världen reagerar när intrånget märks.
- **Resurser:** Vad rollpersonerna kan få före uppdraget.
- **Scener:** Platser och möten som kan användas i valfri ordning.

### Momentumtabell

**Problem:** Momentum påverkar Fokus-ekonomin mycket, men SL får få konkreta riktlinjer.

**Åtgärd:** Lägg till tabell:

| Momentum | När                                         |
| -------: | ------------------------------------------- |
|        1 | Briefing, vardag, låg risk                  |
|        2 | Spaning, förberedelser, försiktig operation |
|        3 | Aktiv operation, tydlig tidspress           |
|        4 | Kris, avslöjad operation, pågående jakt     |
|        5 | Klimax, sista chans, öppen katastrof        |

Lägg till när Momentum höjs och sänks, och påminn om att Fokus återställs till Momentum även om det sänker nuvarande Fokus.

### SLP vid bordet

**Problem:** [[Spelledarpersoner]] ger användbara siffror, men inte tillräckligt med beteendeprocedurer.

**Åtgärd:** Lägg `Vid bordet`-rutor på vanliga arketyper:

- Första reaktion.
- Om pressad.
- Om mutad.
- Om skadad.
- Larmar när.
- Ger upp när.

Det minskar behovet av att SL fullsimulerar statister.

### Täckmantel, resurser och kontakter

**Problem:** Agentvärlden bygger på täckidentiteter, rekvisition och kontakter, men reglerna lämnar detta nästan helt till SL.

**Åtgärd:** Lägg till ett lätt system:

- **Täckmantel 0-3:** från tunn lögn till etablerad civil identitet.
- **Operationsresurser:** varje uppdrag ger 2-4 resurser, till exempel fordon, falska papper, lokal kontakt, specialutrustning eller underrättelse.
- **Sprucken täckmantel:** ger larmnivå, Chockslag, förlorad resurs eller framtida komplikation.

Håll detta som stöd, inte som ekonomi.

## Fas 5: Kraftstöd

### Kraftkort

**Problem:** Kraftbygget är flexibelt och tematiskt starkt, men kräver mycket balansarbete av SL.

**Åtgärd:** Lägg till färdiga kraftkort före eller efter friformsreglerna:

| Typ        | Kortet bör ange                                                  |
| ---------- | ---------------------------------------------------------------- |
| Attack     | Kostnad, slag, räckvidd, Skadebonus, Skadetyp, förstärkningar    |
| Perception | Kostnad, slag, räckvidd, informationsnivå, risk vid misslyckande |
| Påverkan   | Kostnad, slag, motstånd, ordergräns, minne, livsfara             |
| Skydd      | Kostnad, reaktivitet, Skydd, varaktighet, begränsning            |
| Transport  | Kostnad, zoner, hinder, passagerare, risk                        |

Friformsbygget kan sedan presenteras som ett sätt att ändra kraftkort, inte som första verktyget en ny SL måste behärska.

## Små terminologiska städningar

- Byt `1 Framgång` till `1 Effekt` i kraftförstärkningar där det handlar om överskjutande framgångar.
- Ändra `1 automatisk framgång` vid Lätt slag till `lyckas automatiskt`, om inte regeln uttryckligen ska ge Effekt.
- Byt `Extra Normala Subjekt` till `Extra-Normala Subjekt`.
- Antingen definiera tillstånd som `bedövad` och `bländad`, eller ersätt dem med befintliga tillstånd som **Omtumlad** och **Påverkad**.
- Rätta länken i [[Snabbreferens]] från `[[#Trauma]]` till [[Trauma, chock och stress#Trauma]].

## Föreslagen minsta PR-scope för faktisk regeländring

Om detta ska delas upp i flera PR:er bör den första bara göra konsekvensrättelser:

1. Kritisk träff.
2. Stress i stället för Fokus.
3. Sikta.
4. Handgranat/explosion.
5. Vård/stabilisering.
6. Sårad och behandling.
7. Kraftförstärkningar från `Framgång` till `Effekt`.

Det ger störst nytta med minst kreativ ombyggnad.
