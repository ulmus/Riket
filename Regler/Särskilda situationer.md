## Fallskada

Fall över två meter kan ge fallskada. Skadebonus bestäms av underlaget:

| Underlag                  | Skadebonus | Kritiska träffar |
| ------------------------- | ---------- | ---------------- |
| Mjukt (snö, sand, vatten) | +0         | Kross -1         |
| Normalt (gräs, jord)      | +1         | Kross            |
| Hårt (betong, sten)       | +2         | Kross +1         |
| Vasst (taggtråd, spjut)   | +3         | Stick +1         |

Antal skadetärningar baseras på fallets höjd plus skadebonus:

| Fallhöjd | Skadetärningar |
| -------- | -------------- |
| 2 meter  | 1 + skadebonus |
| 3 meter  | 2 + skadebonus |
| 4 meter  | 3 + skadebonus |
| +2 meter | +1             |

Ett lyckat slag för **Fysik + Smidighet** minskar antalet skadetärningar med framgångarna. Skydd hjälper generellt dåligt mot fallskada, så allt skydd räknas ett steg lägre (minst 0).

## Eldskada

Skadebonus från eld beror på eldens intensitet:

| Eldens intensitet          | Skadebonus | Kritiska träffar |
| -------------------------- | ---------- | ---------------- |
| Fackla, tändsticka         | +1         | Eld -1           |
| Lägereld, brinnande kläder | +2         | Eld              |
| Bål, svetslåga             | +3         | Eld +1           |
| Brinnande rum, napalm      | +4         | Eld +2           |

Antalet skadetärningar beror på eldens omfattning relativt personen:

| Eldens storlek   | Skadetärningar   |
| ---------------- | ---------------- |
| Bränd hand/arm   | 1 + skadebonus   |
| Halva kroppen    | 2 + skadebonus   |
| Hela kroppen     | 3 + skadebonus   |

### Brinnande

Om du tar minst 1 KP av eldskada och inte lyckades släcka elden, är du **Brinnande**. I början av varje runda tar du automatiskt skadetärningar baserat på eldens intensitet (se tabell ovan). Du kan släcka elden som en handling (kasta dig på marken, hoppa i vatten, etc.).

Skydd skyddar bara mot eld om det är rimligt heltäckande och inte eldfängd.

Kritiska träffar (12 på skadetärning) slås på tabellen **Eld** (se [[Kritiska träffar#Eld]]).

## Explosioner

En explosions skadebonus beror på styrkan i explosionen:

| Explosionstyp             | Skadebonus | Kritiska träffar |
| ------------------------- | ---------- | ---------------- |
| Handgranat, mindre bomb   | +3         | Explosion        |
| Dynamitladdning, granat   | +4         | Explosion        |
| Block C4, stor bomb       | +5         | Explosion +1     |
| Bilbomb, tungt sprängämne | +6         | Explosion +1     |

Skadebonus minskar med 1 för varje dubbling av avståndet från explosionspunkten.

Antalet skadetärningar beror på omständigheterna:

| Miljö          | Skadetärningar |
| -------------- | -------------- |
| Person i skydd | 2 + skadebonus |
| Öppen mark     | 3 + skadebonus |
| Öppna väggar   | 4 + skadebonus |
| Slutna rum     | 5 + skadebonus |

Explosionsskada ignorerar 1 poäng skydd.

### Splitter

Många explosioner ger också splitterskada. Splitter har:

- Samma skadebonus som explosionen (naturligt splitter)
- +1 skadebonus utöver explosionen (splittergranater)

Splitterskada minskar med 1 tärning per 5 meter avstånd. Skydd fungerar normalt mot splitter.

## Gift

Giftets styrka avgör skadebonus, och dosen avgör antal skadetärningar – varje dubbling av dosen lägger till en skadetärning.

**Dödliga gifter** gör skada som vanliga attacker (10+ = 1 KP, 12 = kritisk träff).

Kemdräkter och gasmask kan skydda helt (immun) eller delvis (halvera skadetärningar).

| Gift                | Typ     | Skadebonus | Anslag     | Noter               |
| ------------------- | ------- | ---------- | ---------- | ------------------- |
| Cyanid              | Dödligt | +3         | 1 minut    | Inandning/förtäring |
| Nervgas (sarin, VX) | Dödligt | +5         | Omedelbart | Inandning/kontakt   |
| Arsenik             | Dödligt | +3         | 1 dag      | Förtäring           |

Kritiska träffar (12 på skadetärning) slås på tabellen **Gift** (se [[Kritiska träffar#Gift]]).

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
- Annars blir offret **Påverkad** (+1 svårighet på alla slag) men tar ingen skada.

*Exempel: Kloroform i dubbel dos ger Somnar 9+ och Döende 11+. På 9–10 somnar offret, på 11–12 är det Döende.*

### Medicinsk kunskap

En person med expertis **Läkare** eller **Apotekare** kan beräkna rätt dos för offrets kroppsvikt och tillstånd. Ett lyckat slag för **Analys + Sinnen** höjer Döende-tröskeln med 1 per framgång (max +2), utan att påverka Somnar-tröskeln.

### Varaktighet

Ett sövt offer vaknar efter 1T12 × 10 minuter och är **Påverkad** (+1 svårighet) i en timme.

## Strålning

En person som utsätts för strålning tar skada där skadebonus beror på strålningens intensitet och antal skadetärningar beror på hur länge de blev exponerade. I allmänhet slås slaget efter att expositionen är slut.

### Intensitet (skadebonus)

| Intensitet | Skadebonus | Exempel                                 |
| ---------- | ---------- | --------------------------------------- |
| Svag       | +0         | Bakgrundsnivå, avlägsna källor          |
| Måttlig    | +2         | Förorenat område, trasig röntgenapparat |
| Kraftig    | +4         | Reaktorläcka, bränslestav i närheten    |
| Extrem     | +6         | Inuti härden, atombombens epicentrum    |

### Exponering (skadetärningar)

| Exponeringstid               | Skadetärningar |
| ---------------------------- | -------------- |
| Kortvarig (sekunder–minuter) | 2 + skadebonus |
| Längre (timmar)              | 3 + skadebonus |
| Långvarig (dagar–veckor)     | 5 + skadebonus |

### Strålsjuka

Strålningsskada visar sig ofta fördröjt. SL kan välja att låta effekterna slå igenom timmar eller dagar efter exponeringen.

Kritiska träffar (12 på skadetärning) slås på tabellen **Strålning** (se [[Kritiska träffar#Strålning]]).
