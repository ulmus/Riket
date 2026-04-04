/**
 * I Rikets Tjänst - Character Sheet
 * Shared ActorSheet for PC and NPC characters.
 */

import { attributeRoll } from "../dice/irt-roll.mjs";

export class IRTActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["irt", "sheet", "actor", "character"],
      template: "systems/i-rikets-tjanst/templates/actor/character-sheet.hbs",
      width: 750,
      height: 800,
      scrollY: [".irt-sheet"],
    });
  }

  getData(options) {
    const context = super.getData(options);
    const system = context.actor.system;

    // Attribute list for dropdowns
    context.attributeKeys = [
      "analys", "fysik", "list", "samspel", "sinnen", "smidighet", "strid", "vilja",
    ];

    // Damage types for weapon select
    context.damageTypes = [
      "kross", "stick", "hugg", "eld", "skjutvapen", "explosion", "gift", "blodning", "stralning", "ovriga",
    ];

    // Trauma type options
    context.traumaTypes = ["forlust", "vanmakt", "skuld", "svek", "skam"];

    // Sorted items by type
    context.weapons = context.items.filter((i) => i.type === "weapon");
    context.powers = context.items.filter((i) => i.type === "power");
    context.abilities = context.items.filter((i) => i.type === "ability");

    // Derived stats (also computed in prepareData, but available for template)
    context.derived = system.derived;
    context.system = system;
    context.isNPC = system.isNPC;

    // Damage level flags for template
    context.skadeniva = system.skadeniva;

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    // Attribute roll buttons
    html.find(".irt-attr-roll").on("click", (ev) => this._onAttributeRoll(ev));

    // Custom roll (two-attribute picker)
    html.find(".irt-custom-roll").on("click", (ev) => this._onCustomRoll(ev));

    // Weapon attack roll
    html.find(".irt-weapon-attack").on("click", (ev) => this._onWeaponAttack(ev));

    // Item CRUD
    html.find(".irt-item-create").on("click", (ev) => this._onItemCreate(ev));
    html.find(".irt-item-edit").on("click", (ev) => this._onItemEdit(ev));
    html.find(".irt-item-delete").on("click", (ev) => this._onItemDelete(ev));

    // Inline item editing
    html.find(".irt-item-input").on("change", (ev) => this._onItemInputChange(ev));

    // NPC toggle
    html.find(".irt-npc-toggle").on("change", (ev) => {
      this.actor.update({ "system.isNPC": ev.currentTarget.checked });
    });

    // Collapsible sections
    html.find(".irt-collapse-toggle").on("click", (ev) => {
      const section = ev.currentTarget.closest(".irt-collapsible");
      section.classList.toggle("collapsed");
    });
  }

  async _onAttributeRoll(ev) {
    ev.preventDefault();
    const attr = ev.currentTarget.dataset.attr;
    // Roll attr + attr (same attribute doubled)
    await attributeRoll(this.actor, { attr1: attr, attr2: attr });
  }

  async _onCustomRoll(ev) {
    ev.preventDefault();
    const form = this.element.find(".irt-custom-roll-form")[0];
    const attr1 = form.querySelector('[name="customAttr1"]').value;
    const attr2 = form.querySelector('[name="customAttr2"]').value;
    const modifier = parseInt(form.querySelector('[name="customMod"]').value) || 0;
    await attributeRoll(this.actor, { attr1, attr2, modifier });
  }

  async _onWeaponAttack(ev) {
    ev.preventDefault();
    const itemId = ev.currentTarget.closest(".irt-item-row").dataset.itemId;
    const weapon = this.actor.items.get(itemId);
    if (!weapon) return;
    const attackAttr = weapon.system.attackAttr || "smidighet";
    await attributeRoll(this.actor, {
      attr1: attackAttr,
      attr2: "strid",
      label: `${weapon.name} (${_capitalize(attackAttr)} + Strid)`,
      weapon,
    });
  }

  async _onItemCreate(ev) {
    ev.preventDefault();
    const type = ev.currentTarget.dataset.type;
    const name = `Ny ${type === "weapon" ? "vapen" : type === "power" ? "kraft" : "förmåga"}`;
    await Item.create({ name, type, system: {} }, { parent: this.actor });
  }

  _onItemEdit(ev) {
    ev.preventDefault();
    const itemId = ev.currentTarget.closest(".irt-item-row").dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) item.sheet.render(true);
  }

  async _onItemDelete(ev) {
    ev.preventDefault();
    const itemId = ev.currentTarget.closest(".irt-item-row").dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) await item.delete();
  }

  async _onItemInputChange(ev) {
    const input = ev.currentTarget;
    const itemId = input.closest(".irt-item-row").dataset.itemId;
    const field = input.dataset.field;
    let value = input.type === "number" ? (parseInt(input.value) || 0) : input.value;
    const item = this.actor.items.get(itemId);
    if (item && field) {
      const updateKey = field === "name" ? "name" : `system.${field}`;
      await item.update({ [updateKey]: value });
    }
  }
}

function _capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
