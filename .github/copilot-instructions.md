# GitHub Copilot Instructions for "I Rikets Tjänst"

## Project Overview
This workspace contains the rules, campaign notes, and adventures for **"I Rikets Tjänst"**, a Swedish tabletop roleplaying game.
- **Genre:** Tactical superhero RPG set during the Cold War.
- **Theme:** Secret agents, superhumans (Program Frigg), historical shadows, 1960ies.
- **Language:** Swedish.

## Architecture & Structure
- **Format:** Markdown files intended for use with **Obsidian**.
- **Linking:** Use Obsidian-style wikilinks `[[Page Name]]` or `[[Page Name#Section]]` for cross-referencing.
- **Directory Structure:**
  - `Regler/`: Core rulebooks (Mechanics, Combat, Abilities).
  - `Äventyr/`: Adventure modules and scenarios.
  - `Assets/`: Includes general assets like images, maps, and reference materials.
  - `Kampanj.md`: Campaign overview and NPC lists.

## Terminology
When generating content, always use the established terminology defined in [[Terminologi]]. This ensures consistency across all rules, adventures, and campaign materials. Key terms include:
- **Egenskaper** (Attributes): Analys, Fysik, List, Samspel, Sinnen, Smidighet, Strid, Vilja.
- **Sekundära egenskaper**: Kroppspoäng (KP), Stabilitet, Förflyttning, Slagstyrka.
- **Speltermer**: Framgång, Fokus, Momentum, Scen, Runda, Slag, Svårighet, Komplikation.
- **Organisationer**: Program Frigg, T-kontoret, Frigg-avdelningen, FÖPA, Extra-Normalt Subjekt (ENS).

## Core Mechanics (Rules Reference)
When generating rules or resolving actions, adhere to these core mechanics:
- **Resolution:** Roll a pool of **d12s** (T12).
- **Dice Pool:** Attribute + Attribute +/- Modifiers.
- **Success:** Any die showing **10+** is a success.
- **Focus (Fokus):** Any die showing **12** generates 1 Focus point.
- **Attributes:** Analys, Fysik, List, Samspel, Sinnen, Smidighet, Strid, Vilja.
- **Expertise (Expertis):** Adds +1 to the roll and unlocks specific abilities.
- **Secondary Stats:**
  - *Stabilitet* = 1 + (Vilja / 2).
  - *Slagstyrka* = Fysik / 2.

## Content Generation Guidelines
- **Tone:** Maintain a "Cold War thriller" vibe mixed with "Golden Age comics" but grounded in a gritty reality.
- **Formatting:**
  - Use standard Markdown headers (`#`, `##`, `###`).
  - Use Obsidian wikilinks for all internal references.
  - Use consistent terminology and phrasing throughout the text.
  - The filename is the title of the document.
  - Use lists for clarity in rules text.
  - No emojis or informal language.
  - Markdown should follow markdownlint standards.
- **Language:** Write in Swedish unless instructed otherwise.
  - Ensure that proper Swedish grammar, wording and spelling are used. Avoid anglicisms unless they are established terms in the game.
  - Be consistent with Swedish diacritics (å, ä, ö).
  - Beware of false friends between English and Swedish.
- **Examples:** When providing examples, ensure they are relevant to the Cold War setting and the themes of espionage and superhuman abilities.

## Terminology and Style Guide

### Capitalization Rules
- **Egenskaper** (Analys, Fysik, List, Samspel, Sinnen, Smidighet, Strid, Vilja): Always capitalize when referring to the specific attribute (e.g., "slå för Fysik + Strid").
- **Sekundära egenskaper** (Kroppspoäng, Stabilitet, Förflyttning, Slagstyrka): Capitalize when referring to the stat name.
- **Expertiser**: Capitalize when referring to a specific expertis (e.g., "Expertis: Läkare").
- **Förmågor**: Capitalize the förmåga name when referring to it specifically (e.g., "förmågan Fäktning").
- **Krafter**: Capitalize when referring to specific named powers.
- **Fokus** and **Momentum**: Always capitalize as game terms.
- **Stress** and **Trauma**: Capitalize when referring to the game mechanic, lowercase when used in general sense.
- **Sammanbrottstabellen**: Capitalize as it refers to a specific table.
- **Dice notation**: Use "T12" (not "t12" or "d12") for the twelve-sided die.

### Bold Usage (**text**)
Use bold for:
- **Term definitions**: When first introducing or defining a game term (e.g., "**Fokus** är en personlig resurs...").
- **Mechanical keywords**: Key terms in rules that have specific meaning (e.g., **Framgång**, **Svårighet**, **Skadetärningar**).
- **Important effects**: Conditions and states that affect gameplay (e.g., **Sårad**, **Döende**, **Medvetslös**).
- **Requirement labels**: Labels like "Krav:", "Effekt:", "Kostnad:".
- **Table headers** and **column names** in inline context.
- **Action types**: **Huvudhandling**, **Bihandling**, **Reaktion**.
- **Numeric values** that are mechanically significant (e.g., "**+1 svårighet**", "**1 Stress**").

### Italics Usage (*text*)
Use italics for:
- **Examples**: Narrative examples that illustrate rules (e.g., *Exempel: En karaktär med Fysik 3...*).
- **Flavor text**: Descriptive or atmospheric text not part of the rules.
- **Notes and asides**: Additional information marked as "Notis:" or similar.
- **Egenskap + Egenskap combinations**: When showing what to roll, italicize the combination (e.g., *Fysik + Strid*) in example text.
- **Internal references**: When explaining where to find more info (e.g., *se [[Strid och skada]]*).
- **Trauma behaviors**: The behavioral descriptions of activated traumas (e.g., *Desperat beskyddare*).

### Terminology Consistency
Always use the following terms as defined in [[Terminologi]]:
- **Framgång** (not "lycka" or "success") for a successful die result of 10+.
- **Fokus** (not "fokuspoäng") for the personal resource.
- **Momentum** (not "Story-Fokus") for the narrative pacing that sets starting Fokus each scene.
- **Slag** (not "kast" or "tärningskast") for a dice roll.
- **Svårighet** (not "svårighetsgrad") for the number of successes required.
- **Komplikation** for unexpected negative events after spending Fokus on a failed roll.
- **Kroppspoäng (KP)** with abbreviation in parentheses on first use, then just "KP".
- **Stabilitet** for stress threshold.
- **Sammanbrott** for psychological breakdown.
- **Extra-Normalt Subjekt (ENS)** for superhumans, abbreviated as "ENS" after first use.
- **Skadetärning/ar** (not "skada" alone) any damage die, from weapon or success.
- **Skydd** (not "rustning" alone) for armor/protection value.
- **Kritisk träff** for critical hits (die showing 12 on damage roll).

### Formatting Patterns
- **Dice pools**: Write as "Egenskap + Egenskap" (e.g., "Fysik + Strid") in alphabetical order.
- **Modifiers**: Write as "+X" or "−X" (use proper minus sign, not hyphen).
- **References**: Use wikilinks for all internal document references (e.g., [[Strid och skada]]).
- **Requirements**: Format as "*Krav:* Egenskap X, Förmåga Y".
- **Cost**: Format as "Kostar X Fokus" or "Spendera X Fokus".
- **Duration**: Express as "tills behandlad", "per runda", "under 1T12 rundor".

## Developer/Writer Workflow
- **Editing:** The user uses Obsidian. Ensure links match existing filenames exactly.
- **Styling:** `publish.css` controls the visual presentation (Obsidian Typewriter theme). Avoid inline HTML styles; rely on semantic Markdown.
