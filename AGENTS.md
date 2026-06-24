# AI Agent Instructions for "I Rikets Tjänst"

## Project Overview
This workspace contains the rules, campaign notes, and adventures for **"I Rikets Tjänst"**, a Swedish tabletop roleplaying game.
- **Genre:** Tactical superhero RPG set during the Cold War.
- **Theme:** Secret agents, superhumans (Program Frigg), historical shadows, 1960ies.
- **Language:** Swedish.

## Architecture & Structure
- **Format:** Markdown files intended for use with **Obsidian**.
- **Linking:** Use Obsidian-style wikilinks `[[Page Name]]` or `[[Page Name#Section]]` for cross-referencing.
- **Directory Structure:**
  - `content/`: Everything published to the website lives here (see *Publishing* below). The Obsidian vault is the repository root, so wikilinks still resolve by basename across the whole vault.
    - `content/Regler/`: Core rulebooks (Mechanics, Combat, Abilities).
    - `content/Äventyr/`: Adventure modules and scenarios.
    - `content/Världen/`, `content/Karaktärer/`: Setting and player characters.
    - `content/Assets/`: Images, maps, and reference materials referenced by the published pages.
  - `Assets/foundry/`: Foundry VTT system (not published).
  - `Kampanj.md`, `Manuskript.md`: Campaign/GM notes and the PDF build manifest (kept at the root, not published).

## Terminology
When generating content, always use the established terminology defined in [[Terminologi]]. This ensures consistency across all rules, adventures, and campaign materials. Key terms include:
- **Egenskaper** (Attributes): Analys, Fysik, List, Samspel, Sinnen, Smidighet, Strid, Vilja.
- **Sekundära egenskaper**: Kroppspoäng (KP), Tålighet, Stabilitet, Förflyttning.
- **Speltermer**: Framgång, Fokus, Momentum, Scen, Runda, Slag, Svårighet, Komplikation.
- **Organisationer**: Program Frigg, T-kontoret, Frigg-avdelningen, FÖPA, Extra-Normalt Subjekt (ENS).

## Core Mechanics (Rules Reference)
When generating rules or resolving actions, adhere to these core mechanics:
- **Resolution:** Roll a pool of **d12s** (T12).
- **Dice Pool:** Attribute + Attribute +/- Modifiers.
- **Success:** Any die showing **10+** is a success.
- **Focus (Fokus):** Any die showing **12** generates 1 Focus point.
- **Attributes:** Analys, Fysik, List, Samspel, Sinnen, Smidighet, Strid, Vilja.
- **Expertise (Expertis):** Reduces difficulty by one step (Normal → Easy = auto-success) and unlocks specific abilities.
- **Secondary Stats:**
  - *Tålighet* = Fysik + Vilja.
  - *Stabilitet* = 3 (fast värde för alla rollpersoner).
  - *Förflyttning* = Fysik + Smidighet.

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
  - **Images:** Embedded images (`![[Bild.png]]`) default to a smaller, right-floated thumbnail with the body text wrapping alongside them (the dossier-photo look). Place the embed just before the paragraph it illustrates. For maps, floor plans, or diagrams that need the full column width, add the `|wide` alias: `![[Karta.png|wide]]`. A fixed pixel width can still be set with a numeric alias, e.g. `![[Porträtt.png|200]]`.
- **Language:** Write in Swedish unless instructed otherwise.
  - Ensure that proper Swedish grammar, wording and spelling are used. Avoid anglicisms unless they are established terms in the game.
  - Be consistent with Swedish diacritics (å, ä, ö).
  - Beware of false friends between English and Swedish.
- **Examples:** When providing examples, ensure they are relevant to the Cold War setting and the themes of espionage and superhuman abilities.

## Terminology and Style Guide

### Capitalization Rules
- **Egenskaper** (Analys, Fysik, List, Samspel, Sinnen, Smidighet, Strid, Vilja): Always capitalize when referring to the specific attribute (e.g., "slå för Fysik + Strid").
- **Sekundära egenskaper** (Kroppspoäng, Tålighet, Stabilitet, Förflyttning): Capitalize when referring to the stat name.
- **Expertiser**: Capitalize when referring to a specific expertis (e.g., "Expertis: Läkare").
- **Förmågor**: Capitalize the förmåga name when referring to it specifically (e.g., "förmågan Fäktning").
- **Krafter**: Capitalize when referring to specific named powers.
- **Fokus** and **Momentum**: Always capitalize as game terms.
- **Effekt**: Capitalize when it denotes the game term (framgångar utöver de som krävs för att klara svårigheten). Lowercase "effekt"/"effekter" for the everyday sense (a power's or condition's verkan).
- **Stress** and **Trauma**: Capitalize when referring to the game mechanic, lowercase when used in general sense.
- **Sammanbrottstabellen**: Capitalize as it refers to a specific table.
- **Dice notation**: Use "T12" (not "t12" or "d12") for the twelve-sided die.

### Bold Usage (**text**)
Use bold for:
- **Term definitions**: When first introducing or defining a game term (e.g., "**Fokus** är en personlig resurs...").
- **Mechanical keywords**: Key terms in rules that have specific meaning (e.g., **Framgång**, **Svårighet**, **Skada**, **Skydd**).
- **Important effects**: Conditions and states that affect gameplay (e.g., **Sårad**, **Döende**, **Medvetslös**).
- **Requirement labels**: Labels like "Krav:", "Verkan:", "Kostnad:".
- **Table headers** and **column names** in inline context.
- **Action types**: **Handling**, **Stillastående-handling**.
- **Numeric values** that are mechanically significant (e.g., "**1 Stress**").
- **Difficulty levels**: **Normal**, **Svår**, **Mycket Svår** when specifying difficulty as a named level in rules or adventure text. Inflect to **Normalt/Svårt/Mycket Svårt** (neutrum singular) or **Svåra/Mycket Svåra** (plural) when used as predicate adjective.

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
- **Effekt** for the surplus successes beyond what the difficulty (or an opponent) required, spent on extra verkningar (more skada, longer duration, more targets). A table column that lists a die-roll or step *outcome* is headed **Utfall**, never "Effekt". The inline label that introduces what an ability does is **Verkan:** (not "Effekt:"). Together this reserves a capitalized **Effekt** entirely for the term.
- **Fokus** (not "fokuspoäng") for the personal resource.
- **Momentum** (not "Story-Fokus") for the narrative pacing that sets starting Fokus each scene.
- **Slag** (not "kast" or "tärningskast") for a dice roll.
- **Svårighet** expressed as named levels: **Normal** (1 framgång), **Svår** (2 framgångar), **Mycket Svår** (3 framgångar). Never use numeric "svårighet X" — always use the named levels. Omit difficulty when it is **Normal** (the default). SL sets difficulty as a holistic judgment, not by summing individual modifiers. Use "ett steg svårare" / "två steg svårare" for relative modifiers (e.g., conditions like Sårad). When the difficulty appears as a predicate adjective with plural subject ("alla slag är minst..."), inflect to **Svåra** / **Mycket Svåra**. In **arrow notation** showing level progression (e.g. "Lätt → Normal → Svår → Mycket Svår"), use the canonical basformer regardless of grammatical context — pilarna refererar till nivå-etiketter, inte till predikatadjektiv.
- **Komplikation** for unexpected negative events after spending Fokus and rolling a one on the extra die.
- **Kroppspoäng (KP)** with abbreviation in parentheses on first use, then just "KP".
- **Stabilitet** for stress threshold.
- **Sammanbrott** for psychological breakdown.
- **Extra-Normalt Subjekt (ENS)** for superhumans, abbreviated as "ENS" after first use.
- **Skada** for weapon's flat KP bonus on hit; total KP damage = framgångar + Skada − Skydd.
- **Skydd** (not "rustning" alone) for armor/protection value.
- **Kritisk träff** for critical hits (die showing 12 on the attack roll).

### Formatting Patterns
- **Dice pools**: Write as "Egenskap + Egenskap" (e.g., "Fysik + Strid") in alphabetical order.
- **Modifiers**: Write as "+X" or "−X" (use proper minus sign, not hyphen).
- **References**: Use wikilinks for all internal document references (e.g., [[Strid och skada]]).
- **Requirements**: Format as "*Krav:* Egenskap X, Förmåga Y".
- **Cost**: Format as "Kostar X Fokus" or "Spendera X Fokus".
- **Duration**: Express as "tills behandlad", "per runda", "under 1T12 rundor".

## Developer/Writer Workflow
- **Editing:** The user uses Obsidian. Ensure links match existing filenames exactly.
- **Publishing:** The website is built with **[Quartz 5](https://quartz.jzhao.xyz/)** (a fork-and-own static site generator vendored under `quartz/`). Published content lives in `content/`; configuration is in `quartz.config.yaml`.
  - Local preview: `npm install` once, then `npx quartz build --serve`. The enabled plugins are **vendored** into the repo (their built `dist/` is committed under `.quartz/plugins/`), so a fresh clone needs no `plugin install`. After adding/removing/enabling/disabling/updating a plugin, run `npm run vendor:plugins` and commit `.quartz/plugins` (see [DEPLOYMENT.md](DEPLOYMENT.md) → "Plugins are vendored").
  - Localization: the community plugins each bundle their own English-only i18n (they have no `sv-SE`), so with `locale: sv-SE` their UI strings would fall back to English. `quartz/cli/patch-plugin-locales.mjs` re-injects the Swedish translations from `quartz/i18n/plugin-sv-SE.mjs` into every plugin's built bundle after each `npx quartz plugin install` (it is wired into the install step and the `install-plugins` script, and re-runs on every install so it survives plugin updates). Because plugins are vendored, this patch is baked into the committed `dist/` and is re-applied automatically whenever you run `npm run vendor:plugins`. Adjust plugin UI wording in `plugin-sv-SE.mjs`; keep it in sync with `quartz/i18n/locales/sv-SE.ts`.
  - Deployment: hosted on **Cloudflare Pages** (project `riket`) via Cloudflare's Git integration. Pushing to `main` triggers a Cloudflare build (just `npx quartz build`, output `public/`) and deploy; the live site is served at **<https://riket.exostra.se>**, a subdomain mapped to the project root (no Worker, no path prefix). The build command is `npx quartz build` alone — **not** `npx quartz plugin install && npx quartz build` — because the plugins are vendored; re-adding the install step is what makes deploys slow. `baseUrl` in `quartz.config.yaml` is `riket.exostra.se` — it must stay path-less, since Quartz injects the `baseUrl` path as `data-basepath` and the client-rendered nav (explorer/search/graph) prepends it to every link. Cloudflare also builds a preview deployment for each pull request, so the repo has no GitHub Actions workflows. See [DEPLOYMENT.md](DEPLOYMENT.md) for the full setup.
  - Custom HTML pages (e.g. the print character sheet) are served from `quartz/static/` and linked like `/static/charsheet/sheet.html`.
  - **Character library:** `/static/charsheet/` is a character library (gallery at `index.html`, editor at `sheet.html`) with two storage backends — this browser (`localStorage`) and an optional cloud vault backed by Cloudflare Pages Functions (`functions/api/`) + a D1 database, with passwordless magic-link login (Resend). Photos are uploaded and stored inline in each character's JSON. The frontend storage layer is `quartz/static/charsheet/store.js`. See [CHARACTER-VAULT.md](CHARACTER-VAULT.md) for the model, API and Cloudflare setup.
- **Styling:** Rely on semantic Markdown. Custom site CSS goes in `quartz/styles/custom.scss`; theme colours/fonts are in `quartz.config.yaml`. (`publish.css`, `regler.css`, `karaktär.css` are now only used by the PDF build, not the website.) Body images default to a smaller, right-aligned float so text wraps beside them; the `|wide` alias (rendered as `alt="wide"`) opts an image back into the full column for maps and diagrams.
