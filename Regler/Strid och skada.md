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

Om en attack träffar ett mål avgörs skadan direkt från attackslaget, vapnets **Skada** och målets **Skydd**.

## Tålighet

Varje karaktär har en **Tålighet** lika med **Fysik + Vilja**. Tålighet avgör trösklarna för skadesteg och hur mycket skada du tål innan du blir allvarligt påverkad. Enskilda träffar kan också ge kritiska effekter även om din totala skada inte nått en tröskel (se [[Kritiska träffar]]).

### Skadesteg

| Skada          | Tröskel              | Effekt                                     |
| -------------- | -------------------- | ------------------------------------------ |
| **Oskadd**     | 0 KP                 | Inga effekter                              |
| **Sårad**      | > Tålighet KP        | Alla handlingar ett steg svårare           |
| **Medvetslös** | > 2 × Tålighet KP    | Du faller ihop och kan inte agera          |
| **Döende**     | > 3 × Tålighet KP    | Se *Döende* nedan, eller via kritisk träff |
| **Död**        | > 4 × Tålighet KP    | Du dör omedelbart                          |

*Exempel: En karaktär med Fysik 2 och Vilja 3 har Tålighet 5. Hon blir Sårad vid 6+ KP skada, Medvetslös vid 11+ KP, Döende vid 16+ KP, och dör omedelbart vid 21+ KP.*

## 1. Räkna skada

KP-skadan räknas direkt från attackslaget – inget separat skadeslag behövs.

**KP-skada = framgångar + vapnets Skada − målets Skydd** (minst 0)

En **framgång** är varje tärning som visar **10+** på attackslaget. En **12:a** ger dessutom 1 Fokus (som tidigare) och triggar en **kritisk träff** (se nedan).

## 2. Skada (vapenbonus)

Varje vapen har ett värde för **Skada** som är en fast bonus till KP-skadan vid en lyckad träff. Typiska värden är **0** för obeväpnade attacker och **1–4** för beväpnade attacker – se [[Vapen]] för varje vapens Skada.

## 3. Skydd

Målets **Skydd** (från rustning, täckning, etc.) dras av från KP-skadan (minst 0). Skydd hindrar KP-skada men påverkar inte om en kritisk träff utlöses.

## 4. Kritiska träffar

Om minst en tärning på attackslaget visar **12** har du fått en **kritisk träff**. Slå 1T12 och lägg till modifierare för att bestämma effekten på lämplig tabell baserat på vapnets **Skadetyp** (se [[Kritiska träffar]]).

**Modifierare till slaget:**

- **+1 per ytterligare 12:a** på attackslaget
- **Skada:** +vapnets värde för **Skada** (vapen med egenskapen **Penetrerande** lägger istället till **dubbla Skada**)
- **Målets kritiska tålighet:** −X (endast för stora eller väldigt tåliga varelser)

Om *flera* tärningar visar 12: slå **en gång** på tabellen och lägg till +1 per ytterligare 12:a.

Kritiska träffar ger effekter som blödning, brutna ben eller döende – oavsett hur mycket KP-skada som gick igenom Skyddet. En 12:a ger alltid både 1 Fokus och en kritisk träff.

## Exempel

> **Anton** skjuter med sin pistol mot en sovjetisk gränsvakt. Pistolen har **Skada 1** och skadetyp **Skjutvapen**.
> Antons attackslag ger **3 framgångar**, varav en tärning visar **12**. Han får 1 Fokus från 12:an.
> Vakten bär **tjock rock (Skydd 1)**. KP-skada = 3 framgångar + 1 Skada − 1 Skydd = **3 KP**.
> Vakten (Fysik 2, Vilja 3, Tålighet 5) tar 3 KP – fortfarande Oskadd, men tar **1 Stress** (av att ha tagit skada).
> 12:an triggar en kritisk träff. Anton slår 1T12 och får en 7. Med Skada +1 (pistol) blir totalen **8** på Skjutvapen-tabellen: *Genomskjuten axel*.

## Effekter av skada

## Stress

Varje gång du tar minst 1 KP skada så tar du också 1 Stress.

## Sårad

När du har tagit mer än **Tålighet** i KP-skada blir du **Sårad**:

- Alla handlingar blir **ett steg svårare** (Normalt → Svårt, Svårt → Mycket Svårt).
- Du tar **1 Stress**.

## Medvetslös

När du har tagit mer än **2 × Tålighet** i KP-skada blir du **Medvetslös**:

- Du faller ihop och kan inte agera.
- Du vaknar när din KP-skada återställs till under tröskeln, eller efter 1T12 minuter (spelledarens val).

## Döende

Du blir **Döende** om:

- Du tar mer än **3 × Tålighet** KP-skada (chock), eller
- En **kritisk träff** gör dig Döende.

## Omedelbar död

Du dör omedelbart om:

- Du tar mer än **4 × Tålighet** KP-skada
- En **kritisk träff** beskriver att du dör omedelbart

### Överlevnadsslag

När du är Döende måste du slå **Överlevnadsslag** (Fysik + Vilja) med ett intervall som beror på orsaken:

| Orsak              | Intervall                           |
| ------------------ | ----------------------------------- |
| KP-förlust (chock) | Per minut                           |
| Kritisk träff      | Enligt tabellen (runda/minut/timme) |

Varje Överlevnadsslag:

- **Misslyckat:** Du dör.
- **Lyckat med en framgång:** Du överlever tills nästa slag.
- **Lyckat med flera framgångar:** Extra framgångar kan användas för att stabilisera dig. När du fått totalt tre stabiliseringsframgångar så är du stabil och behöver inte slå fler Överlevnadsslag.

### Stabilisering

En annan person kan stabilisera dig med **Analys + Smidighet (Medicin)**:

- Kräver en huvudhandling för första försöket, en minut för andra försöket och en timme för tredje försöket.
- Varje framgång läggs till stabiliseringsframgångarna som krävs för att överleva (totalt tre)

## Blödning

Vissa kritiska träffar orsakar **blödning**. Det finns två blödningstillstånd — bara det högsta gäller:

| Typ                  | Frekvens                | Skada         |
| -------------------- | ----------------------- | ------------- |
| **Lätt blödning**    | I början av varje minut | 1 KP          |
| **Kraftig blödning** | I början av varje runda | 1 KP          |

- Blödning staplas inte — bara det högsta tillståndet gäller.
- Om du redan har Lätt blödning och får Lätt blödning igen händer inget.
- Om du har Lätt blödning och får Kraftig blödning uppgraderas din blödning till Kraftig.

### Blödningsskada

Varje gång blödningen orsakar KP-skada: slå 1T12. På **12** triggas en **kritisk träff** (Blödning-tabellen, se [[Kritiska träffar#Blödning]]).

### Stoppa blödning

Blödning stoppas med **Kirurgi** (Analys + Smidighet). Varje framgång minskar blödningen ett steg:

- 1 framgång: Kraftig → Lätt, eller Lätt → ingen blödning.
- 2 framgångar: Kraftig → ingen blödning.

Se [[Läkning & vård]] för mer information.

## Sammanfattning

1. **Träff?** Räkna framgångar (10+) på attackslaget.
2. **Räkna skada:** KP-skada = framgångar + vapnets Skada − Skydd (minst 0).
3. **Applicera skada:** Uppdatera KP, kolla trösklar (Sårad/Medvetslös/Döende).
4. **Kritisk träff?** Varje 12:a på attackslaget ger 1 Fokus och triggar en kritisk träff. Slå 1T12 på rätt tabell, +vapnets Skada (dubbel med Penetrerande), +1 per ytterligare 12:a.

### Läkning

Se kapitlet [[Läkning & vård]].

### Kritiska träffar

Se kapitlet [[Kritiska träffar]] för tabeller baserade på skadetyp (Kross, Stick, Hugg, Eld, Skjutvapen, Explosion, Gift, Blödning, Strålning, Övriga).

## Särskilda situationer

Se särskilt avsnitt för [[Särskilda situationer]]
