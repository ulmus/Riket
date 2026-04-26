# Särskilda situationer

## Fallskada

Fall över två meter kan ge fallskada. Underlagets skadebonus läggs till grundskadan:

| Underlag                  | Skadebonus | Kritiska träffar |
| ------------------------- | ---------- | ---------------- |
| Mjukt (snö, sand, vatten) | +0         | Kross -1         |
| Normalt (gräs, jord)      | +1         | Kross            |
| Hårt (betong, sten)       | +2         | Kross +1         |
| Vasst (taggtråd, spjut)   | +3         | Stick +1         |

Grundskadan beror på fallets höjd:

| Fallhöjd | Grundskada |
| -------- | ---------- |
| 2 meter  | 1          |
| 3 meter  | 2          |
| 4 meter  | 3          |
| +2 meter | +1         |

**KP-skada = grundskada + skadebonus − framgångar på Fysik + Smidighet − Skydd** (minst 0). Skydd hjälper generellt dåligt mot fallskada, så allt skydd räknas ett steg lägre (minst 0).

**Kritiska träffar vid miljöskada:** Slå lika många T12 som KP-skadan som gick igenom. Varje **12** triggar en kritisk träff enligt underlaget (slå en gång på tabellen, +1 per ytterligare 12:a).

## Eldskada

Skadebonus från eld beror på eldens intensitet:

| Eldens intensitet          | Skadebonus | Kritiska träffar |
| -------------------------- | ---------- | ---------------- |
| Fackla, tändsticka         | +1         | Eld -1           |
| Lägereld, brinnande kläder | +2         | Eld              |
| Bål, svetslåga             | +3         | Eld +1           |
| Brinnande rum, napalm      | +4         | Eld +2           |

Grundskadan beror på eldens omfattning relativt personen:

| Eldens storlek   | Grundskada |
| ---------------- | ---------- |
| Bränd hand/arm   | 1          |
| Halva kroppen    | 2          |
| Hela kroppen     | 3          |

**KP-skada = grundskada + skadebonus − Skydd** (minst 0). Skydd skyddar bara mot eld om det är rimligt heltäckande och inte eldfängt.

### Brinnande

Om du tar minst 1 KP av eldskada och inte lyckades släcka elden, är du **Brinnande**. I början av varje runda tar du automatiskt KP-skada baserat på eldens intensitet och omfattning (se tabellerna ovan). Du kan släcka elden som en handling (kasta dig på marken, hoppa i vatten, etc.).

**Kritiska träffar vid eldskada:** Slå lika många T12 som KP-skadan som gick igenom. Varje **12** triggar en kritisk träff på tabellen **Eld** (se [[Kritiska träffar#Eld]]).

## Explosioner

En explosions skadebonus beror på styrkan i explosionen:

| Explosionstyp             | Skadebonus | Kritiska träffar |
| ------------------------- | ---------- | ---------------- |
| Handgranat, mindre bomb   | +3         | Explosion        |
| Dynamitladdning, granat   | +4         | Explosion        |
| Block C4, stor bomb       | +5         | Explosion +1     |
| Bilbomb, tungt sprängämne | +6         | Explosion +1     |

Skadebonus minskar med 1 för varje dubbling av avståndet från explosionspunkten.

Grundskadan beror på omständigheterna:

| Miljö          | Grundskada |
| -------------- | ---------- |
| Person i skydd | 2          |
| Öppen mark     | 3          |
| Öppna väggar   | 4          |
| Slutna rum     | 5          |

**KP-skada = grundskada + skadebonus − framgångar på Fysik + Smidighet (undan-slag) − (Skydd − 1)** (minst 0). Explosionsskada ignorerar 1 poäng Skydd.

**Kritiska träffar vid explosion:** Slå lika många T12 som KP-skadan som gick igenom. Varje **12** triggar en kritisk träff på tabellen **Explosion**.

### Splitter

Många explosioner ger också splitterskada. Splitter har:

- Samma skadebonus som explosionen (naturligt splitter)
- +1 skadebonus utöver explosionen (splittergranater)

Splitterskadans grundskada minskar med 1 per 5 meter avstånd. Skydd fungerar normalt mot splitter.

## Gift

Giftets styrka avgör skadebonus. Grundskadan börjar på **1** och ökar med **+1 per dubbling av dosen**.

Kemdräkter och gasmask kan skydda helt (immun) eller delvis (halvera grundskadan, minst 0).

| Gift                | Typ     | Skadebonus | Anslag     | Noter               |
| ------------------- | ------- | ---------- | ---------- | ------------------- |
| Cyanid              | Dödligt | +3         | 1 minut    | Inandning/förtäring |
| Nervgas (sarin, VX) | Dödligt | +5         | Omedelbart | Inandning/kontakt   |
| Arsenik             | Dödligt | +3         | 1 dag      | Förtäring           |

**KP-skada = grundskada + skadebonus − framgångar på Fysik + Vilja (motståndsslag)** (minst 0).

**Kritiska träffar vid gift:** Slå lika många T12 som KP-skadan som gick igenom. Varje **12** triggar en kritisk träff på tabellen **Gift** (se [[Kritiska träffar#Gift]]).

## Sömnmedel

Sömnmedel syftar till att söva offret, men har alltid en dödsrisk vid höga doser.

### Dos och effekt

Slå 1T12 när sömnmedlet får effekt:

| Sömnmedel   | Somnar | Döende | Anslag     |
| ----------- | ------ | ------ | ---------- |
| Kloroform   | 6+     | 12     | 1 minut    |
| Barbiturater| 5+     | 12     | 10 minuter |
| Tiopental   | 4+     | 12     | 30 sekunder|
| Morfin      | 8+     | 12     | 10 minuter |

**Dos:** Varje extra dos sänker båda trösklarna med 1. Vid dubbel dos somnar man alltså lättare, men risken att dö ökar också.

- Om tärningen når **Döende-tröskeln** får offret andningsstillestånd och är **Döende**.
- Om tärningen når **Somnar-tröskeln** (men inte Döende) somnar offret.
- Annars blir offret **Påverkad** (alla handlingar ett steg svårare) men tar ingen skada.

*Exempel: Kloroform i dubbel dos ger Somnar 9+ och Döende 11+. På 9–10 somnar offret, på 11–12 är det Döende.*

### Medicinsk kunskap

En person med expertis **Läkare** eller **Apotekare** kan beräkna rätt dos för offrets kroppsvikt och tillstånd. Ett lyckat slag för **Analys + Sinnen** höjer Döende-tröskeln med 1 per framgång (max +2), utan att påverka Somnar-tröskeln.

### Varaktighet

Ett sövt offer vaknar efter 1T12 × 10 minuter och är **Påverkad** (alla handlingar ett steg svårare) i en timme.

## Strålning

En person som utsätts för strålning tar skada där skadebonus beror på strålningens intensitet och grundskadan beror på hur länge de blev exponerade. I allmänhet räknas skadan efter att exponeringen är slut.

### Intensitet (skadebonus)

| Intensitet | Skadebonus | Exempel                                 |
| ---------- | ---------- | --------------------------------------- |
| Svag       | +0         | Bakgrundsnivå, avlägsna källor          |
| Måttlig    | +2         | Förorenat område, trasig röntgenapparat |
| Kraftig    | +4         | Reaktorläcka, bränslestav i närheten    |
| Extrem     | +6         | Inuti härden, atombombens epicentrum    |

### Exponering (grundskada)

| Exponeringstid               | Grundskada |
| ---------------------------- | ---------- |
| Kortvarig (sekunder–minuter) | 2          |
| Längre (timmar)              | 3          |
| Långvarig (dagar–veckor)     | 5          |

**KP-skada = grundskada + skadebonus − framgångar på Fysik + Vilja** (minst 0).

### Strålsjuka

Strålningsskada visar sig ofta fördröjt. SL kan välja att låta effekterna slå igenom timmar eller dagar efter exponeringen.

**Kritiska träffar vid strålning:** Slå lika många T12 som KP-skadan som gick igenom. Varje **12** triggar en kritisk träff på tabellen **Strålning** (se [[Kritiska träffar#Strålning]]).
