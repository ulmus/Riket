/* Rollpersonsvalvet — server-side character vault for the I Rikets Tjänst sheet.
 *
 * Self-contained add-on: it does not touch the sheet component. It reads/writes
 * the same localStorage slot the sheet uses ('irt-rt1-v1'), and talks to the
 * Cloudflare Pages Functions under /api. Loading a character into the sheet
 * works exactly like Import: write localStorage, then reload.
 *
 * Auth is passwordless (magic link). Saving uses optimistic concurrency: each
 * character carries a version; if the server copy moved on since you loaded it,
 * the save is refused and you must save a renamed copy instead (last-save-wins
 * otherwise). Delete is a soft delete (trash bin) with restore.
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

  // ---- state ---------------------------------------------------------------

  var state = {
    open: false,
    me: null, // {authenticated, email}
    config: null, // {turnstileSiteKey}
    busy: false,
    tab: "mine", // 'mine' | 'trash'
    mine: [],
    trash: [],
    notice: null, // {kind:'ok'|'err', text}
    sent: null, // email a link was just sent to
    conflict: null, // {server:{version,name}, base, suggestName}
  };

  var turnstileWidgetId = null;
  var turnstileToken = "";

  // ---- DOM scaffolding -----------------------------------------------------

  var root, launcher, overlay, modal;

  function injectStyles() {
    var css =
      "#irtv-root{font-family:'Archivo',sans-serif;}" +
      "#irtv-launch{position:fixed;top:12px;right:14px;z-index:2147483000;font:600 11px/1 'Archivo',sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#f3ecdb;background:#0c3a54;border:1px solid #0c3a54;padding:9px 13px;border-radius:3px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35);display:flex;align-items:center;gap:7px;}" +
      "#irtv-launch .dot{width:7px;height:7px;border-radius:50%;background:#7fd18a;display:inline-block;}" +
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
      ".irtv-btn{font:600 12px/1 'Archivo';letter-spacing:.06em;text-transform:uppercase;color:#f3ecdb;background:#0c3a54;border:1px solid #0c3a54;padding:11px 16px;border-radius:3px;cursor:pointer;}" +
      ".irtv-btn.ghost{color:#3a362c;background:transparent;border-color:#9c9683;}" +
      ".irtv-btn.danger{color:#9b2d1f;background:transparent;border-color:#cdb3ad;}" +
      ".irtv-btn:disabled{opacity:.5;cursor:default;}" +
      ".irtv-btn.sm{padding:7px 10px;font-size:11px;}" +
      ".irtv-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}" +
      ".irtv-tabs{display:flex;gap:6px;margin:2px 0 14px;border-bottom:1px solid #c7bea6;}" +
      ".irtv-tab{font:600 11px/1 'Archivo';letter-spacing:.06em;text-transform:uppercase;color:#8a8268;background:transparent;border:0;border-bottom:2px solid transparent;padding:8px 4px 9px;margin-right:10px;cursor:pointer;}" +
      ".irtv-tab.active{color:#0c3a54;border-bottom-color:#0c3a54;}" +
      ".irtv-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;}" +
      ".irtv-item{display:flex;align-items:center;gap:10px;justify-content:space-between;background:#fff;border:1px solid #d8cfb8;border-radius:5px;padding:9px 11px;}" +
      ".irtv-item .nm{font:700 14px/1.15 'Saira Condensed',sans-serif;letter-spacing:.02em;text-transform:uppercase;}" +
      ".irtv-item .su{font:400 10px/1.3 'Courier Prime',monospace;color:#8a8268;margin-top:2px;}" +
      ".irtv-item .open{color:#0c3a54;}" +
      ".irtv-empty{font:400 12px/1.6 'Courier Prime',monospace;color:#8a8268;padding:6px 2px;}" +
      ".irtv-msg{font:400 12px/1.5 'Courier Prime',monospace;border-radius:4px;padding:9px 11px;margin:0 0 14px;}" +
      ".irtv-msg.ok{background:#e3eee4;color:#2c5d34;border:1px solid #b9d6bd;}" +
      ".irtv-msg.err{background:#f3e2df;color:#8a2c1f;border:1px solid #ddb9b2;}" +
      ".irtv-me{display:flex;align-items:center;justify-content:space-between;gap:10px;font:400 11px/1.4 'Courier Prime',monospace;color:#8a8268;margin:0 0 14px;}" +
      "#irtv-turnstile{margin:0 0 14px;min-height:0;}" +
      ".irtv-foot{font:400 10px/1.5 'Courier Prime',monospace;color:#9b937f;margin-top:14px;}" +
      "@media print{#irtv-root{display:none !important;}}";
    var style = document.createElement("style");
    style.id = "irtv-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function build() {
    root = document.createElement("div");
    root.id = "irtv-root";

    launcher = document.createElement("button");
    launcher.id = "irtv-launch";
    launcher.type = "button";
    launcher.addEventListener("click", openModal);

    overlay = document.createElement("div");
    overlay.id = "irtv-overlay";
    overlay.style.display = "none";
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    modal = document.createElement("div");
    modal.id = "irtv-modal";
    overlay.appendChild(modal);

    root.appendChild(launcher);
    root.appendChild(overlay);
    document.body.appendChild(root);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.open) closeModal();
    });
  }

  // ---- rendering -----------------------------------------------------------

  function renderLauncher() {
    var linked = getLink();
    var loggedIn = state.me && state.me.authenticated;
    launcher.innerHTML =
      (loggedIn && linked ? '<span class="dot" title="Öppen rollperson är kopplad till valvet"></span>' : "") +
      "<span>Valv</span>";
  }

  function noticeHtml() {
    if (!state.notice) return "";
    return '<div class="irtv-msg ' + state.notice.kind + '">' + esc(state.notice.text) + "</div>";
  }

  function render() {
    renderLauncher();
    if (!state.open) return;

    var loggedIn = state.me && state.me.authenticated;
    var body;
    if (!state.me) {
      body = '<div class="bd"><p>Laddar…</p></div>';
    } else if (state.conflict) {
      body = renderConflict();
    } else if (loggedIn) {
      body = renderVault();
    } else {
      body = renderLogin();
    }

    modal.innerHTML =
      '<div class="hd"><h2>Rollpersonsvalvet</h2><button class="x" type="button" aria-label="Stäng">&times;</button></div>' +
      body;

    modal.querySelector(".x").addEventListener("click", closeModal);
    wire();
    if (!loggedIn && !state.conflict) mountTurnstile();
  }

  function renderLogin() {
    if (state.sent) {
      return (
        '<div class="bd">' +
        noticeHtml() +
        "<p>En inloggningslänk har skickats till <strong>" +
        esc(state.sent) +
        "</strong>. Öppna den i samma webbläsare. Länken gäller i 15&nbsp;minuter.</p>" +
        '<div class="irtv-row"><button class="irtv-btn ghost" data-act="login-again" type="button">Skicka till en annan adress</button></div>' +
        "</div>"
      );
    }
    return (
      '<div class="bd">' +
      noticeHtml() +
      "<p>Spara dina rollpersoner i molnet och kom åt dem från vilken enhet som helst. Ange din e-post så skickar vi en inloggningslänk — inget lösenord behövs.</p>" +
      '<label for="irtv-email">E-post</label>' +
      '<input id="irtv-email" type="email" autocomplete="email" placeholder="namn@exempel.se" />' +
      '<div id="irtv-turnstile"></div>' +
      '<div class="irtv-row" style="margin-top:14px;"><button class="irtv-btn" data-act="send" type="button">Skicka inloggningslänk</button></div>' +
      '<p class="irtv-foot">Rollformuläret fungerar precis som vanligt utan inloggning — valvet är ett tillval för att spara fler rollpersoner på servern.</p>' +
      "</div>"
    );
  }

  function renderVault() {
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
                ? "Sparad " + esc(fmtDate(c.updated_at)) + (isOpen ? ' · <span class="open">öppen i formuläret</span>' : "")
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
              '<li class="irtv-item"><div><div class="nm">' +
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
        ? '<div class="irtv-row" style="margin-bottom:16px;">' +
          '<button class="irtv-btn" data-act="save" type="button">Spara nuvarande i valvet</button>' +
          '<button class="irtv-btn ghost" data-act="saveas" type="button">Spara som ny…</button>' +
          "</div>"
        : '<p class="irtv-foot" style="margin-top:0;margin-bottom:14px;">Borttagna rollpersoner ligger kvar i ' +
          "30 dagar och raderas sedan permanent.</p>";

    return (
      '<div class="bd">' +
      '<div class="irtv-me"><span>Inloggad som <strong>' +
      esc(state.me.email) +
      '</strong></span><button class="irtv-btn ghost sm" data-act="logout" type="button">Logga ut</button></div>' +
      noticeHtml() +
      '<div class="irtv-tabs">' +
      '<button class="irtv-tab ' +
      (state.tab === "mine" ? "active" : "") +
      '" data-act="tab" data-tab="mine" type="button">Mina rollpersoner</button>' +
      '<button class="irtv-tab ' +
      (state.tab === "trash" ? "active" : "") +
      '" data-act="tab" data-tab="trash" type="button">Papperskorg</button>' +
      "</div>" +
      saveBar +
      rows +
      "</div>"
    );
  }

  function renderConflict() {
    var c = state.conflict;
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
      '<button class="irtv-btn ghost" data-act="cancel-conflict" type="button">Avbryt</button>' +
      "</div></div>"
    );
  }

  // ---- event wiring --------------------------------------------------------

  function wire() {
    modal.querySelectorAll("[data-act]").forEach(function (b) {
      b.addEventListener("click", onAction);
    });
    var email = modal.querySelector("#irtv-email");
    if (email) {
      email.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          sendLink();
        }
      });
      email.focus();
    }
  }

  function onAction(e) {
    var act = e.currentTarget.getAttribute("data-act");
    var id = e.currentTarget.getAttribute("data-id");
    if (act === "send") return sendLink();
    if (act === "login-again") {
      state.sent = null;
      state.notice = null;
      return render();
    }
    if (act === "logout") return logout();
    if (act === "tab") {
      state.tab = e.currentTarget.getAttribute("data-tab");
      state.notice = null;
      render();
      if (state.tab === "trash") refreshTrash();
      return;
    }
    if (act === "save") return saveCurrent(false);
    if (act === "saveas") return saveCurrent(true);
    if (act === "open") return openCharacter(id);
    if (act === "delete") return deleteCharacter(id);
    if (act === "restore") return restoreCharacter(id);
    if (act === "save-as-new") return confirmSaveAsNew();
    if (act === "cancel-conflict") {
      state.conflict = null;
      return render();
    }
  }

  // ---- auth actions --------------------------------------------------------

  function sendLink() {
    var input = modal.querySelector("#irtv-email");
    if (!input) return;
    var email = input.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      state.notice = { kind: "err", text: "Ange en giltig e-postadress." };
      return render();
    }
    if (state.config && state.config.turnstileSiteKey && !turnstileToken) {
      state.notice = { kind: "err", text: "Bekräfta robotkontrollen först." };
      return render();
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
          state.notice = null;
        } else {
          state.notice = { kind: "err", text: (r.data && r.data.error) || "Något gick fel. Försök igen." };
        }
        render();
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
      state.notice = { kind: "ok", text: "Du är utloggad." };
      render();
    });
  }

  // ---- character actions ---------------------------------------------------

  function refreshMine() {
    return api("/characters").then(function (r) {
      if (r.ok) state.mine = (r.data && r.data.characters) || [];
      render();
    });
  }

  function refreshTrash() {
    return api("/trash").then(function (r) {
      if (r.ok) state.trash = (r.data && r.data.characters) || [];
      render();
    });
  }

  // save current sheet: update the linked character, or create a new one.
  function saveCurrent(forceNew) {
    var data = readSheet();
    if (!sheetHasContent(data)) {
      state.notice = { kind: "err", text: "Formuläret är tomt — fyll i något innan du sparar." };
      return render();
    }
    var name = sheetName(data);
    var link = getLink();

    if (forceNew || !link || !link.id) {
      return createCharacter(name, data);
    }

    // Update the linked character with optimistic concurrency.
    api("/characters/" + encodeURIComponent(link.id), {
      method: "PUT",
      body: { name: name, data: data, version: link.version },
    }).then(function (r) {
      if (r.ok) {
        setLink({ id: link.id, name: r.data.name, version: r.data.version });
        state.notice = { kind: "ok", text: "Sparad: «" + r.data.name + "» (version " + r.data.version + ")." };
        refreshMine();
      } else if (r.status === 409) {
        // Server moved on since we loaded — force a renamed copy.
        state.conflict = {
          server: { version: r.data.serverVersion, name: r.data.serverName },
          suggestName: name + " (kopia)",
        };
        render();
      } else if (r.status === 404) {
        // The linked character is gone (deleted elsewhere) — save as new.
        clearLink();
        createCharacter(name, data, "Den kopplade rollpersonen fanns inte kvar, så en ny skapades.");
      } else {
        state.notice = { kind: "err", text: (r.data && r.data.error) || "Kunde inte spara." };
        render();
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
      } else {
        state.notice = { kind: "err", text: (r.data && r.data.error) || "Kunde inte spara." };
        render();
      }
    });
  }

  function confirmSaveAsNew() {
    var input = modal.querySelector("#irtv-newname");
    var name = input ? input.value.trim() : "";
    if (!name) {
      state.notice = { kind: "err", text: "Ge den nya rollpersonen ett namn." };
      return render();
    }
    var data = readSheet();
    state.conflict = null;
    createCharacter(name, data);
  }

  function openCharacter(id) {
    var current = readSheet();
    var link = getLink();
    if (link && link.id === id) {
      // already open — just reload from server to be safe? keep it simple.
    }
    if (sheetHasContent(current) && (!link || link.id !== id)) {
      if (!confirm("Detta ersätter blanketten i den här webbläsaren med den valda rollpersonen. Fortsätta?")) return;
    }
    api("/characters/" + encodeURIComponent(id)).then(function (r) {
      if (r.ok) {
        loadIntoSheet(r.data.id, r.data.name, r.data.version, r.data.data);
      } else {
        state.notice = { kind: "err", text: (r.data && r.data.error) || "Kunde inte öppna rollpersonen." };
        render();
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
      } else {
        state.notice = { kind: "err", text: (r.data && r.data.error) || "Kunde inte ta bort." };
        render();
      }
    });
  }

  function restoreCharacter(id) {
    api("/characters/" + encodeURIComponent(id) + "/restore", { method: "POST" }).then(function (r) {
      if (r.ok) {
        state.notice = { kind: "ok", text: "Återställd." };
        refreshTrash();
        refreshMine();
      } else {
        state.notice = { kind: "err", text: (r.data && r.data.error) || "Kunde inte återställa." };
        render();
      }
    });
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
    turnstileWidgetId = null; // previous widget's DOM was replaced by render()
    turnstileToken = "";
    ensureTurnstileScript(function () {
      if (!window.turnstile) return;
      try {
        turnstileWidgetId = window.turnstile.render(container, {
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

  // ---- open/close + boot ---------------------------------------------------

  function openModal() {
    state.open = true;
    overlay.style.display = "flex";
    render();
    // Refresh data when opening.
    if (state.me && state.me.authenticated) {
      refreshMine();
      if (state.tab === "trash") refreshTrash();
    }
  }

  function closeModal() {
    state.open = false;
    state.notice = null;
    state.conflict = null;
    state.sent = null;
    overlay.style.display = "none";
  }

  // Handle the ?login=<status> the magic-link callback redirects back with.
  function handleLoginRedirect() {
    var params = new URLSearchParams(location.search);
    var login = params.get("login");
    if (!login) return false;
    // Strip the param so a refresh doesn't re-trigger it (keep any others).
    params.delete("login");
    var qs = params.toString();
    try {
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
    } catch (e) {}
    if (login === "ok") {
      state.notice = { kind: "ok", text: "Inloggad." };
    } else if (login === "expired") {
      state.notice = { kind: "err", text: "Inloggningslänken har gått ut eller redan använts. Begär en ny." };
    } else if (login === "config") {
      state.notice = { kind: "err", text: "Inloggning är inte konfigurerad på servern än." };
    } else {
      state.notice = { kind: "err", text: "Ogiltig inloggningslänk." };
    }
    return true;
  }

  function boot() {
    injectStyles();
    build();
    renderLauncher();

    var wantOpen = handleLoginRedirect();

    // Load public config (Turnstile site key) and current session in parallel.
    Promise.all([
      api("/config").then(function (r) {
        state.config = (r.ok && r.data) || {};
      }),
      api("/auth/me").then(function (r) {
        state.me = (r.ok && r.data) || { authenticated: false };
      }),
    ]).then(function () {
      renderLauncher();
      if (wantOpen || (state.me && state.me.authenticated && getLink())) {
        // Auto-open after a login redirect; otherwise stay out of the way.
        if (wantOpen) openModal();
      }
      if (state.open) render();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
