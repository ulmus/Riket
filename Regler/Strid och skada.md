# Strid och skada

## Initiativ

Varje strid börjar med att alla inblandade slår 1T12 och lägger till sitt värde på Strid. Detta blir deras initiativ under hela striden. Striden delas upp i rundor om ca fem sekunder och i varje runda börjar den som har högst initiativ att ta sin tur och därefter går turen vidare i fallande ordning.

## Turer och handlingar

På din tur kan du utföra en huvudhandling och en bihandling. Du kan också, istället för en huvudhandling utföra en bihandling till (för totalt två bihandlingar på din tur). Utöver det så kan en reaktionshandling utföras utanför din tur, men bara om något händer som utlöser reaktionen.

## Huvudhandlingar

- Avståndsattack (Smidighet + Strid)
- Närstridsattack (Fysik + Strid eller Smidighet + Strid)

## Bihandlingar

- Sikta: +1
- Ställa sig upp
- Dra ett vapen
- Röra sig Fysik + Smidighet meter

## Reaktionshandlingar

- Kasta sig undan en attack (Smidighet + Strid), du är på marken efteråt och det krävs en bihandling för att resa sig
- Parera en närstridsattack (Smidighet + Strid + Paradbonus)

## Avståndsattacker

Om du gör en avståndsattack slår du i allmänhet för Smidighet + Strid med modifikationer.

- Minst en bihandling lagd på att sikta +1
- Stabil position +1 (+2 om liggande)

Svårigheten bestäms av SL utifrån omständigheterna. Faktorer som gör skott svårare:

- Målet är i skydd eller snabb rörelse
- Mörker eller dålig sikt
- Avstånd bortom vapnets räckvidd
- Skytten är i rörelse eller instabil position

En enskild försvårande faktor gör skottet normalt **Svårt**. Flera faktorer eller extrema förhållanden kan göra det **Mycket Svårt** – SL avgör. Skott långt bortom vapnets räckvidd kan vara **Mycket Svårt** eller omöjligt.

## Närstridsattacker

När du gör en närstridsattack slår du för Fysik + Strid eller Smidighet + Strid (beroende på vapen och förmågor) med modifikationer.

## Skador

Om en attack träffar ett mål så avgörs skadan genom **träff-framgångar**, vapnets **skadetärningar** och målets **skydd**.

## Kroppspoäng (KP)

Varje karaktär har **Kroppspoäng (KP)** lika med **Fysik + Vilja**. KP representerar hur mycket skada du kan ta totalt innan du blir allvarligt påverkad. Enskilda träffar kan också ge kritiska effekter även om din totala skada inte kommit upp i din KP-nivå (se [[Kritiska träffar]]).

### Skadesteg

| Skada          | Tröskel                  | Effekt                                     |
| -------------- | ------------------------ | ------------------------------------------ |
| **Oskadd**     | 0 KP                     | Inga effekter                              |
| **Sårad**      | > Fysik KP               | Alla handlingar ett steg svårare           |
| **Medvetslös** | > Fysik + Vilja KP       | Du faller ihop och kan inte agera          |
| **Döende**     | > 2 × (Fysik + Vilja) KP       | Se *Döende* nedan, eller via kritisk träff |
| **Död**        | > 2 × (Fysik + Vilja) + 5 KP   | Du dör omedelbart                          |

*Exempel: En karaktär med Fysik 3 och Vilja 2 har 5 KP. Hon blir Sårad vid 4+ KP skada, Medvetslös vid 6+ KP, Döende vid 11+ KP, och dör omedelbart vid 16+ KP.*

## 1. Bestäm antal skadetärningar

När en attack träffar, räkna ihop **skadetärningar**:

Antal skadetärningar = Träff-framgångar + Vapnets Skadetärningar

- **Träff-framgångar:** Antalet framgångar på attackslaget.
- **Skadetärningar:** Vapnets skadetärningar enligt vapentabellen (se [[Vapen]]).
- **Egenskaper:** Vissa vapenegenskaper (t.ex. **Automateld**) ger extra skadetärningar.

## 2. Rulla skadetärningar

Rulla antalet T12. Skadeslag ger inte Fokus.

- Varje tärning som visar **10–11** ger **1 KP skada**.
- Varje tärning som visar **12** ger **1 KP skada** och är en **kritisk träff**.

## 3. Applicera skydd

Målets **Skydd** (från rustning, täckning, etc.) minskar KP-skadan:

**Slutlig skada = KP-skada − Skydd** (minst 0)

Skydd hindrar först icke-kritiska träffar och först när alla de har blivit absorberade hindras eventuella kritiska träffar.

## 4. Kritiska träffar

Om minst en skadetärning visar **12** har du fått en **kritisk träff**. Slå 1T12 och lägg till modifierare för att bestämma effekten på lämplig kritisk träff-tabell baserat på vapnets **Skadetyp** (se [[Kritiska träffar]]).

**Modiferare till slaget:**

- **+1 per ytterligare 12:a** på skadetärningarna
- **Vapnets kritiska skadebonus** (från −1 till +3, se [[Vapen]])
- **Målets kritiska tålighet** (om något, endast för stora/tåliga varelser)

Om *flera* skadetärningar visar 12: slå **en gång** och lägg till +1 för varje ytterligare 12:a, plus övriga modifikatorer.

Kritiska träffar ger effekter som blödning, brutna ben, eller döende – oavsett hur mycket KP-skada som gick igenom.

## Exempel

> **Anton** skjuter med sin pistol mot en sovjetisk gränsvakt. Pistolen har **Skadetärningar +4**, **Kritisk bonus +0**, och skadetyp **Småkaliber**.
> Antons träffslag ger **2 framgångar**. Han slår alltså **2 + 4 = 6 skadetärningar**.
> Han rullar 6T12: **3, 7, 10, 10, 11, 12**. Fyra tärningar visar 10+, alltså **4 KP skada**. Vakten bär **tjock rock (Skydd 1)**, så slutlig skada är **3 KP**.
> Vakten (Fysik 2, Vilja 2, 4 KP totalt) har nu tagit 3 KP skada och är Sårad (tröskeln är >2) och tar därför 1 Stress och alla hans handlingar blir ett steg svårare.
> Dessutom visade en tärning **12** – kritisk träff! Anton slår 1T12 för kritisk träff och får en 8. Med pistolens kritiska bonus på +0 blir totalen **8**. Han slår på tabellen för **Småkalibriga eldvapen** och får effekt 8: *Genomskjuten axel*.

## Effekter av skada

## Stress

Varje gång du tar minst 1 KP skada så tar du också 1 Stress.

## Sårad

När du har tagit mer än **Fysik** i KP-skada blir du **Sårad**:

- Alla handlingar blir **ett steg svårare** (Normalt → Svårt, Svårt → Mycket Svårt).
- Du tar **1 Stress**.

## Medvetslös

När du har tagit mer än **Fysik + Vilja** i KP-skada blir du **Medvetslös**:

- Du faller ihop och kan inte agera.
- Du vaknar när din KP-skada återställs till under tröskeln, eller efter 1T12 minuter (spelledarens val).

## Döende

Du blir **Döende** om:

- Du tar mer än **2 × (Fysik + Vilja)** KP-skada (chock), eller
- En **kritisk träff** gör dig Döende.

## Omedelbar död

Du dör omedelbart om:

- Om du tar mer än **2 × (Fysik + Vilja) + 5** KP-skada
- En **kritisk träff** beskriver att du dör omedelbart

### Överlevnadsslag

När du är Döende måste du slå **Överlevnadsslag** (Fysik + Vilja) med ett intervall som beror på orsaken:

| Orsak              | Intervall                           |
| ------------------ | ----------------------------------- |
| KP-förlust (chock) | Per minut                           |
| Kritisk träff      | Enligt tabellen (runda/minut/timme) |

Varje Överlevnadsslag:

- **Misslyckat:** Du dör.
- **Lyckat med en framgång:** Du överlever tills nästa slag. Notera överskjutande framgångar.
- **Lyckat med flera framgångar:** Extra framgångar kan användas för att stabilisera dig. När du fått totalt tre stabiliseringsframgångar så är du stabil och behöver inte slå fler Överlevnadsslag.

### Stabilisering

En annan person kan stabilisera dig med **Analys + Smidighet (Medicin)**:

- Kräver en huvudhandling för första försöket, en minut för andra försöket och en timme för tredje försöket.
- Vid framgång slutar du vara Döende (men behöver fortfarande läkning).

## Blödning

Vissa kritiska träffar orsakar **blödning**. Det finns två blödningstillstånd — bara det högsta gäller:

| Typ                  | Frekvens                | Skadetärningar |
| -------------------- | ----------------------- | -------------- |
| **Lätt blödning**    | I början av varje minut | 1T12           |
| **Kraftig blödning** | I början av varje runda | 1T12           |

- Blödning staplas inte — bara det högsta tillståndet gäller.
- Om du redan har Lätt blödning och får Lätt blödning igen händer inget.
- Om du har Lätt blödning och får Kraftig blödning uppgraderas din blödning till Kraftig.

### Blödningsskada

Blödningsskada fungerar som vanliga skadetärningar:

- **10–11** = 1 KP skada.
- **12** = 1 KP skada + kritisk träff (slå på tabellen för **Blödning**, se [[Kritiska träffar#Blödning]]).

### Stoppa blödning

Blödning stoppas med **Kirurgi** (Analys + Smidighet). Varje framgång minskar blödningen ett steg:

- 1 framgång: Kraftig → Lätt, eller Lätt → ingen blödning.
- 2 framgångar: Kraftig → ingen blödning.

Se [[Läkning & vård]] för mer information.

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

## Särskilda situationer

Se särskilt avsnitt för [[Särskilda situationer]]
