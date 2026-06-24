# Färdiga rollpersoner för rollformuläret

De visas i biblioteket på **`/static/charsheet/`** (`../index.html`), som läser
`index.json` och listar dem under **Färdiga rollpersoner**. Därifrån kan man
**Importera** en till sitt bibliotek (lokalt om man inte är inloggad, annars till
molnet) och sedan anpassa kopian — originalfilen ändras aldrig.

Varje `.json`-fil här är en rollperson i samma format som `sheet.html` sparar.
Man kan också öppna en direkt med `?char=<slug>` (då laddas den som en **osparad**
blankett som man kan spara i sitt bibliotek):

```
/static/charsheet/sheet.html?char=prisma
```

`<slug>` är filnamnet utan `.json` (gemener, inga mellanslag). Man kan också peka
på en valfri JSON-fil på samma server med `?src=`. (Quartz tar bort `?` ur länkar
i markdown, så dessa adresser fungerar bara om man skriver in dem direkt.)

## Lägga till en ny rollperson

1. Skapa rollpersonen i formuläret, eller redigera en befintlig fil.
2. Spara filen som `<slug>.json` i den här mappen.
3. Lägg till `"foto": "characters/<slug>.jpg"` i `fields` och lägg en bild i mappen.
   (I formuläret laddas foton i stället upp och sparas inbäddade i JSON:en som en
   `data:`-URI — för de färdiga rollpersonerna håller vi dem som separata filer.)
4. Lägg till raden i `index.json`.

Fälten följer formulärets modell: `attr` (egenskaper 0–5), `trauma`
(`forlust`, `vanmakt`, `skuld`, `svek`, `skam` eller tomt) och `fields`
(alla textfält, t.ex. `kodnamn`, `expertis`, `lang0…`, `sf1_namn`/`sf1_eff`,
`formaga0…`, `resurser` (en fri textruta), `foto`). Tålighet och Förflyttning
räknas ut automatiskt från egenskaperna.
