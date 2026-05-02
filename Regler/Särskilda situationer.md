# Särskilda situationer

I flera av dessa situationer anges att man ska slå **skadetärningar**. Dessa skadetärningar är vanliga T12 där 10-12 innebär att du tar en extra KP skada och 12 innebär att du tar en kritisk träff. Extra 12:or ger bonus på kritiska tabellen som vanligt

## Fallskada

Fall över två meter kan ge fallskada. Grundskadan beror på fallets höjd:

| Fallhöjd | Grundskada |
| -------- | ---------- |
| 2 meter  | 1          |
| 3 meter  | 2          |
| 4 meter  | 3          |
| +1 meter | +1         |

Utöver det så slås ett antal skadetärningar. Kritiska träffar blir på [[Kritiska träffar#Kross]] eller [[Kritiska träffar#Stick]] beroende på underlag.

| Underlag                  | Skadetärningar | Kritiska träffar |
| ------------------------- | -------------- | ---------------- |
| Mjukt (snö, sand, vatten) | 2              | Kross            |
| Normalt (gräs, jord)      | 4              | Kross            |
| Hårt (betong, sten)       | 6              | Kross            |
| Vasst (taggtråd, spjut)   | 8              | Stick            |

Karaktären kan försöka minska detta genom att rulla med fallet och slår då **Fysik + Smidighet** och får dra av lika många KP som framgångar.

**KP-skada = grundskada + skadetärningar − framgångar på Fysik + Smidighet − Skydd** (minst 0).

## Eldskada

Skada från eld beror på eldens storlek och tas varje omgång.

| Eldens storlek   | Grundskada |
| ---------------- | ---------- |
| Fackla           | 1          |
| Eldstad          | 2          |
| Brinnande kläder | 3          |
| Brinnande rum    | 4          |
| Eldinferno       | 5          |

Utöver det så slås ett antal skadetärningar baserat på eldens intensitet, kritiska träffar blir på [[Kritiska träffar#Eld]]

| Eldens intensitet | Skadetärningar |
| ----------------- | -------------- |
| Låga              | 2              |
| Öppen eld         | 4              |
| Svetslåga         | 6              |
| Napalm            | 8              |
### Brinnande

Om du tar minst 2 KP av eldskada och inte lyckades släcka elden, är du **Brinnande**. I början av varje runda tar du automatiskt KP-skada baserat på eldens intensitet och omfattning (se tabellerna ovan). Du kan släcka elden som en handling (kasta dig på marken, hoppa i vatten, etc.).

## Explosioner

En explosions skada beror på styrkan i explosionen:

| Explosionstyp             | Skada |
| ------------------------- | ----- |
| Handgranat, mindre bomb   | 4     |
| Dynamitladdning, granat   | 6     |
| Block C4, stor bomb       | 8     |
| Bilbomb, tungt sprängämne | 10    |

Skadan minskar med 1 efter två meter och sedan med ytterligare 1 för varje dubbling av avståndet från explosionspunkten.

Beroende på omständigheterna slås också ett antal skadetärningar. Dessa fungerar som ett Lätt attackslag, dvs det träffar automatiskt och varje framgång ger +1 skada. 12:or ger kritisk träff på Explosions-tabellen. 

| Miljö          | Skadetärningar |
| -------------- | -------------- |
| Person i skydd | 2              |
| Öppen mark     | 4              |
| Öppna väggar   | 6              |
| Slutna rum     | 8              |
| Splitter       | +4             |

## Gift

Giftets styrka avgör grundskadan för den minsta dödliga dosen. Minsta dödliga dos har grundskada 2, varje extra dos ökar skadan med +1.

Ett antal skadetärningar slås beroende på gifttyp. Kritiska träffar sker på [[Kritiska träffar#Gift]].

| Gift                | Skadetärningar | Anslag     | Noter               |
| ------------------- | -------------- | ---------- | ------------------- |
| Arsenik             | 4              | 1 dag      | Förtäring           |
| Cyanid              | 6              | 1 minut    | Inandning/förtäring |
| Nervgas (sarin, VX) | 8              | Omedelbart | Inandning/kontakt   |

Kemdräkter och gasmask kan skydda helt (immun) eller delvis (halvera grundskadan, avrunda uppåt).

## Sömnmedel

Sömnmedel syftar till att söva offret, men har alltid en dödsrisk vid höga doser.

### Dos och effekt

Slå 1T12 när sömnmedlet får effekt:

| Sömnmedel    | Somnar | Döende | Anslag      |
| ------------ | ------ | ------ | ----------- |
| Kloroform    | 6+     | 11     | 1 minut     |
| Barbiturater | 5+     | 12     | 10 minuter  |
| Tiopental    | 4+     | 12     | 30 sekunder |
| Morfin       | 8+     | 11     | 10 minuter  |

**Dos:** Varje extra dos sänker båda trösklarna med 1. Vid dubbel dos somnar man alltså lättare, men risken att dö ökar också.

- Om tärningen når **Döende-tröskeln** får offret andningsstillestånd och är **Döende**.
- Om tärningen når **Somnar-tröskeln** somnar offret.
- Annars blir offret **Påverkad** (alla handlingar ett steg svårare) men tar ingen skada.

*Exempel: Kloroform i dubbel dos ger Somnar 5+ och Döende 10+. På 9–10 somnar offret, på 11–12 är det Döende.*

### Medicinsk kunskap

Att beräkna rätt dos är ett Svårt slag för **Analys + Sinnen** (görs lättare av rätt Expertis, till exempel Läkare eller Apotekare). Om det lyckas höjs Döende-tröskeln med 1 per framgång, utan att påverka Somnar-tröskeln.

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
