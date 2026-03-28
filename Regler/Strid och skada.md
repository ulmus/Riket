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

Om en attack träffar ett mål så avgörs skadan genom **träff-framgångar**, vapnets **Skada** och målets **skydd**.

## Tålighet

Varje karaktär har en **Tålighet** lika med **1 + halva Fysik (avrundat uppåt)**. Tålighet avgör trösklarna för skadesteg och hur mycket skada du tål innan du blir allvarligt påverkad. Enskilda träffar kan också ge kritiska effekter även om din totala skada inte nått en tröskel (se [[Kritiska träffar]]).

### Skadesteg

| Skada          | Tröskel              | Effekt                                     |
| -------------- | -------------------- | ------------------------------------------ |
| **Oskadd**     | 0 KP                 | Inga effekter                              |
| **Sårad**      | > Tålighet KP        | Alla handlingar ett steg svårare           |
| **Medvetslös** | > 2 × Tålighet KP    | Du faller ihop och kan inte agera          |
| **Döende**     | > 3 × Tålighet KP    | Se *Döende* nedan, eller via kritisk träff |
| **Död**        | > 4 × Tålighet KP    | Du dör omedelbart                          |

*Exempel: En karaktär med Fysik 2 har Tålighet 2. Hon blir Sårad vid 3+ KP skada, Medvetslös vid 5+ KP, Döende vid 7+ KP, och dör omedelbart vid 9+ KP.*

## 1. Rulla skadetärningar

När en attack träffar, rulla lika många **skadetärningar** (T12) som antalet **Framgångar** på attackslaget. Skadeslag ger inte Fokus.

- Varje tärning som visar **10–11** ger **1 KP skada**.
- Varje tärning som visar **12** ger **1 KP skada** och är en **kritisk träff**.

Vissa vapenegenskaper (t.ex. **Automateld**) ger extra tärningar på attackslaget, vilket indirekt ökar antalet skadetärningar.

## 2. Lägg till Skada

Varje vapen har ett värde för **Skada** som anger den garanterade KP-skadan vid en lyckad träff. **Skada** läggs till KP-skadan från skadetärningarna. Typiska värden är **0** för obeväpnade attacker och **1–4** för beväpnade attacker – se [[Vapen]] för varje vapens Skada.

## 3. Applicera skydd

Målets **Skydd** (från rustning, täckning, etc.) minskar den totala KP-skadan:

**Slutlig skada = (KP-skada + Skada) − Skydd** (minst 0)

Skydd hindrar först icke-kritiska träffar och först när alla de har blivit absorberade hindras eventuella kritiska träffar.

## 4. Kritiska träffar

Om minst en skadetärning visar **12** har du fått en **kritisk träff**. Slå 1T12 och lägg till modifierare för att bestämma effekten på lämplig kritisk träff-tabell baserat på vapnets **Skadetyp** (se [[Kritiska träffar]]).

**Modifierare till slaget:**

- **+1 per ytterligare 12:a** på skadetärningarna
- **Skada:** +vapnets värde för **Skada** (vapen med egenskapen **Penetrerande** lägger istället till **dubbla Skada**)
- **Målets kritiska tålighet:** −X (endast för stora eller väldigt tåliga varelser)

Om *flera* skadetärningar visar 12: slå **en gång** och lägg till +1 för varje ytterligare 12:a, plus övriga modifikatorer.

Kritiska träffar ger effekter som blödning, brutna ben, eller döende – oavsett hur mycket KP-skada som gick igenom.

## Exempel

> **Anton** skjuter med sin pistol mot en sovjetisk gränsvakt. Pistolen har **Skada 1** och skadetyp **Skjutvapen**.
> Antons attackslag ger **3 framgångar**. Han rullar alltså **3 skadetärningar** (T12).
> Han rullar 3T12: **10, 11, 12**. Alla tre visar 10+, alltså **3 KP skada**. Pistolens **Skada 1** läggs till – totalt **4 KP**. Vakten bär **tjock rock (Skydd 1)**, så slutlig skada blir **4 − 1 = 3 KP**.
> Vakten (Fysik 2, Tålighet 2) har nu tagit 3 KP skada och är Sårad (tröskeln är > 2) och tar därför 1 Stress och alla hans handlingar blir ett steg svårare.
> Dessutom visade en tärning **12** – kritisk träff! Anton slår 1T12 och får en 7. Med Skada +1 (pistol) blir totalen **8**. Han slår på tabellen för **Skjutvapen** och får effekt 8: *Genomskjuten axel*.

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

1. **Träff?** Räkna framgångar på attackslaget.
2. **Rulla skadetärningar:** Lika många T12 som framgångar. 10–11 = 1 KP, 12 = 1 KP + kritisk träff.
3. **Lägg till Skada:** Vapnets Skada-värde adderas som KP.
4. **Dra av Skydd** från totalen (vanlig skada först, sedan kritiska).
5. **Applicera skada:** Uppdatera KP, kolla trösklar (Sårad/Medvetslös/Döende).
6. **Kritisk träff?** Slå på rätt tabell (Skada adderas till kritisk träff-slag, dubbelt med Penetrerande).

### Läkning

Se kapitlet [[Läkning & vård]].

### Kritiska träffar

Se kapitlet [[Kritiska träffar]] för tabeller baserade på skadetyp (Kross, Stick, Hugg, Eld, Skjutvapen, Explosion, Gift, Blödning, Strålning, Övriga).

## Särskilda situationer

Se särskilt avsnitt för [[Särskilda situationer]]
