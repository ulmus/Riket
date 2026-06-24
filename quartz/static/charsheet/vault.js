/* Rollpersonsvalvet — server-side character vault for the I Rikets Tjänst sheet.
 *
 * Two surfaces:
 *  - A modal dialog, used only for logging in / creating an account (magic link)
 *    and for the "save as new" version-conflict prompt.
 *  - An inline panel that is always shown once logged in. It lives in the
 *    #irtv-panel-slot the sheet renders in its controls column, and holds the
 *    everyday actions (save to vault, open, delete, trash/restore, log out) so
 *    they're available at all times without opening a dialog.
 *
 * The sheet is rendered by React (dc-runtime), which reconciles its own DOM on
 * every change. To avoid React stranding our panel, vault.js owns a panel
 * element and re-attaches it into the (otherwise empty) slot via a
 * MutationObserver — React never has children for the slot in its vdom, so it
 * leaves our node alone between re-mounts.
 *
 * It reads/writes the same localStorage slot the sheet uses ('irt-rt1-v1');
 * opening a vault character writes that slot and reloads, mirroring Import.
 * Saving uses optimistic concurrency (version): if the server copy moved on,
 * the save is refused and you must save a renamed copy (last-save-wins
 * otherwise). Delete is a soft delete (trash) with restore.
 */
(function () {
  "use strict";

  var SHEET_KEY = "irt-rt1-v1"; // the sheet's autosave slot (do not change)
  var LINK_KEY = "irt-vault-current"; // {id, version, name} of the open vault character

  // ---- tiny helpers --------------------------------------------------------

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function api(path, opts) {
    opts = opts || {};
    var init = { method: opts.method || "GET", credentials: "same-origin", headers: {} };
    if (opts.body !== undefined) {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(opts.body);
    }
    return fetch("/api" + path, init).then(function (res) {
      return res
        .json()
        .catch(function () {
          return {};
        })
        .then(function (data) {
          return { status: res.status, ok: res.ok, data: data };
        });
    });
  }

  function readSheet() {
    try {
      return JSON.parse(localStorage.getItem(SHEET_KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  function sheetHasContent(d) {
    if (!d || typeof d !== "object") return false;
    var f = d.fields || {};
    if (f.kodnamn || f.namn) return true;
    var a = d.attr || {};
    return Object.keys(a).some(function (k) {
      return (a[k] || 0) > 0;
    });
  }

  function sheetName(d) {
    var f = (d && d.fields) || {};
    return String(f.kodnamn || f.namn || "").trim() || "Namnlös rollperson";
  }

  function getLink() {
    try {
      return JSON.parse(localStorage.getItem(LINK_KEY) || "null");
    } catch (e) {
      return null;
    }
  }
  function setLink(obj) {
    try {
      localStorage.setItem(LINK_KEY, JSON.stringify(obj));
    } catch (e) {}
  }
  function clearLink() {
    try {
      localStorage.removeItem(LINK_KEY);
    } catch (e) {}
  }

  // Load a server character into the sheet (same mechanism as Import).
  function loadIntoSheet(id, name, version, data) {
    try {
      localStorage.setItem(SHEET_KEY, JSON.stringify(data));
    } catch (e) {
      alert("Kunde inte spara rollpersonen lokalt (lagringen kan vara full).");
      return;
    }
    setLink({ id: id, name: name, version: version });
    window.location.assign("sheet.html");
  }

  function fmtDate(sec) {
    if (!sec) return "";
    try {
      return new Date(sec * 1000).toLocaleString("sv-SE", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "";
    }
  }

  function noticeHtml(n) {
    return n ? '<div class="irtv-msg ' + n.kind + '">' + esc(n.text) + "</div>" : "";
  }

  // ---- state ---------------------------------------------------------------

  var state = {
    me: null, // {authenticated, email}
    config: null, // {turnstileSiteKey}
    modalOpen: false,
    modalView: "login", // 'login' | 'conflict'
    modalNotice: null,
    sent: null, // email a link was just sent to
    conflict: null, // {server:{version,name}, suggestName}
    panelCollapsed: false,
    tab: "mine", // 'mine' | 'trash'
    mine: [],
    trash: [],
    notice: null, // panel notice
    pendingOpenLogin: false,
  };

  var turnstileWidgetId = null;
  var turnstileToken = "";

  // ---- DOM -----------------------------------------------------------------

  var root, overlay, modal, panelEl;

  function injectStyles() {
    var css =
      "#irtv-root{font-family:'Archivo',sans-serif;}" +
      "#irtv-overlay{position:fixed;inset:0;z-index:2147483001;background:rgba(20,19,16,.66);display:flex;align-items:flex-start;justify-content:center;padding:34px 14px;overflow:auto;}" +
      "#irtv-modal{width:520px;max-width:100%;background:#f5f1e6;color:#23201a;border:1px solid #c7bea6;border-radius:8px;box-shadow:0 24px 60px rgba(0,0,0,.5);overflow:hidden;}" +
      "#irtv-modal .hd{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px 18px;background:#dcd1b8;border-bottom:1px solid #c7bea6;}" +
      "#irtv-modal .hd h2{margin:0;font:800 17px/1 'Saira Condensed',sans-serif;letter-spacing:.1em;text-transform:uppercase;}" +
      "#irtv-modal .x{background:transparent;border:0;font-size:22px;line-height:1;color:#5a574d;cursor:pointer;padding:2px 6px;}" +
      "#irtv-modal .bd{padding:18px;}" +
      "#irtv-modal p{margin:0 0 12px;font:400 13px/1.6 'Courier Prime',monospace;}" +
      "#irtv-modal label{display:block;font:600 10px/1.4 'Archivo';letter-spacing:.08em;text-transform:uppercase;color:#8a8268;margin:0 0 5px;}" +
      "#irtv-modal input[type=email],#irtv-modal input[type=text]{width:100%;font:400 14px/1.4 'Courier Prime',monospace;color:#23201a;background:#fff;border:1px solid #c7bea6;border-radius:3px;padding:9px 10px;outline:0;}" +
      "#irtv-modal input:focus{border-color:#0c3a54;}" +
      // Inline panel (always shown when logged in), lives in the controls column.
      "#irtv-panel-slot{width:100%;}" +
      ".irtv-card{width:100%;background:#f5f1e6;color:#23201a;border:1px solid #c7bea6;border-radius:8px;overflow:hidden;box-shadow:0 8px 22px rgba(0,0,0,.28);}" +
      ".irtv-card .hd{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 13px;background:#dcd1b8;border-bottom:1px solid #c7bea6;cursor:pointer;user-select:none;}" +
      ".irtv-card.collapsed .hd{border-bottom:0;}" +
      ".irtv-card .hd h2{margin:0;font:800 14px/1 'Saira Condensed',sans-serif;letter-spacing:.1em;text-transform:uppercase;}" +
      ".irtv-card .hd .chev{font:600 10px/1 'Archivo';letter-spacing:.06em;text-transform:uppercase;color:#5a574d;}" +
      ".irtv-card .bd{padding:13px;}" +
      // Shared bits used by both modal and panel.
      ".irtv-btn{font:600 12px/1 'Archivo';letter-spacing:.06em;text-transform:uppercase;color:#f3ecdb;background:#0c3a54;border:1px solid #0c3a54;padding:11px 14px;border-radius:3px;cursor:pointer;}" +
      ".irtv-btn.ghost{color:#3a362c;background:transparent;border-color:#9c9683;}" +
      ".irtv-btn.danger{color:#9b2d1f;background:transparent;border-color:#cdb3ad;}" +
      ".irtv-btn:disabled{opacity:.5;cursor:default;}" +
      ".irtv-btn.sm{padding:7px 9px;font-size:11px;}" +
      ".irtv-btn.block{width:100%;}" +
      ".irtv-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}" +
      ".irtv-tabs{display:flex;gap:6px;margin:2px 0 12px;border-bottom:1px solid #c7bea6;}" +
      ".irtv-tab{font:600 11px/1 'Archivo';letter-spacing:.06em;text-transform:uppercase;color:#8a8268;background:transparent;border:0;border-bottom:2px solid transparent;padding:7px 4px 8px;margin-right:10px;cursor:pointer;}" +
      ".irtv-tab.active{color:#0c3a54;border-bottom-color:#0c3a54;}" +
      ".irtv-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;}" +
      ".irtv-item{display:flex;align-items:center;gap:10px;justify-content:space-between;flex-wrap:wrap;background:#fff;border:1px solid #d8cfb8;border-radius:5px;padding:8px 10px;}" +
      ".irtv-item .nm{font:700 14px/1.15 'Saira Condensed',sans-serif;letter-spacing:.02em;text-transform:uppercase;}" +
      ".irtv-item .su{font:400 10px/1.3 'Courier Prime',monospace;color:#8a8268;margin-top:2px;}" +
      ".irtv-item .open{color:#0c3a54;}" +
      ".irtv-empty{font:400 12px/1.6 'Courier Prime',monospace;color:#8a8268;padding:6px 2px;}" +
      ".irtv-msg{font:400 12px/1.5 'Courier Prime',monospace;border-radius:4px;padding:9px 11px;margin:0 0 12px;}" +
      ".irtv-msg.ok{background:#e3eee4;color:#2c5d34;border:1px solid #b9d6bd;}" +
      ".irtv-msg.err{background:#f3e2df;color:#8a2c1f;border:1px solid #ddb9b2;}" +
      ".irtv-me{display:flex;align-items:center;justify-content:space-between;gap:10px;font:400 11px/1.4 'Courier Prime',monospace;color:#8a8268;margin:0 0 12px;}" +
      "#irtv-turnstile{margin:0 0 14px;min-height:0;}" +
      ".irtv-foot{font:400 10px/1.5 'Courier Prime',monospace;color:#9b937f;margin-top:12px;}" +
      "@media (max-width:560px){#irtv-overlay{padding:14px 8px;}#irtv-modal{border-radius:6px;}#irtv-modal .bd{padding:14px;}}" +
      "@media print{#irtv-root{display:none !important;}}";
    var style = document.createElement("style");
    style.id = "irtv-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---- modal (login / conflict) -------------------------------------------

  function buildModal() {
    root = document.createElement("div");
    root.id = "irtv-root";

    overlay = document.createElement("div");
    overlay.id = "irtv-overlay";
    overlay.style.display = "none";
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    modal = document.createElement("div");
    modal.id = "irtv-modal";
    modal.addEventListener("click", function (e) {
      var t = e.target.closest && e.target.closest("[data-act]");
      if (t && modal.contains(t)) onModalAction(t.getAttribute("data-act"));
    });
    modal.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target && e.target.id === "irtv-email") {
        e.preventDefault();
        sendLink();
      }
    });

    overlay.appendChild(modal);
    root.appendChild(overlay);
    document.body.appendChild(root);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.modalOpen) closeModal();
    });
  }

  function renderModal() {
    if (!state.modalOpen) {
      overlay.style.display = "none";
      return;
    }
    overlay.style.display = "flex";
    var title = state.modalView === "conflict" ? "Spara som ny" : "Logga in i valvet";
    modal.innerHTML =
      '<div class="hd"><h2>' +
      title +
      '</h2><button class="x" type="button" data-act="close" aria-label="Stäng">&times;</button></div>' +
      (state.modalView === "conflict" ? renderConflict() : renderLogin());
    if (state.modalView === "login" && !state.sent) mountTurnstile();
    var focusEl = modal.querySelector("#irtv-email") || modal.querySelector("#irtv-newname");
    if (focusEl) focusEl.focus();
  }

  function renderLogin() {
    if (state.sent) {
      return (
        '<div class="bd">' +
        noticeHtml(state.modalNotice) +
        "<p>En inloggningslänk har skickats till <strong>" +
        esc(state.sent) +
        "</strong>. Öppna den i samma webbläsare. Länken gäller i 15&nbsp;minuter.</p>" +
        '<div class="irtv-row"><button class="irtv-btn ghost" data-act="login-again" type="button">Skicka till en annan adress</button></div>' +
        "</div>"
      );
    }
    return (
      '<div class="bd">' +
      noticeHtml(state.modalNotice) +
      "<p>Spara dina rollpersoner i molnet och kom åt dem från vilken enhet som helst. Ange din e-post så skickar vi en inloggningslänk — inget lösenord behövs.</p>" +
      '<label for="irtv-email">E-post</label>' +
      '<input id="irtv-email" type="email" autocomplete="email" placeholder="namn@exempel.se" />' +
      '<div id="irtv-turnstile"></div>' +
      '<div class="irtv-row" style="margin-top:14px;"><button class="irtv-btn" data-act="send" type="button">Skicka inloggningslänk</button></div>' +
      '<p class="irtv-foot">Rollformuläret fungerar precis som vanligt utan inloggning — valvet är ett tillval för att spara fler rollpersoner på servern.</p>' +
      "</div>"
    );
  }

  function renderConflict() {
    var c = state.conflict || { server: {}, suggestName: "" };
    return (
      '<div class="bd">' +
      '<div class="irtv-msg err">Den här rollpersonen har ändrats på servern (version ' +
      esc(c.server.version) +
      ") sedan du öppnade den. För att inte skriva över den sparar du din som en <strong>ny</strong> rollperson.</div>" +
      '<label for="irtv-newname">Namn på den nya rollpersonen</label>' +
      '<input id="irtv-newname" type="text" value="' +
      esc(c.suggestName) +
      '" />' +
      '<div class="irtv-row" style="margin-top:14px;">' +
      '<button class="irtv-btn" data-act="save-as-new" type="button">Spara som ny</button>' +
      '<button class="irtv-btn ghost" data-act="close" type="button">Avbryt</button>' +
      "</div></div>"
    );
  }

  function onModalAction(act) {
    if (act === "close") return closeModal();
    if (act === "send") return sendLink();
    if (act === "login-again") {
      state.sent = null;
      state.modalNotice = null;
      return renderModal();
    }
    if (act === "save-as-new") return confirmSaveAsNew();
  }

  function openLoginModal() {
    state.modalOpen = true;
    state.modalView = "login";
    renderModal();
  }
  function openConflictModal(server, suggestName) {
    state.modalOpen = true;
    state.modalView = "conflict";
    state.conflict = { server: server, suggestName: suggestName };
    renderModal();
  }
  function closeModal() {
    state.modalOpen = false;
    state.modalNotice = null;
    state.sent = null;
    state.conflict = null;
    renderModal();
  }

  // ---- inline panel (logged-in vault) -------------------------------------

  function buildPanel() {
    panelEl = document.createElement("div");
    panelEl.id = "irtv-panel";
    panelEl.style.width = "100%";
    panelEl.addEventListener("click", function (e) {
      var t = e.target.closest && e.target.closest("[data-act]");
      if (t && panelEl.contains(t)) onPanelAction(t.getAttribute("data-act"), t.getAttribute("data-id"));
    });

    // Keep the panel attached to the (React-managed, otherwise-empty) slot.
    var obs = new MutationObserver(ensurePanelMounted);
    obs.observe(document.body, { childList: true, subtree: true });
    ensurePanelMounted();
  }

  function ensurePanelMounted() {
    var slot = document.getElementById("irtv-panel-slot");
    if (slot && panelEl && panelEl.parentNode !== slot) {
      slot.appendChild(panelEl);
      renderPanel();
    }
  }

  function renderPanel() {
    if (!panelEl) return;
    var loggedIn = state.me && state.me.authenticated;
    if (!loggedIn) {
      panelEl.style.display = "none";
      panelEl.innerHTML = "";
      return;
    }
    panelEl.style.display = "";

    if (state.panelCollapsed) {
      panelEl.innerHTML =
        '<div class="irtv-card collapsed"><div class="hd" data-act="toggle"><h2>Valvet</h2><span class="chev">visa ▸</span></div></div>';
      return;
    }

    var linked = getLink();
    var list = state.tab === "mine" ? state.mine : state.trash;
    var rows;
    if (!list.length) {
      rows =
        '<div class="irtv-empty">' +
        (state.tab === "mine"
          ? "Inga sparade rollpersoner än. Fyll i formuläret och klicka «Spara nuvarande i valvet»."
          : "Papperskorgen är tom.") +
        "</div>";
    } else {
      rows =
        '<ul class="irtv-list">' +
        list
          .map(function (c) {
            var isOpen = linked && linked.id === c.id;
            var sub =
              state.tab === "mine"
                ? "Sparad " + esc(fmtDate(c.updated_at)) + (isOpen ? ' · <span class="open">öppen</span>' : "")
                : "Borttagen " + esc(fmtDate(c.deleted_at));
            var actions =
              state.tab === "mine"
                ? '<button class="irtv-btn sm" data-act="open" data-id="' +
                  esc(c.id) +
                  '" type="button">Öppna</button>' +
                  '<button class="irtv-btn sm danger" data-act="delete" data-id="' +
                  esc(c.id) +
                  '" type="button">Ta bort</button>'
                : '<button class="irtv-btn sm" data-act="restore" data-id="' +
                  esc(c.id) +
                  '" type="button">Återställ</button>';
            return (
              '<li class="irtv-item"><div style="min-width:0;"><div class="nm">' +
              esc(c.name) +
              '</div><div class="su">' +
              sub +
              '</div></div><div class="irtv-row">' +
              actions +
              "</div></li>"
            );
          })
          .join("") +
        "</ul>";
    }

    var saveBar =
      state.tab === "mine"
        ? '<div class="irtv-row" style="margin-bottom:14px;">' +
          '<button class="irtv-btn block" data-act="save" type="button">Spara nuvarande i valvet</button>' +
          '<button class="irtv-btn ghost block" data-act="saveas" type="button">Spara som ny…</button>' +
          "</div>"
        : '<p class="irtv-foot" style="margin-top:0;margin-bottom:12px;">Borttagna rollpersoner ligger kvar i 30 dagar och raderas sedan permanent.</p>';

    panelEl.innerHTML =
      '<div class="irtv-card">' +
      '<div class="hd" data-act="toggle"><h2>Valvet</h2><span class="chev">dölj ▾</span></div>' +
      '<div class="bd">' +
      '<div class="irtv-me"><span>Inloggad som <strong>' +
      esc(state.me.email) +
      '</strong></span><button class="irtv-btn ghost sm" data-act="logout" type="button">Logga ut</button></div>' +
      noticeHtml(state.notice) +
      '<div class="irtv-tabs">' +
      '<button class="irtv-tab ' +
      (state.tab === "mine" ? "active" : "") +
      '" data-act="tab-mine" type="button">Mina rollpersoner</button>' +
      '<button class="irtv-tab ' +
      (state.tab === "trash" ? "active" : "") +
      '" data-act="tab-trash" type="button">Papperskorg</button>' +
      "</div>" +
      saveBar +
      rows +
      "</div></div>";
  }

  function onPanelAction(act, id) {
    if (act === "toggle") {
      state.panelCollapsed = !state.panelCollapsed;
      state.notice = null;
      renderPanel();
      if (!state.panelCollapsed) refreshMine();
      return;
    }
    if (act === "logout") return logout();
    if (act === "tab-mine") {
      state.tab = "mine";
      state.notice = null;
      renderPanel();
      return refreshMine();
    }
    if (act === "tab-trash") {
      state.tab = "trash";
      state.notice = null;
      renderPanel();
      return refreshTrash();
    }
    if (act === "save") return saveCurrent(false);
    if (act === "saveas") return saveCurrent(true);
    if (act === "open") return openCharacter(id);
    if (act === "delete") return deleteCharacter(id);
    if (act === "restore") return restoreCharacter(id);
  }

  // ---- auth actions --------------------------------------------------------

  function sendLink() {
    var input = modal.querySelector("#irtv-email");
    if (!input) return;
    var email = input.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      state.modalNotice = { kind: "err", text: "Ange en giltig e-postadress." };
      return renderModal();
    }
    if (state.config && state.config.turnstileSiteKey && !turnstileToken) {
      state.modalNotice = { kind: "err", text: "Bekräfta robotkontrollen först." };
      return renderModal();
    }
    var btn = modal.querySelector('[data-act="send"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Skickar…";
    }
    api("/auth/request-link", { method: "POST", body: { email: email, turnstileToken: turnstileToken } }).then(
      function (r) {
        turnstileToken = "";
        if (r.ok) {
          state.sent = email;
          state.modalNotice = null;
        } else {
          state.modalNotice = { kind: "err", text: (r.data && r.data.error) || "Något gick fel. Försök igen." };
        }
        renderModal();
      },
    );
  }

  function logout() {
    api("/auth/logout", { method: "POST" }).then(function () {
      clearLink();
      state.me = { authenticated: false };
      state.mine = [];
      state.trash = [];
      state.tab = "mine";
      state.notice = null;
      state.panelCollapsed = false;
      renderPanel();
    });
  }

  // ---- character actions ---------------------------------------------------

  function refreshMine() {
    return api("/characters").then(function (r) {
      if (r.ok) state.mine = (r.data && r.data.characters) || [];
      renderPanel();
    });
  }

  function refreshTrash() {
    return api("/trash").then(function (r) {
      if (r.ok) state.trash = (r.data && r.data.characters) || [];
      renderPanel();
    });
  }

  function saveCurrent(forceNew) {
    var data = readSheet();
    if (!sheetHasContent(data)) {
      state.notice = { kind: "err", text: "Formuläret är tomt — fyll i något innan du sparar." };
      return renderPanel();
    }
    var name = sheetName(data);
    var link = getLink();

    if (forceNew || !link || !link.id) {
      return createCharacter(name, data);
    }

    api("/characters/" + encodeURIComponent(link.id), {
      method: "PUT",
      body: { name: name, data: data, version: link.version },
    }).then(function (r) {
      if (r.ok) {
        setLink({ id: link.id, name: r.data.name, version: r.data.version });
        state.notice = { kind: "ok", text: "Sparad: «" + r.data.name + "» (version " + r.data.version + ")." };
        refreshMine();
      } else if (r.status === 409) {
        openConflictModal({ version: r.data.serverVersion, name: r.data.serverName }, name + " (kopia)");
      } else if (r.status === 404) {
        clearLink();
        createCharacter(name, data, "Den kopplade rollpersonen fanns inte kvar, så en ny skapades.");
      } else if (r.status === 401) {
        notLoggedIn();
      } else {
        state.notice = { kind: "err", text: (r.data && r.data.error) || "Kunde inte spara." };
        renderPanel();
      }
    });
  }

  function createCharacter(name, data, extraNote) {
    return api("/characters", { method: "POST", body: { name: name, data: data } }).then(function (r) {
      if (r.ok) {
        setLink({ id: r.data.id, name: r.data.name, version: r.data.version });
        state.notice = {
          kind: "ok",
          text: (extraNote ? extraNote + " " : "") + "Sparad: «" + r.data.name + "».",
        };
        refreshMine();
      } else if (r.status === 401) {
        notLoggedIn();
      } else {
        state.notice = { kind: "err", text: (r.data && r.data.error) || "Kunde inte spara." };
        renderPanel();
      }
    });
  }

  function confirmSaveAsNew() {
    var input = modal.querySelector("#irtv-newname");
    var name = input ? input.value.trim() : "";
    if (!name) {
      state.modalNotice = { kind: "err", text: "Ge den nya rollpersonen ett namn." };
      // conflict view has no notice slot; reuse alert sparingly
      alert("Ge den nya rollpersonen ett namn.");
      return;
    }
    var data = readSheet();
    closeModal();
    createCharacter(name, data);
  }

  function openCharacter(id) {
    var current = readSheet();
    var link = getLink();
    if (sheetHasContent(current) && (!link || link.id !== id)) {
      if (!confirm("Detta ersätter blanketten i den här webbläsaren med den valda rollpersonen. Fortsätta?")) return;
    }
    api("/characters/" + encodeURIComponent(id)).then(function (r) {
      if (r.ok) {
        loadIntoSheet(r.data.id, r.data.name, r.data.version, r.data.data);
      } else if (r.status === 401) {
        notLoggedIn();
      } else {
        state.notice = { kind: "err", text: (r.data && r.data.error) || "Kunde inte öppna rollpersonen." };
        renderPanel();
      }
    });
  }

  function deleteCharacter(id) {
    var item = state.mine.filter(function (c) {
      return c.id === id;
    })[0];
    var label = item ? "«" + item.name + "»" : "rollpersonen";
    if (!confirm("Flytta " + label + " till papperskorgen? Du kan återställa den i 30 dagar.")) return;
    api("/characters/" + encodeURIComponent(id), { method: "DELETE" }).then(function (r) {
      if (r.ok) {
        var link = getLink();
        if (link && link.id === id) clearLink();
        state.notice = { kind: "ok", text: "Flyttad till papperskorgen." };
        refreshMine();
      } else if (r.status === 401) {
        notLoggedIn();
      } else {
        state.notice = { kind: "err", text: (r.data && r.data.error) || "Kunde inte ta bort." };
        renderPanel();
      }
    });
  }

  function restoreCharacter(id) {
    api("/characters/" + encodeURIComponent(id) + "/restore", { method: "POST" }).then(function (r) {
      if (r.ok) {
        state.notice = { kind: "ok", text: "Återställd." };
        refreshTrash();
        refreshMine();
      } else if (r.status === 401) {
        notLoggedIn();
      } else {
        state.notice = { kind: "err", text: (r.data && r.data.error) || "Kunde inte återställa." };
        renderPanel();
      }
    });
  }

  // Session expired mid-action — drop to logged-out and prompt login.
  function notLoggedIn() {
    state.me = { authenticated: false };
    renderPanel();
    state.modalNotice = { kind: "err", text: "Du har loggats ut. Logga in igen." };
    openLoginModal();
  }

  // ---- Turnstile (optional) ------------------------------------------------

  function ensureTurnstileScript(cb) {
    if (window.turnstile) return cb();
    if (window.__irtvTSQueue) {
      window.__irtvTSQueue.push(cb);
      return;
    }
    window.__irtvTSQueue = [cb];
    window.__irtvTurnstileOnload = function () {
      var q = window.__irtvTSQueue || [];
      window.__irtvTSQueue = null;
      q.forEach(function (fn) {
        fn();
      });
    };
    var s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__irtvTurnstileOnload";
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }

  function mountTurnstile() {
    var key = state.config && state.config.turnstileSiteKey;
    var container = modal.querySelector("#irtv-turnstile");
    if (!key || !container) return;
    turnstileWidgetId = null; // previous widget's DOM was replaced by renderModal()
    turnstileToken = "";
    ensureTurnstileScript(function () {
      if (!window.turnstile || !modal.querySelector("#irtv-turnstile")) return;
      try {
        turnstileWidgetId = window.turnstile.render(modal.querySelector("#irtv-turnstile"), {
          sitekey: key,
          theme: "light",
          callback: function (t) {
            turnstileToken = t;
          },
          "expired-callback": function () {
            turnstileToken = "";
          },
          "error-callback": function () {
            turnstileToken = "";
          },
        });
      } catch (e) {}
    });
  }

  // ---- boot ----------------------------------------------------------------

  function handleLoginRedirect() {
    var params = new URLSearchParams(location.search);
    var login = params.get("login");
    if (!login) return;
    params.delete("login");
    var qs = params.toString();
    try {
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
    } catch (e) {}
    if (login === "ok") {
      state.notice = { kind: "ok", text: "Inloggad." };
    } else {
      state.modalNotice = {
        kind: "err",
        text:
          login === "expired"
            ? "Inloggningslänken har gått ut eller redan använts. Begär en ny."
            : login === "config"
              ? "Inloggning är inte konfigurerad på servern än."
              : "Ogiltig inloggningslänk.",
      };
      state.pendingOpenLogin = true;
    }
  }

  function boot() {
    injectStyles();
    buildModal();
    buildPanel();

    handleLoginRedirect();

    // The sheet's "Valv" toolbar button calls this: toggle the inline panel
    // when logged in, otherwise open the login dialog.
    window.IRTVault = { toggle: toggleVault, open: openLoginModal };

    Promise.all([
      api("/config").then(function (r) {
        state.config = (r.ok && r.data) || {};
      }),
      api("/auth/me").then(function (r) {
        state.me = (r.ok && r.data) || { authenticated: false };
      }),
    ]).then(function () {
      renderPanel();
      if (state.pendingOpenLogin) openLoginModal();
      if (state.me && state.me.authenticated) refreshMine();
    });
  }

  function toggleVault() {
    if (!(state.me && state.me.authenticated)) {
      openLoginModal();
      return;
    }
    state.panelCollapsed = !state.panelCollapsed;
    state.notice = null;
    renderPanel();
    if (!state.panelCollapsed) refreshMine();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
