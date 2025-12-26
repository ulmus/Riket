# Initiativ

Varje strid börjar med att alla inblandade slår 1T12 och lägger till sitt värde på Strid. Detta blir deras initiativ under hela striden. Striden delas upp i rundor om ca fem sekunder och i varje runda börjar den som har högst initiativ att ta sin tur och därefter går turen vidare i fallande ordning.

# Turer och handlingar

På din tur kan du utföra en huvudhandling och en bihandling. Du kan också, istället för en huvudhandling utföra två bihandlingar (för totalt tre bihandlingar på din tur). Utöver det så kan en reaktionshandling utföras utanför din tur, men bara om något händer som utlöser reaktionen.

## Huvudhandlingar

- Avståndsattack (Strid + Smidighet)
- Närstridsattack (Strid + Fysik eller Strid + Smidighet)

## Bihandlingar

- Sikta: +1
- Ställa sig upp
- Dra ett vapen
- Röra sig Fysik + Smidighet meter

## Reaktionshandlingar

- Kasta sig undan en attack (Strid + Smidighet), du är på marken efteråt och det krävs en bihandling för att resa sig
- Parera en närstridsattack (Strid + Smidighet + Paradbonus)

# Avståndsattacker

Om du gör en avståndsattack slår du i allmänhet för Strid + Smidighet med modifikationer.

- Minst en bihandling lagd på att sikta +1
- Stabil position +1 (+2 om liggande)

Svårigheten, det vill säga antalet framgångar som krävs för att träffa, bestäms av avståndet till målet och eventuella hinder eller omständigheter.

- Över vapnets räckvidd: +1 svårighet per steg över räckvidden
- Målet i skydd eller snabb rörelse: +1
- Mörker eller dålig sikt: +1

# Närstridsattacker
När du gör en närstridsattack slår du för Strid + Fysik eller Strid + Smidighet (beroende på vapen och förmågor) med modifikationer.

# Skador

Om en attack träffar ett mål så avgörs skadan genom **träffframgångar**, vapnets **skadebonus**, och målets **skydd**.

## Kroppspoäng (KP)

Varje karaktär har **Kroppspoäng (KP)** lika med **Fysik + Vilja**. KP representerar hur mycket skada du kan ta innan du blir allvarligt påverkad.

### Skadesteg

| Skada | Tröskel | Effekt |
|-------|---------|--------|
| **Oskadd** | 0 KP | Inga effekter |
| **Sårad** | > Fysik KP | **+1 svårighet** på alla slag |
| **Medvetslös** | > Fysik + Vilja KP | Du faller ihop och kan inte agera |
| **Döende** | > 2 × (Fysik + Vilja) KP | Se *Döende* nedan, eller via kritisk träff |

*Exempel: En karaktär med Fysik 3 och Vilja 2 har 5 KP. Hon blir Sårad vid 4+ KP skada, Medvetslös vid 6+ KP, och Döende vid 11+ KP.*

## 1. Bestäm antal skadetärningar

När en attack träffar, räkna ihop **skadetärningar**:

**Antal skadetärningar = Träffframgångar + Vapnets Skadebonus**

- **Träffframgångar:** Antalet framgångar på attackslaget.
- **Skadebonus:** Vapnets skadebonus enligt vapentabellen (se [[Vapen]]).
- **Egenskaper:** Vissa vapenegenskaper (t.ex. **Automateld**) ger extra skadetärningar.

## 2. Rulla skadetärningar

Rulla antalet T12. Skadeslag ger inte Fokus.

- Varje tärning som visar **10–11** ger **1 KP skada**.
- Varje tärning som visar **12** ger **1 KP skada** och är en **kritisk träff**.

## 3. Applicera skydd

Målets **Skydd** (från rustning, täckning, etc.) minskar KP-skadan:

**Slutlig skada = KP-skada − Skydd** (minst 0)

Skydd påverkar inte kritiska träffar – de inträffar oavsett om skadan absorberas.

## 4. Kritiska träffar

Om minst en skadetärning visar **12** har du fått en **kritisk träff**. Slå 1T12 på lämplig kritisk träff-tabell baserat på vapnets **Skadetyp** (se [[Kritiska träffar]]).

Om *flera* skadetärningar visar 12: slå en gång per 12:a och använd det **högsta** resultatet.

Kritiska träffar ger effekter som blödning, brutna ben, eller döende – oavsett hur mycket KP-skada som gick igenom.

## Exempel

> **Anton** skjuter med sin pistol mot en sovjetisk gränsvakt. Pistolen har **Skadebonus +4** och skadetyp **Småkaliber**.
> 
> Antons träffslag ger **2 framgångar**. Han slår alltså **2 + 4 = 6 skadetärningar**.
> 
> Han rullar 6T12: **3, 7, 10, 10, 11, 12**. Fyra tärningar visar 10+, alltså **4 KP skada**. Vakten bär **tjock rock (Skydd 1)**, så slutlig skada är **3 KP**.
> 
> Vakten (Fysik 2, Vilja 2, 4 KP totalt) har nu tagit 3 KP skada – inte Sårad ännu (tröskeln är >2), men nära.
> 
> Dessutom visade en tärning **12** – kritisk träff! Anton slår på tabellen för **Småkaliber** och får en 8: *Genomskjuten axel*.

# Effekter av skada

## Sårad

När du har tagit mer än **Fysik** i KP-skada blir du **Sårad**:
- **+1 svårighet** på alla slag.
- Du tar **+1 Stress**.

## Medvetslös

När du har tagit mer än **Fysik + Vilja** i KP-skada blir du **Medvetslös**:
- Du faller ihop och kan inte agera.
- Du vaknar när din KP-skada återställs till under tröskeln, eller efter 1T12 minuter (spelledarens val).

## Döende

Du blir **Döende** om:
- Du tar mer än **2 × (Fysik + Vilja)** KP-skada (chock), eller
- En **kritisk träff** gör dig Döende.

### Överlevnadsslag

När du är Döende måste du slå **Överlevnadsslag** (Fysik + Vilja) med ett intervall som beror på orsaken:

| Orsak | Intervall |
|-------|-----------|
| KP-förlust (chock) | Per minut |
| Kritisk träff | Enligt tabellen (runda/minut/timme) |

Varje Överlevnadsslag:
- **Lyckat:** Du överlever tills nästa slag. Notera överskjutande framgångar.
- **Misslyckat:** Du dör.
- **Tre överskjutande framgångar totalt:** Du stabiliseras och är inte längre Döende (men fortfarande skadad).

### Stabilisering

En annan person kan stabilisera dig med **Smidighet + Analys (Medicin)**:
- Kräver en huvudhandling.
- Vid framgång slutar du vara Döende (men behöver fortfarande läkning).

## Blödning

Vissa kritiska träffar orsakar **blödning** – lätt eller kraftig:

| Typ | Frekvens | Skadetärningar |
|-----|----------|----------------|
| **Lätt blödning** | I början av varje minut | 1T12 |
| **Kraftig blödning** | I början av varje runda | 1T12 per nivå |

Blödningsskada fungerar som vanliga skadetärningar: 10+ = 1 KP, 12 = kritisk träff (slå på tabellen för **Blödning**, se [[Kritiska träffar#Blödning]]).

Blödning stoppas genom behandling (se [[Läkning & vård]]).

## Sammanfattning

1. **Träff?** Räkna framgångar.
2. **Skadetärningar** = Träffframgångar + Skadebonus (+ egenskaper).
3. **Rulla** skadetärningar: 10–11 = 1 KP, 12 = 1 KP + kritisk träff.
4. **Dra av Skydd** från KP-skadan.
5. **Applicera skada:** Uppdatera KP, kolla trösklar (Sårad/Medvetslös/Döende).
6. **Kritisk träff?** Slå på rätt tabell.

### Läkning

Se kapitlet [[Läkning & vård]].

### Kritiska träffar

Se kapitlet [[Kritiska träffar]] för tabeller baserade på skadetyp (Kross, Stick, Hugg, Eld, Småkaliber, Högkaliber, Explosion, Gift, Blödning, Övriga).

# Särskilda situationer

Principen för skador i andra situationer än ren strid är att effektens intensitet påverkar skadetröskeln och dess omfattning påverkar antal skadetärningar. Se särskilt avsnitt för [[Särskilda situationer]]
