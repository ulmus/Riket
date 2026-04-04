/**
 * I Rikets Tjänst - Foundry VTT System Module
 * A tactical Cold War superhero RPG.
 */

import { IRTActorSheet } from "./module/actor/actor-sheet.mjs";
import { calcAllDerived, calcSkadeniva } from "./module/helpers/derived-stats.mjs";
import { registerChatListeners } from "./module/dice/irt-roll.mjs";

/* ---- Hooks ---- */

Hooks.once("init", () => {
  console.log("I Rikets Tjänst | Initializing system");

  CONFIG.IRT = {
    attributeKeys: ["analys", "fysik", "list", "samspel", "sinnen", "smidighet", "strid", "vilja"],
    damageTypes: ["kross", "stick", "hugg", "eld", "skjutvapen", "explosion", "gift", "blodning", "stralning", "ovriga"],
  };

  // Register Actor sheet
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("i-rikets-tjanst", IRTActorSheet, {
    types: ["character"],
    makeDefault: true,
    label: "IRT.SheetLabel",
  });

  // Register Handlebars helpers
  _registerHelpers();

  // Initiative formula
  CONFIG.Combat.initiative = {
    formula: "1d12 + @attributes.strid",
    decimals: 0,
  };
});

Hooks.once("ready", () => {
  console.log("I Rikets Tjänst | System ready");
  registerChatListeners();
});

/**
 * Prepare derived data for actors.
 */
Hooks.on("preUpdateActor", (actor, changes) => {
  // Auto-compute derived stats when attributes change
  if (changes?.system?.attributes) {
    const attrs = foundry.utils.mergeObject(
      foundry.utils.deepClone(actor.system.attributes),
      changes.system.attributes
    );
    const derived = calcAllDerived(attrs);
    foundry.utils.setProperty(changes, "system.derived", derived);
    foundry.utils.setProperty(changes, "system.kp.max", derived.kpMax);
  }

  // Auto-compute skadeniva when KP or attributes change
  if (changes?.system?.kp?.value !== undefined || changes?.system?.attributes) {
    const kpValue = changes?.system?.kp?.value ?? actor.system.kp.value;
    const talighet = changes?.system?.derived?.talighet ?? actor.system.derived.talighet;
    foundry.utils.setProperty(changes, "system.skadeniva", calcSkadeniva(kpValue, talighet));
  }
});

/**
 * Calculate derived stats on actor data preparation.
 */
Hooks.on("prepareData", (document) => {
  if (!(document instanceof Actor)) return;
  if (document.type !== "character") return;

  const system = document.system;
  const derived = calcAllDerived(system.attributes);

  system.derived.talighet = derived.talighet;
  system.derived.stabilitet = derived.stabilitet;
  system.derived.forflyttning = derived.forflyttning;
  system.derived.slagstyrka = derived.slagstyrka;
  system.kp.max = derived.kpMax;
  system.skadeniva = calcSkadeniva(system.kp.value, derived.talighet);
});

/* ---- Handlebars helpers ---- */

function _registerHelpers() {
  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("gt", (a, b) => a > b);
  Handlebars.registerHelper("concat", (...args) => {
    // Last argument is the Handlebars options hash - exclude it
    args.pop();
    return args.join("");
  });
  Handlebars.registerHelper("irt-capitalize", (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  });
}
