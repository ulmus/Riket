# I Rikets Tjänst — manuskript

Den här filen styr ensam vilka kapitel som ingår i varje bok och i vilken
ordning de läses. `build-pdf.sh` läser filen och bygger en PDF per bok. Vill du
ändra ordning, lägga till eller ta bort ett kapitel — redigera den här filen,
inte byggskripten.

Filen är vanlig Markdown och kan redigeras i Obsidian. Formatet är:

- Varje `##`-rubrik startar en ny bok. Rubriktexten blir bokens undertitel på
  titelsidan och i filnamnet.
- HTML-kommentaren direkt under rubriken bär bokens metadata på formen
  `<!-- bok: ID | css: STILMALL [| notoc] -->`. `ID` är en kort identifierare
  (används för `build-pdf.sh ID`), `css:` anger stilmall i repo-roten och det
  valfria `notoc` hoppar över innehållsförteckningen.
- Punktlistan under rubriken är bokens kapitel i läsordning, som
  Obsidian-wikilänkar. Ett bart filnamn räcker när det är unikt; ange så mycket
  av sökvägen som behövs (t.ex. en mapp) om flera filer delar namn.
- Vill du tillfälligt utesluta en bok ur bygget — gör dess rubrik genomstruken
  med `~~`, som de påbörjade äventyren längst ned. Då hoppas hela boken över.

Rollpersoner byggs separat med `build-pdf-karaktärer.sh` (en PDF per rollperson,
annan layout) och ingår därför inte här.

## Regelbok

<!-- bok: regler | css: regler.css -->

- [[Introduktion]]
- [[Grundregler]]
- [[Skapa och utveckla en rollperson]]
- [[Expertiser]]
- [[Förmågor]]
- [[Krafter]]
- [[Trauma, chock och stress]]
- [[Aktiviteter]]
- [[Strid och skada]]
- [[Vapen]]
- [[Kritiska träffar]]
- [[Läkning & vård]]
- [[Särskilda situationer]]
- [[Att spelleda I Rikets Tjänst]]
- [[Spelledarpersoner]]
- [[Snabbreferens]]
- [[Terminologi]]

## Världen

<!-- bok: varlden | css: regler.css -->

- [[Bakgrund]]
- [[Projekt Nigredo (Nazi-Tyskland)]]
- [[Program Frigg (Sverige)]]
- [[Projekt Nebelkrone (Östtyskland)]]
- [[Sotsializma Pervye Zvezdy (Socialismens Första Stjärnor, Sovjetunionen)]]
- [[Project Phoenix (USA)]]
- [[Operation Grendel (Storbritannien)]]
- [[Projet Chimère (Frankrike)]]

## Extraktionen

<!-- bok: extraktionen | css: regler.css -->

- [[Extraktionen]]
- [[Operationsorder Berlin]]

## ~~Snegurka~~

<!-- bok: snegurka | css: regler.css -->

- [[Köldknäpp]]
- [[SLP]]
- [[Väder]]

## ~~Dödsängelns Testamente~~

<!-- bok: dodsangeln | css: regler.css -->

- [[Kampanjöversikt]]
- [[Moskvas Förstäder/Översikt]]
- [[En valsmelodi/Översikt]]
