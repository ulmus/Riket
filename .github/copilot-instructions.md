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
- **Egenskaper** (Attributes): Strid, Fysik, Smidighet, Sinnen, Analys, List, Samspel, Vilja.
- **Sekundära egenskaper**: Kroppspoäng (KP), Stabilitet, Förflyttning, Slagstyrka.
- **Speltermer**: Framgång, Fokus, Momentum, Scen, Runda, Slag, Svårighet, Komplikation.
- **Organisationer**: Program Frigg, T-kontoret, Frigg-avdelningen, FÖPA, Extra-Normalt Subjekt (ENS).

## Core Mechanics (Rules Reference)
When generating rules or resolving actions, adhere to these core mechanics:
- **Resolution:** Roll a pool of **d12s** (T12).
- **Dice Pool:** Attribute + Attribute +/- Modifiers.
- **Success:** Any die showing **10+** is a success.
- **Focus (Fokus):** Any die showing **12** generates 1 Focus point.
- **Attributes:** Strid, Fysik, Smidighet, Sinnen, Analys, List, Samspel, Vilja.
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
  - Bold key terms (Attributes, Expertises) when defining them.
  - Use lists for clarity in rules text.
  - No emojis or informal language.
- **Language:** Write in Swedish unless instructed otherwise.
  - Ensure that proper Swedish grammar, wording and spelling are used. Avoid anglicisms unless they are established terms in the game.
  - Be consistent with Swedish diacritics (å, ä, ö).
  - Beware of false friends between English and Swedish.
- **Examples:** When providing examples, ensure they are relevant to the Cold War setting and the themes of espionage and superhuman abilities.

## Developer/Writer Workflow
- **Editing:** The user uses Obsidian. Ensure links match existing filenames exactly.
- **Styling:** `publish.css` controls the visual presentation (Obsidian Typewriter theme). Avoid inline HTML styles; rely on semantic Markdown.
