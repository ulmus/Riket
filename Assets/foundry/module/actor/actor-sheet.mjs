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

    // Attribute picker buttons
    html.find(".irt-attr-select").on("click", (ev) => this._onAttrSelect(ev));
    html.find(".irt-attr-clear").on("click", () => this._clearAttrSelection());

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

    // Restore attribute selection state after re-render
    this._updateAttrSelectionUI();
  }

  _onAttrSelect(ev) {
    ev.preventDefault();
    const attr = ev.currentTarget.dataset.attr;

    if (!this._selectedAttr) {
      // First click: select this attribute
      this._selectedAttr = attr;
      this._updateAttrSelectionUI();
    } else {
      // Second click: open roll dialog with attr1 + attr2
      const attr1 = this._selectedAttr;
      const attr2 = attr;
      this._clearAttrSelection();
      this._showRollDialog(attr1, attr2);
    }
  }

  _clearAttrSelection() {
    this._selectedAttr = null;
    this._updateAttrSelectionUI();
  }

  _updateAttrSelectionUI() {
    const html = this.element;
    const selected = this._selectedAttr;

    // Toggle selected class on attribute boxes
    html.find(".irt-attr-box").each((_, el) => {
      el.classList.toggle("irt-attr-box--selected", el.dataset.attr === selected);
    });

    // Toggle clear button visibility
    html.find(".irt-attr-clear").toggleClass("irt-attr-clear--visible", !!selected);
  }

  async _showRollDialog(attr1, attr2) {
    const label1 = _capitalize(attr1);
    const label2 = _capitalize(attr2);
    const content = `
      <form>
        <p style="text-align:center;font-weight:bold;margin:0 0 8px">${label1} + ${label2}</p>
        <div class="form-group">
          <label>Bonus/modifierare</label>
          <input type="number" name="modifier" value="0" />
        </div>
      </form>
    `;

    return new Promise((resolve) => {
      new Dialog({
        title: `Slag: ${label1} + ${label2}`,
        content,
        buttons: {
          roll: {
            icon: '<i class="fas fa-dice"></i>',
            label: "Slå",
            callback: async (html) => {
              const modifier = parseInt(html.find('[name="modifier"]').val()) || 0;
              await attributeRoll(this.actor, { attr1, attr2, modifier });
              resolve(true);
            },
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Avbryt",
            callback: () => resolve(false),
          },
        },
        default: "roll",
      }).render(true);
    });
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
