# Färdiga rollpersoner för rollformuläret

Varje `.json`-fil här är en rollperson i samma format som `sheet.html` exporterar
(knappen **Exportera**). Lägg till `?char=<slug>` i adressen till formuläret för
att öppna en av dem:

```
/static/charsheet/sheet.html?char=prisma
```

`<slug>` är filnamnet utan `.json` (gemener, inga mellanslag). Man kan också
peka på en valfri JSON-fil på samma server med `?src=`:

```
/static/charsheet/sheet.html?src=/static/charsheet/characters/prisma.json
```

Att öppna en rollperson **ersätter** blanketten som är sparad i webbläsaren
(samma sak som knappen **Importera**); finns det redan ifyllda data frågar
formuläret först.

## Lägga till en ny rollperson

1. Fyll i formuläret och klicka **Exportera** (eller redigera en befintlig fil).
2. Spara filen som `<slug>.json` i den här mappen.
3. Lägg till `"foto": "characters/<slug>.jpg"` i `fields` och lägg en bild i mappen.
   Fotot kan också sättas genom att klicka på fotorutan i formuläret och klistra
   in en länk; URL:en sparas då i `foto`-fältet och följer med vid export.
4. Lägg till raden i `index.json`.

Fälten följer formulärets modell: `attr` (egenskaper 0–5), `trauma`
(`forlust`, `vanmakt`, `skuld`, `svek`, `skam` eller tomt) och `fields`
(alla textfält, t.ex. `kodnamn`, `expertis`, `lang0…`, `sf1_namn`/`sf1_eff`,
`formaga0…`, `res0_0`/`res0_2`, `foto`). Tålighet och Förflyttning räknas ut
automatiskt från egenskaperna.
