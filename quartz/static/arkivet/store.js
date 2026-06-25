/* I Rikets Tjänst — character store + library UI.
 *
 * Replaces the old single-slot + vault model with a small character LIBRARY
 * that has two backends:
 *   - local  : "Skrivbordet" — characters kept in this browser's localStorage
 *              (works offline, no login)
 *   - cloud  : "Arkivskåpet" — characters kept in the vault (Cloudflare D1),
 *              available once logged in and reachable from any device
 *
 * The gallery page (index.html) browses the whole library (local + cloud +
 * trash + importable pre-gens). The sheet (personalakt.html) edits ONE character and
 * autosaves back to wherever it came from: local saves are instant; cloud saves
 * are pushed automatically a short moment after you stop typing (last-save-wins,
 * with a rename-to-save prompt if the server copy moved on). Opening a character
 * from one place never touches another.
 *
 * Shared by both pages; it detects which one it's on (#irt-gallery vs the
 * sheet's #irt-sheet-status) and wires itself up accordingly.
 */
(function () {
  "use strict";

  var BUFFER = "irt-rt1-v1"; // the sheet's live edit buffer (the component owns writes)
  var LOCAL = "irt-chars"; // { [id]: {id,name,data,updatedAt} } — local library
  var OPEN = "irt-open"; // { source:'local'|'cloud', id, version?, name } — what the sheet edits

  // Privacy / data-use notice. Shown at the login (consent) point and as a
  // footer on the archive page, so it stays discoverable after you're logged in.
  var PRIVACY_HTML =
    "Dina rollpersoner är dina: de på Skrivbordet lämnar aldrig din webbläsare, och de du lägger i Arkivskåpet läser varken vi eller någon annan — bara du, och de du själv väljer att dela med, kommer åt dem (om vi inte tvingas lämna ut dem av brottsbekämpande myndighet). Din e-postadress används bara för systemutskick och e-post som rör rollspelet I Rikets Tjänst eller den här sidan; den säljs aldrig vidare och används aldrig till något annat.";

  // ---- tiny helpers --------------------------------------------------------

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function uuid() {
    try {
      return crypto.randomUUID();
    } catch (e) {
      return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
    }
  }

  function nowSec() {
    return Math.floor(Date.now() / 1000);
  }

  function lsGet(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v == null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }
  function lsSet(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      return false;
    }
  }

  function api(path, opts) {
    opts = opts || {};
    var init = { method: opts.method || "GET", credentials: "same-origin", headers: {} };
    if (opts.body !== undefined) {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(opts.body);
      if (opts.keepalive) init.keepalive = true;
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

  function readBuffer() {
    return lsGet(BUFFER, {}) || {};
  }
  function writeBuffer(data) {
    lsSet(BUFFER, data || {});
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
  function nameOf(d) {
    var f = (d && d.fields) || {};
    return String(f.kodnamn || f.namn || "").trim() || "Namnlös rollperson";
  }
  function fotoOf(d) {
    var f = (d && d.fields) || {};
    return String(f.foto || "").trim();
  }
  function expertisOf(d) {
    var f = (d && d.fields) || {};
    return String(f.expertis || "").trim();
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

  // ---- local library -------------------------------------------------------

  function localMap() {
    var m = lsGet(LOCAL, {});
    return m && typeof m === "object" && !Array.isArray(m) ? m : {};
  }
  function listLocal() {
    var m = localMap();
    return Object.keys(m)
      .map(function (id) {
        var c = m[id] || {};
        return {
          source: "local",
          id: id,
          name: c.name || nameOf(c.data),
          foto: fotoOf(c.data),
          expertis: expertisOf(c.data),
          updated_at: c.updatedAt || 0,
        };
      })
      .sort(function (a, b) {
        return (b.updated_at || 0) - (a.updated_at || 0);
      });
  }
  function getLocal(id) {
    var c = localMap()[id];
    return c ? { id: id, name: c.name, data: c.data, updatedAt: c.updatedAt } : null;
  }
  function upsertLocal(id, data) {
    var m = localMap();
    m[id] = { id: id, name: nameOf(data), data: data, updatedAt: nowSec() };
    lsSet(LOCAL, m);
  }
  function createLocal(data) {
    var id = uuid();
    upsertLocal(id, data || {});
    return id;
  }
  function deleteLocal(id) {
    var m = localMap();
    delete m[id];
    lsSet(LOCAL, m);
  }

  // ---- open pointer --------------------------------------------------------

  function getOpen() {
    return lsGet(OPEN, null);
  }
  function setOpen(o) {
    lsSet(OPEN, o);
  }
  function clearOpen() {
    try {
      localStorage.removeItem(OPEN);
    } catch (e) {}
  }

  // ---- cloud ---------------------------------------------------------------

  function meGet() {
    return api("/auth/me").then(function (r) {
      return (r.ok && r.data) || { authenticated: false };
    });
  }
  function listCloud() {
    return api("/characters").then(function (r) {
      return r.ok ? (r.data.characters || []).map(tagCloud) : [];
    });
  }
  function listTrash() {
    return api("/trash").then(function (r) {
      return r.ok ? (r.data.characters || []).map(tagCloud) : [];
    });
  }
  function tagCloud(c) {
    c.source = "cloud";
    return c;
  }
  function getCloud(id) {
    return api("/characters/" + encodeURIComponent(id));
  }
  function createCloud(data, name) {
    return api("/characters", { method: "POST", body: { name: name, data: data } });
  }
  function putCloud(id, data, version, keepalive) {
    return api("/characters/" + encodeURIComponent(id), {
      method: "PUT",
      body: { data: data, version: version },
      keepalive: keepalive,
    });
  }
  function deleteCloud(id) {
    return api("/characters/" + encodeURIComponent(id), { method: "DELETE" });
  }
  function restoreCloud(id) {
    return api("/characters/" + encodeURIComponent(id) + "/restore", { method: "POST" });
  }
  function purgeCloudTrash(id) {
    return api("/trash/" + encodeURIComponent(id), { method: "DELETE" });
  }
  function emptyCloudTrash() {
    return api("/trash", { method: "DELETE" });
  }

  // ---- shared state --------------------------------------------------------

  var me = null; // {authenticated, email}
  var config = null; // {turnstileSiteKey}

  // ---- one-time migration of the legacy single slot ------------------------

  function migrate() {
    if (localStorage.getItem(LOCAL) != null) return; // already on the new model
    var chars = {};
    var buf = readBuffer();
    if (sheetHasContent(buf)) {
      var id = uuid();
      chars[id] = { id: id, name: nameOf(buf), data: buf, updatedAt: nowSec() };
      if (!getOpen()) setOpen({ source: "local", id: id, name: nameOf(buf) });
    }
    lsSet(LOCAL, chars);
  }

  // ---- styles --------------------------------------------------------------

  function injectStyles() {
    if (document.getElementById("irt-store-style")) return;
    var css =
      // shared modal (login)
      "#irt-overlay{position:fixed;inset:0;z-index:2147483001;background:rgba(20,19,16,.66);display:flex;align-items:flex-start;justify-content:center;padding:34px 14px;overflow:auto;font-family:'Archivo',sans-serif;}" +
      "#irt-modal{width:480px;max-width:100%;background:#f5f1e6;color:#23201a;border:1px solid #c7bea6;border-radius:8px;box-shadow:0 24px 60px rgba(0,0,0,.5);overflow:hidden;}" +
      "#irt-modal .hd{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px 18px;background:#dcd1b8;border-bottom:1px solid #c7bea6;}" +
      "#irt-modal .hd h2{margin:0;font:800 17px/1 'Saira Condensed',sans-serif;letter-spacing:.1em;text-transform:uppercase;}" +
      "#irt-modal .x{background:transparent;border:0;font-size:22px;line-height:1;color:#5a574d;cursor:pointer;padding:2px 6px;}" +
      "#irt-modal .bd{padding:18px;}" +
      "#irt-modal p{margin:0 0 12px;font:400 13px/1.6 'Courier Prime',monospace;}" +
      "#irt-modal label{display:block;font:600 10px/1.4 'Archivo';letter-spacing:.08em;text-transform:uppercase;color:#8a8268;margin:0 0 5px;}" +
      "#irt-modal input[type=email]{width:100%;font:400 14px/1.4 'Courier Prime',monospace;color:#23201a;background:#fff;border:1px solid #c7bea6;border-radius:3px;padding:9px 10px;outline:0;}" +
      "#irt-modal input:focus{border-color:#0c3a54;}" +
      "#irt-turnstile{margin:0 0 14px;}" +
      // buttons + messages (shared)
      ".irt-btn{font:600 12px/1 'Archivo';letter-spacing:.06em;text-transform:uppercase;color:#f3ecdb;background:#0c3a54;border:1px solid #0c3a54;padding:10px 14px;border-radius:3px;cursor:pointer;text-decoration:none;display:inline-block;}" +
      ".irt-btn.ghost{color:#cabf9f;background:transparent;border-color:#5a574d;}" +
      ".irt-btn.danger{color:#e7b3aa;background:transparent;border-color:#7d4b43;}" +
      ".irt-btn.sm{padding:6px 9px;font-size:11px;}" +
      ".irt-btn:disabled{opacity:.5;cursor:default;}" +
      ".irt-msg{font:400 12px/1.5 'Courier Prime',monospace;border-radius:4px;padding:9px 11px;margin:0 0 12px;}" +
      ".irt-msg.ok{background:#e3eee4;color:#2c5d34;border:1px solid #b9d6bd;}" +
      ".irt-msg.err{background:#f3e2df;color:#8a2c1f;border:1px solid #ddb9b2;}" +
      // gallery
      ".irt-authbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:6px 2px 4px;font:400 11px/1.5 'Courier Prime',monospace;color:#9b937f;}" +
      ".irt-bar{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin:26px 2px 14px;flex-wrap:wrap;}" +
      ".irt-bar h2{margin:0;font:700 14px/1 'Saira Condensed',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#cabf9f;}" +
      ".irt-collapsible{cursor:pointer;user-select:none;}" +
      ".irt-chev{font-size:12px;color:#8a8268;}" +
      ".irt-assign{display:flex;align-items:center;gap:6px;padding:0 11px 11px;font:600 9px/1 'Archivo';letter-spacing:.06em;text-transform:uppercase;color:#8a8268;}" +
      ".irt-assign select{flex:1;min-width:0;font:400 11px/1.3 'Courier Prime',monospace;color:#23201a;background:#fff;border:1px solid #c7bea6;border-radius:3px;padding:4px 5px;}" +
      ".irt-members{list-style:none;margin:0 0 12px;padding:0;display:flex;flex-direction:column;gap:6px;}" +
      ".irt-member{display:flex;align-items:center;gap:10px;background:#f5f1e6;border:1px solid #d8cfb8;border-radius:5px;padding:7px 10px;}" +
      ".irt-member .me-email{flex:1;min-width:0;font:400 12px/1.3 'Courier Prime',monospace;color:#23201a;overflow:hidden;text-overflow:ellipsis;}" +
      ".irt-member .me-pending{flex:none;font:600 9px/1 'Archivo';letter-spacing:.05em;text-transform:uppercase;color:#9b6a1f;background:#f3ead2;border:1px solid #ddc89a;border-radius:3px;padding:3px 6px;}" +
      ".irt-inviterow{display:flex;gap:8px;flex-wrap:wrap;}" +
      ".irt-inviterow input{flex:1;min-width:160px;font:400 13px/1.4 'Courier Prime',monospace;color:#23201a;background:#fff;border:1px solid #c7bea6;border-radius:3px;padding:8px 10px;outline:0;}" +
      ".irt-inviterow input:focus{border-color:#0c3a54;}" +
      ".irt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;}" +
      ".irt-card{position:relative;text-align:left;color:#23201a;background:#f2f2ec;border:1px solid #c7bea6;border-radius:8px;overflow:hidden;display:flex;flex-direction:column;cursor:pointer;padding:0;font:inherit;transition:transform .12s,box-shadow .12s;}" +
      ".irt-card:hover{transform:translateY(-3px);box-shadow:0 12px 26px rgba(0,0,0,.4);}" +
      ".irt-card .photo{aspect-ratio:3/4;background:#d9d2bf no-repeat center top;background-size:cover;border-bottom:1px solid #c7bea6;}" +
      ".irt-card .meta{padding:9px 11px 11px;}" +
      ".irt-card .kn{font:800 17px/1 'Saira Condensed',sans-serif;letter-spacing:.03em;text-transform:uppercase;}" +
      ".irt-card .ex{margin-top:3px;font:400 10px/1.3 'Courier Prime',monospace;color:#8a8268;min-height:13px;}" +
      ".irt-badge{position:absolute;top:8px;left:8px;font:700 8px/1 'Archivo';letter-spacing:.1em;text-transform:uppercase;padding:4px 6px;border-radius:3px;color:#fff;}" +
      ".irt-badge.local{background:#6b6452;}" +
      ".irt-badge.cloud{background:#0c3a54;}" +
      ".irt-cardacts{display:flex;gap:6px;flex-wrap:wrap;padding:0 11px 11px;}" +
      ".irt-empty{font:400 12px/1.6 'Courier Prime',monospace;color:#8a8268;padding:4px 2px;}" +
      ".irt-newcard{align-items:center;justify-content:center;min-height:150px;border:2px dashed #6f6a58;color:#e7e0cb;background:rgba(255,255,255,.03);}" +
      ".irt-newcard:hover{background:#0c3a54;border-color:#0c3a54;color:#fff;}" +
      ".irt-newcard .plus{font:700 30px/1 'Archivo';color:inherit;}" +
      ".irt-newcard .lbl{font:600 11px/1 'Archivo';letter-spacing:.06em;text-transform:uppercase;margin-top:6px;color:inherit;}" +
      // sheet status chip
      ".irt-chip{width:100%;background:#f5f1e6;color:#23201a;border:1px solid #c7bea6;border-radius:8px;box-shadow:0 8px 22px rgba(0,0,0,.28);padding:11px 13px;font:400 12px/1.5 'Courier Prime',monospace;}" +
      ".irt-chip .loc{display:flex;align-items:center;gap:7px;font:700 11px/1 'Archivo';letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}" +
      ".irt-chip .dot{width:8px;height:8px;border-radius:50%;display:inline-block;}" +
      ".irt-chip .dot.local{background:#6b6452;}.irt-chip .dot.cloud{background:#0c3a54;}.irt-chip .dot.none{background:#b08;}" +
      ".irt-chip .state{color:#8a8268;}" +
      ".irt-chip .state.err{color:#8a2c1f;}" +
      ".irt-chip .acts{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px;}" +
      ".irt-toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:2147483002;background:#23201a;color:#f3ecdb;font:600 12px/1.3 'Archivo';letter-spacing:.04em;padding:11px 16px;border-radius:4px;box-shadow:0 10px 30px rgba(0,0,0,.5);max-width:90%;}" +
      "@media (max-width:560px){#irt-overlay{padding:14px 8px;}#irt-modal .bd{padding:14px;}}" +
      "@media print{#irt-overlay,#irt-toast,#irt-root{display:none !important;}}";
    var style = document.createElement("style");
    style.id = "irt-store-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function toast(text) {
    var t = document.createElement("div");
    t.className = "irt-toast";
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(function () {
      if (t.parentNode) t.parentNode.removeChild(t);
    }, 2600);
  }

  // ---- login modal (shared) -----------------------------------------------

  var overlay, modal, loginState = { sent: null, notice: null };
  var turnstileWidgetId = null;
  var turnstileToken = "";

  function buildLoginModal() {
    if (overlay) return;
    var root = document.createElement("div");
    root.id = "irt-root";
    overlay = document.createElement("div");
    overlay.id = "irt-overlay";
    overlay.style.display = "none";
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLogin();
    });
    modal = document.createElement("div");
    modal.id = "irt-modal";
    modal.addEventListener("click", function (e) {
      var t = e.target.closest && e.target.closest("[data-act]");
      if (!t) return;
      var act = t.getAttribute("data-act");
      if (act === "close") closeLogin();
      else if (act === "send") sendLink();
      else if (act === "again") {
        loginState.sent = null;
        loginState.notice = null;
        renderLogin();
      }
    });
    modal.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target && e.target.id === "irt-email") {
        e.preventDefault();
        sendLink();
      }
    });
    overlay.appendChild(modal);
    root.appendChild(overlay);
    document.body.appendChild(root);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.style.display !== "none") closeLogin();
    });
  }

  function openLogin() {
    buildLoginModal();
    overlay.style.display = "flex";
    renderLogin();
  }
  function closeLogin() {
    if (overlay) overlay.style.display = "none";
    loginState.sent = null;
    loginState.notice = null;
  }
  function renderLogin() {
    var body = loginState.sent
      ? '<div class="bd">' +
        (loginState.notice ? '<div class="irt-msg ' + loginState.notice.kind + '">' + esc(loginState.notice.text) + "</div>" : "") +
        "<p>En inloggningslänk har skickats till <strong>" +
        esc(loginState.sent) +
        "</strong>. Öppna den i samma webbläsare — länken gäller i 15&nbsp;minuter.</p>" +
        '<div><button class="irt-btn ghost" data-act="again" type="button">Skicka till en annan adress</button></div>' +
        "</div>"
      : '<div class="bd">' +
        (loginState.notice ? '<div class="irt-msg ' + loginState.notice.kind + '">' + esc(loginState.notice.text) + "</div>" : "") +
        "<p>Logga in för att lägga dina rollpersoner i Arkivskåpet (på servern) och nå dem från vilken enhet som helst — inget lösenord behövs.</p>" +
        '<label for="irt-email">E-post</label>' +
        '<input id="irt-email" type="email" autocomplete="email" placeholder="namn@exempel.se" />' +
        '<div id="irt-turnstile"></div>' +
        '<div style="margin-top:14px;"><button class="irt-btn" data-act="send" type="button">Skicka inloggningslänk</button></div>' +
        '<p style="margin:16px 0 0;padding-top:13px;border-top:1px solid #d8cfb8;font-size:11px;line-height:1.6;color:#6f6858;"><strong>Integritet:</strong> ' +
        PRIVACY_HTML +
        "</p>" +
        "</div>";
    modal.innerHTML =
      '<div class="hd"><h2>Logga in</h2><button class="x" data-act="close" type="button" aria-label="Stäng">&times;</button></div>' +
      body;
    if (!loginState.sent) {
      mountTurnstile();
      var i = modal.querySelector("#irt-email");
      if (i) i.focus();
    }
  }

  function sendLink() {
    var input = modal.querySelector("#irt-email");
    if (!input) return;
    var email = input.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      loginState.notice = { kind: "err", text: "Ange en giltig e-postadress." };
      return renderLogin();
    }
    if (config && config.turnstileSiteKey && !turnstileToken) {
      loginState.notice = { kind: "err", text: "Bekräfta robotkontrollen först." };
      return renderLogin();
    }
    var btn = modal.querySelector('[data-act="send"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Skickar…";
    }
    api("/auth/request-link", {
      method: "POST",
      body: { email: email, turnstileToken: turnstileToken, next: location.pathname },
    }).then(function (r) {
      turnstileToken = "";
      if (r.ok) {
        loginState.sent = email;
        loginState.notice = null;
      } else {
        loginState.notice = { kind: "err", text: (r.data && r.data.error) || "Något gick fel. Försök igen." };
      }
      renderLogin();
    });
  }

  function ensureTurnstileScript(cb) {
    if (window.turnstile) return cb();
    if (window.__irtTSQueue) {
      window.__irtTSQueue.push(cb);
      return;
    }
    window.__irtTSQueue = [cb];
    window.__irtTurnstileOnload = function () {
      var q = window.__irtTSQueue || [];
      window.__irtTSQueue = null;
      q.forEach(function (fn) {
        fn();
      });
    };
    var s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__irtTurnstileOnload";
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }
  function mountTurnstile() {
    var key = config && config.turnstileSiteKey;
    if (!key || !modal.querySelector("#irt-turnstile")) return;
    turnstileWidgetId = null;
    turnstileToken = "";
    ensureTurnstileScript(function () {
      var el = modal.querySelector("#irt-turnstile");
      if (!window.turnstile || !el) return;
      try {
        turnstileWidgetId = window.turnstile.render(el, {
          sitekey: key,
          theme: "light",
          callback: function (t) {
            turnstileToken = t;
          },
          "expired-callback": function () {
            turnstileToken = "";
          },
        });
      } catch (e) {}
    });
  }

  function logout() {
    return api("/auth/logout", { method: "POST" }).then(function () {
      me = { authenticated: false };
    });
  }

  // ---- public actions ------------------------------------------------------

  function openCharacter(source, id) {
    if (source === "local") {
      var c = getLocal(id);
      if (!c) {
        toast("Rollpersonen hittades inte.");
        return;
      }
      writeBuffer(c.data);
      setOpen({ source: "local", id: id, name: c.name });
      location.href = "personalakt";
    } else {
      getCloud(id).then(function (r) {
        if (!r.ok) {
          toast((r.data && r.data.error) || "Kunde inte öppna rollpersonen.");
          return;
        }
        writeBuffer(r.data.data);
        setOpen({ source: "cloud", id: r.data.id, version: r.data.version, name: r.data.name });
        location.href = "personalakt";
      });
    }
  }

  function newCharacter(target) {
    if (target === "cloud") {
      createCloud({}, "Namnlös rollperson").then(function (r) {
        if (r.ok) {
          writeBuffer({});
          setOpen({ source: "cloud", id: r.data.id, version: r.data.version, name: r.data.name });
          location.href = "personalakt";
        } else if (r.status === 401) {
          openLogin();
        } else {
          toast((r.data && r.data.error) || "Kunde inte skapa.");
        }
      });
    } else {
      var id = createLocal({});
      writeBuffer({});
      setOpen({ source: "local", id: id, name: "Namnlös rollperson" });
      location.href = "personalakt";
    }
  }

  function importPregen(slug, name) {
    return fetch("characters/" + encodeURIComponent(slug) + ".json", { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        var target = me && me.authenticated ? "cloud" : "local";
        if (target === "cloud") {
          return createCloud(data, nameOf(data)).then(function (r) {
            if (r.ok) {
              toast("«" + (name || nameOf(data)) + "» importerad till Arkivskåpet.");
              if (galleryEl) renderGallery();
            } else if (r.status === 401) openLogin();
            else toast((r.data && r.data.error) || "Kunde inte importera.");
          });
        }
        createLocal(data);
        toast("«" + (name || nameOf(data)) + "» importerad till Skrivbordet.");
        if (galleryEl) renderGallery();
      })
      .catch(function () {
        toast("Kunde inte importera rollpersonen.");
      });
  }

  function moveToCloud(localId) {
    var c = getLocal(localId);
    if (!c) return;
    if (!(me && me.authenticated)) {
      openLogin();
      return;
    }
    createCloud(c.data, c.name).then(function (r) {
      if (r.ok) {
        deleteLocal(localId);
        var o = getOpen();
        if (o && o.source === "local" && o.id === localId) {
          setOpen({ source: "cloud", id: r.data.id, version: r.data.version, name: r.data.name });
        }
        toast("Flyttad till Arkivskåpet.");
        if (galleryEl) renderGallery();
      } else if (r.status === 401) {
        openLogin();
      } else {
        toast((r.data && r.data.error) || "Kunde inte flytta.");
      }
    });
  }

  function deleteCharacter(source, id, name) {
    var label = name ? "«" + name + "»" : "rollpersonen";
    if (source === "local") {
      if (!confirm("Ta bort " + label + " från Skrivbordet (den här webbläsaren)? Det går inte att ångra.")) return;
      deleteLocal(id);
      if (galleryEl) renderGallery();
    } else {
      if (!confirm("Flytta " + label + " till papperskorgen? Du kan återställa den i 30 dagar.")) return;
      deleteCloud(id).then(function (r) {
        if (r.ok) {
          if (galleryEl) renderGallery();
        } else toast((r.data && r.data.error) || "Kunde inte ta bort.");
      });
    }
  }

  function restoreCharacter(id) {
    restoreCloud(id).then(function (r) {
      if (r.ok) {
        if (galleryEl) renderGallery();
      } else toast((r.data && r.data.error) || "Kunde inte återställa.");
    });
  }

  function purgeTrashItem(id, name) {
    if (!confirm("Ta bort " + (name ? "«" + name + "»" : "rollpersonen") + " permanent? Det går inte att ångra.")) return;
    purgeCloudTrash(id).then(function (r) {
      if (r.ok) {
        if (galleryEl) renderGallery();
      } else toast((r.data && r.data.error) || "Kunde inte ta bort.");
    });
  }

  function emptyTrash() {
    if (!confirm("Töm papperskorgen permanent? Alla rollpersoner där raderas och kan inte återställas.")) return;
    emptyCloudTrash().then(function (r) {
      if (r.ok) {
        if (galleryEl) renderGallery();
      } else toast((r.data && r.data.error) || "Kunde inte tömma papperskorgen.");
    });
  }

  // Deep-clone a character's data and tag the display name as a copy.
  function withCopySuffix(data) {
    var clone = JSON.parse(JSON.stringify(data || {}));
    var f = clone.fields || (clone.fields = {});
    if (f.kodnamn) f.kodnamn = f.kodnamn + " (kopia)";
    else if (f.namn) f.namn = f.namn + " (kopia)";
    else f.kodnamn = "Kopia";
    return clone;
  }

  // Duplicate a character into the same storage it lives in.
  function copyCharacter(source, id) {
    if (source === "local") {
      var c = getLocal(id);
      if (!c) return;
      createLocal(withCopySuffix(c.data));
      toast("Kopia skapad på Skrivbordet.");
      if (galleryEl) renderGallery();
    } else {
      getCloud(id).then(function (r) {
        if (!r.ok) {
          toast((r.data && r.data.error) || "Kunde inte kopiera.");
          return;
        }
        var data = withCopySuffix(r.data.data);
        createCloud(data, nameOf(data)).then(function (res) {
          if (res.ok) {
            toast("Kopia skapad i Arkivskåpet.");
            if (galleryEl) renderGallery();
          } else if (res.status === 401) {
            openLogin();
          } else {
            toast((res.data && res.data.error) || "Kunde inte kopiera.");
          }
        });
      });
    }
  }

  // ---- photo upload (crop + downsize to a portrait JPEG data URI) ----------
  // Photos are stored inline in the character JSON as a data: URI, so a
  // character stays a single self-contained file regardless of where it lives.
  function pickPhoto() {
    return new Promise(function (resolve) {
      var input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = function () {
        var file = input.files && input.files[0];
        if (!file) return resolve(null);
        var reader = new FileReader();
        reader.onload = function () {
          var img = new Image();
          img.onload = function () {
            resolve(cropToPortrait(img));
          };
          img.onerror = function () {
            resolve(null);
          };
          img.src = reader.result;
        };
        reader.onerror = function () {
          resolve(null);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }

  function cropToPortrait(img) {
    var TW = 384,
      TH = 512; // 3:4, matches the sheet/card photo frames
    var canvas = document.createElement("canvas");
    canvas.width = TW;
    canvas.height = TH;
    var ctx = canvas.getContext("2d");
    if (!ctx) return null;
    // Cover-crop, centred horizontally and anchored to the top — the same
    // framing the photo frames use (object-fit:cover; object-position:center top).
    var scale = Math.max(TW / img.width, TH / img.height);
    var dw = img.width * scale,
      dh = img.height * scale;
    ctx.drawImage(img, (TW - dw) / 2, 0, dw, dh);
    try {
      return canvas.toDataURL("image/jpeg", 0.82);
    } catch (e) {
      return null; // e.g. a tainted canvas
    }
  }

  // ---- gallery page --------------------------------------------------------

  var galleryEl = null;
  var pregenCache = null;
  var trashOpen = false; // Papperskorg starts collapsed
  var pregenOpen = false; // Färdiga rollpersoner starts collapsed
  var membersOpen = false; // Medlemmar starts collapsed
  var members = []; // members of my vault (for the assign selects)

  function listMembers() {
    return api("/members").then(function (r) {
      return r.ok ? r.data.members || [] : [];
    });
  }
  function inviteMember(email) {
    return api("/members", { method: "POST", body: { email: email } });
  }
  function removeMember(id) {
    return api("/members/" + encodeURIComponent(id), { method: "DELETE" });
  }
  function listVaults() {
    return api("/vaults").then(function (r) {
      return r.ok ? r.data.vaults || [] : [];
    });
  }
  function listVaultChars(ownerId) {
    return api("/characters?owner=" + encodeURIComponent(ownerId)).then(function (r) {
      return r.ok ? r.data.characters || [] : [];
    });
  }
  function assignReq(id, memberId) {
    return api("/characters/" + encodeURIComponent(id) + "/assign", {
      method: "PUT",
      body: { memberId: memberId || null },
    });
  }
  // A character photo is always one of two quote-free shapes: an app-generated
  // inline portrait (data:image/…;base64,…) or a bundled pre-gen file
  // (characters/<slug>.<ext>). Emit it as a CSS background only when it matches
  // one of those exactly — esc() can't neutralise a single quote inside a CSS
  // url('…') string (the HTML parser decodes &#39; back to '), so an attacker-
  // controlled foto could otherwise break out. Anything else renders no photo.
  function safePhotoUrl(foto) {
    foto = String(foto == null ? "" : foto);
    if (/^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(foto)) return foto;
    if (/^characters\/[A-Za-z0-9._-]+\.(?:jpe?g|png|webp|gif|avif)$/i.test(foto)) return foto;
    return "";
  }
  function photoStyle(foto) {
    var url = safePhotoUrl(foto);
    return url ? " style=\"background-image:url('" + url + "')\"" : "";
  }

  function loadPregens() {
    if (pregenCache) return Promise.resolve(pregenCache);
    return fetch("characters/index.json", { cache: "no-cache" })
      .then(function (r) {
        return r.ok ? r.json() : [];
      })
      .then(function (list) {
        pregenCache = Array.isArray(list) ? list : [];
        return pregenCache;
      })
      .catch(function () {
        return [];
      });
  }

  // A character in my own vault (local or cloud). Cloud cards get an assign
  // select listing my vault members.
  function ownCardHtml(c) {
    var badge = '<span class="irt-badge ' + c.source + '">' + (c.source === "cloud" ? "Arkivskåpet" : "Skrivbordet") + "</span>";
    var assign = "";
    if (c.source === "cloud") {
      var opts =
        '<option value="">Otilldelad</option>' +
        members
          .map(function (m) {
            return (
              '<option value="' +
              esc(m.id) +
              '"' +
              (c.assignedTo === m.id ? " selected" : "") +
              ">" +
              esc(m.email) +
              (m.confirmed ? "" : " (väntar)") +
              "</option>"
            );
          })
          .join("");
      assign =
        '<label class="irt-assign"><span>Tilldelad</span><select data-act="assign" data-id="' +
        esc(c.id) +
        '">' +
        opts +
        "</select></label>";
    }
    var acts =
      '<button class="irt-btn ghost sm" data-act="copy" data-source="' +
      c.source +
      '" data-id="' +
      esc(c.id) +
      '" type="button">Kopiera</button>' +
      '<button class="irt-btn ghost sm" data-act="delete" data-source="' +
      c.source +
      '" data-id="' +
      esc(c.id) +
      '" data-name="' +
      esc(c.name) +
      '" type="button">Ta bort</button>' +
      (c.source === "local"
        ? '<button class="irt-btn sm" data-act="move" data-id="' + esc(c.id) + '" type="button">Till Arkivskåpet 🗄</button>'
        : "");
    return (
      '<div class="irt-card" data-act="open" data-source="' +
      c.source +
      '" data-id="' +
      esc(c.id) +
      '">' +
      badge +
      '<div class="photo"' +
      photoStyle(c.foto) +
      "></div>" +
      '<div class="meta"><div class="kn">' +
      esc(c.name) +
      '</div><div class="ex">' +
      esc(c.expertis || "") +
      "</div></div>" +
      '<div class="irt-cardacts">' +
      acts +
      "</div>" +
      assign +
      "</div>"
    );
  }

  // A character assigned to me in someone else's vault — open only.
  function sharedCardHtml(c) {
    return (
      '<div class="irt-card" data-act="open" data-source="cloud" data-id="' +
      esc(c.id) +
      '"><span class="irt-badge cloud">Tilldelad</span><div class="photo"' +
      photoStyle(c.foto) +
      '></div><div class="meta"><div class="kn">' +
      esc(c.name) +
      '</div><div class="ex">' +
      esc(c.expertis || "") +
      "</div></div></div>"
    );
  }

  function trashCardHtml(c) {
    return (
      '<div class="irt-card">' +
      '<span class="irt-badge cloud">Papperskorg</span>' +
      '<div class="photo"' +
      photoStyle(c.foto) +
      "></div>" +
      '<div class="meta"><div class="kn">' +
      esc(c.name) +
      '</div><div class="ex">Borttagen ' +
      esc(fmtDate(c.deleted_at)) +
      "</div></div>" +
      '<div class="irt-cardacts"><button class="irt-btn sm" data-act="restore" data-id="' +
      esc(c.id) +
      '" type="button">Återställ</button>' +
      '<button class="irt-btn danger sm" data-act="purge" data-id="' +
      esc(c.id) +
      '" data-name="' +
      esc(c.name) +
      '" type="button">Ta bort permanent</button></div></div>'
    );
  }

  function pregenCardHtml(p) {
    return (
      '<div class="irt-card">' +
      '<div class="photo"' +
      photoStyle(p.foto) +
      "></div>" +
      '<div class="meta"><div class="kn">' +
      esc(p.namn || p.slug) +
      '</div><div class="ex">' +
      esc(p.expertis || "") +
      "</div></div>" +
      '<div class="irt-cardacts"><button class="irt-btn sm" data-act="import" data-slug="' +
      esc(p.slug) +
      '" data-name="' +
      esc(p.namn || p.slug) +
      '" type="button">Importera ' +
      (me && me.authenticated ? "🗄" : "↓") +
      "</button></div></div>"
    );
  }

  function membersSectionHtml() {
    var rows = members.length
      ? '<ul class="irt-members">' +
        members
          .map(function (m) {
            return (
              '<li class="irt-member"><span class="me-email">' +
              esc(m.email) +
              "</span>" +
              (m.confirmed ? "" : '<span class="me-pending">väntar på inloggning</span>') +
              '<button class="irt-btn ghost sm" data-act="remove-member" data-id="' +
              esc(m.id) +
              '" data-name="' +
              esc(m.email) +
              '" type="button">Ta bort</button></li>'
            );
          })
          .join("") +
        "</ul>"
      : '<div class="irt-empty">Inga medlemmar än. Bjud in någon för att dela rollpersoner med dem.</div>';
    var form =
      '<div class="irt-inviterow"><input id="irt-invite-email" type="email" placeholder="namn@exempel.se" autocomplete="off" /><button class="irt-btn sm" data-act="invite" type="button">Bjud in</button></div>';
    return (
      '<div class="irt-bar irt-collapsible" data-act="toggle-members"><h2>Medlemmar (' +
      members.length +
      ') <span class="irt-chev">' +
      (membersOpen ? "▾" : "▸") +
      '</span></h2></div><div id="irt-members-body"' +
      (membersOpen ? "" : ' style="display:none;"') +
      ">" +
      rows +
      form +
      "</div>"
    );
  }

  function renderGallery() {
    var loggedIn = me && me.authenticated;
    var local = listLocal();
    var pCloud = loggedIn ? listCloud() : Promise.resolve([]);
    var pTrash = loggedIn ? listTrash() : Promise.resolve([]);
    var pMembers = loggedIn ? listMembers() : Promise.resolve([]);
    var pVaults = loggedIn ? listVaults() : Promise.resolve([]);
    Promise.all([pCloud, pTrash, pMembers, pVaults, loadPregens()]).then(function (res) {
      var cloud = res[0],
        trash = res[1],
        pregens = res[4];
      members = res[2];
      var vaults = res[3];
      var mine = cloud.concat(local).sort(function (a, b) {
        return (b.updated_at || 0) - (a.updated_at || 0);
      });

      // Fetch the characters assigned to me in each vault I'm a member of.
      Promise.all(
        vaults.map(function (v) {
          return listVaultChars(v.ownerId).then(function (chars) {
            return { vault: v, chars: chars };
          });
        }),
      ).then(function (shared) {
        var authbar = loggedIn
          ? "<span>Inloggad som <strong>" +
            esc(me.email) +
            '</strong> — rollpersoner i Arkivskåpet synkas mellan alla dina enheter.</span><button class="irt-btn ghost sm" data-act="logout" type="button">Logga ut</button>'
          : '<span>Dina rollpersoner ligger på Skrivbordet — bara i den här webbläsaren. Logga in för att lägga dem i Arkivskåpet (på servern, nåbart från alla enheter) och dela dem.</span><button class="irt-btn sm" data-act="login" type="button">Logga in</button>';

        var newCard =
          '<button class="irt-card irt-newcard" data-act="new" type="button"><span class="plus">+</span><span class="lbl">Ny rollperson</span></button>';

        var mineGrid = '<div class="irt-grid">' + newCard + mine.map(ownCardHtml).join("") + "</div>";

        var membersBlock = loggedIn ? membersSectionHtml() : "";

        var sharedBlock = shared
          .map(function (s) {
            var grid = s.chars.length
              ? '<div class="irt-grid">' + s.chars.map(sharedCardHtml).join("") + "</div>"
              : '<div class="irt-empty">Inga rollpersoner tilldelade dig här än.</div>';
            return '<div class="irt-bar"><h2>Hos ' + esc(s.vault.ownerEmail) + "</h2></div>" + grid;
          })
          .join("");

        var trashBlock = renderTrashBlock(trash);
        var pregenBlock = renderPregenBlock(pregens, loggedIn);

        galleryEl.innerHTML =
          '<div class="irt-authbar">' +
          authbar +
          "</div>" +
          '<div class="irt-bar"><h2>Mina rollpersoner</h2></div>' +
          mineGrid +
          membersBlock +
          sharedBlock +
          trashBlock +
          pregenBlock +
          '<p class="irt-empty" style="margin:38px 2px 0;padding:16px 2px 0;border-top:1px solid #46443d;line-height:1.7;"><strong style="color:#cabf9f;">Integritet:</strong> ' +
          PRIVACY_HTML +
          "</p>" +
          '<p class="irt-empty" style="margin:12px 2px 0;font-size:11px;letter-spacing:.03em;">En tjänst av Exostra och Jens Alm.</p>';
      });
    });
  }

  function assignCharacter(id, memberId) {
    assignReq(id, memberId).then(function (r) {
      if (r.ok) {
        toast(memberId ? "Tilldelad." : "Otilldelad.");
        renderGallery();
      } else if (r.status === 401) openLogin();
      else toast((r.data && r.data.error) || "Kunde inte tilldela.");
    });
  }

  function inviteMemberAction() {
    var input = document.getElementById("irt-invite-email");
    var email = input ? input.value.trim() : "";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast("Ange en giltig e-postadress.");
      return;
    }
    inviteMember(email).then(function (r) {
      if (r.ok) {
        toast("Inbjudan skickad till " + email + ".");
        renderGallery();
      } else if (r.status === 401) {
        openLogin();
      } else {
        // 502 = member added but email failed; refresh so they still show up.
        toast((r.data && r.data.error) || "Kunde inte bjuda in.");
        renderGallery();
      }
    });
  }

  function removeMemberAction(id, email) {
    if (!confirm("Ta bort " + (email ? "«" + email + "»" : "medlemmen") + " från ditt Arkivskåp? Deras tilldelade rollpersoner blir otilldelade.")) return;
    removeMember(id).then(function (r) {
      if (r.ok) {
        toast("Medlem borttagen.");
        renderGallery();
      } else toast((r.data && r.data.error) || "Kunde inte ta bort medlem.");
    });
  }

  function renderTrashBlock(trash) {
    return trash.length
        ? '<div class="irt-bar irt-collapsible" data-act="toggle-trash"><h2>Papperskorg (' +
          trash.length +
          ') <span class="irt-chev">' +
          (trashOpen ? "▾" : "▸") +
          '</span></h2><button class="irt-btn danger sm" data-act="empty-trash" type="button">Töm papperskorgen</button></div>' +
          '<div class="irt-grid" id="irt-trash-grid"' +
          (trashOpen ? "" : ' style="display:none;"') +
          ">" +
          trash.map(trashCardHtml).join("") +
          "</div>"
        : "";
  }

  function renderPregenBlock(pregens, loggedIn) {
    return pregens.length
        ? '<div class="irt-bar irt-collapsible" data-act="toggle-pregens"><h2>Färdiga rollpersoner (' +
          pregens.length +
          ') <span class="irt-chev">' +
          (pregenOpen ? "▾" : "▸") +
          "</span></h2></div>" +
          '<div id="irt-pregen-body"' +
          (pregenOpen ? "" : ' style="display:none;"') +
          '><p class="irt-empty">Importera en färdig rollperson till ' +
          (loggedIn ? "Arkivskåpet" : "Skrivbordet") +
          " för att använda och anpassa den.</p>" +
          '<div class="irt-grid">' +
          pregens.map(pregenCardHtml).join("") +
          "</div></div>"
        : "";
  }

  function wireGallery() {
    // Assignment uses a <select>, handled on change (not click).
    galleryEl.addEventListener("change", function (e) {
      var t = e.target.closest && e.target.closest('[data-act="assign"]');
      if (t && galleryEl.contains(t)) assignCharacter(t.getAttribute("data-id"), t.value);
    });
    galleryEl.addEventListener("click", function (e) {
      var t = e.target.closest && e.target.closest("[data-act]");
      if (!t || !galleryEl.contains(t)) return;
      var act = t.getAttribute("data-act");
      if (act === "assign") return; // handled on change
      if (act === "open") openCharacter(t.getAttribute("data-source"), t.getAttribute("data-id"));
      else if (act === "new") newCharacter(me && me.authenticated ? "cloud" : "local");
      else if (act === "delete")
        deleteCharacter(t.getAttribute("data-source"), t.getAttribute("data-id"), t.getAttribute("data-name"));
      else if (act === "move") moveToCloud(t.getAttribute("data-id"));
      else if (act === "copy") copyCharacter(t.getAttribute("data-source"), t.getAttribute("data-id"));
      else if (act === "import") importPregen(t.getAttribute("data-slug"), t.getAttribute("data-name"));
      else if (act === "restore") restoreCharacter(t.getAttribute("data-id"));
      else if (act === "purge") purgeTrashItem(t.getAttribute("data-id"), t.getAttribute("data-name"));
      else if (act === "empty-trash") emptyTrash();
      else if (act === "invite") inviteMemberAction();
      else if (act === "remove-member") removeMemberAction(t.getAttribute("data-id"), t.getAttribute("data-name"));
      else if (act === "toggle-trash") {
        trashOpen = !trashOpen;
        var grid = document.getElementById("irt-trash-grid");
        if (grid) grid.style.display = trashOpen ? "" : "none";
        var chev = t.querySelector(".irt-chev");
        if (chev) chev.textContent = trashOpen ? "▾" : "▸";
      } else if (act === "toggle-pregens") {
        pregenOpen = !pregenOpen;
        var pb = document.getElementById("irt-pregen-body");
        if (pb) pb.style.display = pregenOpen ? "" : "none";
        var pchev = t.querySelector(".irt-chev");
        if (pchev) pchev.textContent = pregenOpen ? "▾" : "▸";
      } else if (act === "toggle-members") {
        membersOpen = !membersOpen;
        var mb = document.getElementById("irt-members-body");
        if (mb) mb.style.display = membersOpen ? "" : "none";
        var mchev = t.querySelector(".irt-chev");
        if (mchev) mchev.textContent = membersOpen ? "▾" : "▸";
      } else if (act === "login") openLogin();
      else if (act === "logout")
        logout().then(function () {
          renderGallery();
        });
    });
  }

  // ---- sheet page (autosave routing + status chip) -------------------------

  var chipEl = null;
  var saveTimer = null;
  var saving = false;
  var dirty = false;
  var saveState = "idle"; // idle|saving|saved|conflict|error|auth
  var localTimer = null;
  var localDirty = false;

  function attachSheet() {
    chipEl = document.createElement("div");
    chipEl.className = "irt-chip";
    chipEl.addEventListener("click", function (e) {
      var t = e.target.closest && e.target.closest("[data-act]");
      if (!t) return;
      var act = t.getAttribute("data-act");
      if (act === "save-local") saveCurrentAs("local");
      else if (act === "save-cloud") saveCurrentAs("cloud");
      else if (act === "move") moveCurrentToCloud();
      else if (act === "resolve") resolveConflict();
      else if (act === "login") openLogin();
    });

    var obs = new MutationObserver(ensureChipMounted);
    obs.observe(document.body, { childList: true, subtree: true });
    ensureChipMounted();

    window.addEventListener("pagehide", flushOnExit);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") flushOnExit();
    });
    renderChip();
  }

  function ensureChipMounted() {
    var slot = document.getElementById("irt-sheet-status");
    if (slot && chipEl && chipEl.parentNode !== slot) {
      slot.appendChild(chipEl);
      renderChip();
    }
  }

  function renderChip() {
    if (!chipEl) return;
    var ptr = getOpen();
    var loggedIn = me && me.authenticated;
    var html = "";

    if (!ptr || ptr.source === "none") {
      html =
        '<div class="loc"><span class="dot none"></span>Inte sparad</div>' +
        '<div class="state">Den här blanketten ligger bara i webbläsarens minne. Spara den i arkivet:</div>' +
        '<div class="acts"><button class="irt-btn sm" data-act="save-local" type="button">Spara på Skrivbordet</button>' +
        (loggedIn ? '<button class="irt-btn sm" data-act="save-cloud" type="button">Spara i Arkivskåpet 🗄</button>' : "") +
        "</div>";
    } else if (ptr.source === "local") {
      html =
        '<div class="loc"><span class="dot local"></span>Skrivbordet · ' +
        esc(ptr.name || "") +
        "</div>" +
        '<div class="state">Ligger på Skrivbordet — bara i den här webbläsaren.</div>' +
        (loggedIn
          ? '<div class="acts"><button class="irt-btn sm" data-act="move" type="button">Flytta till Arkivskåpet 🗄</button></div>'
          : "");
    } else {
      var s =
        saveState === "saving"
          ? '<span class="state">Sparar i Arkivskåpet…</span>'
          : saveState === "conflict"
            ? '<span class="state err">Ändrad i Arkivskåpet sedan du öppnade den.</span>'
            : saveState === "error"
              ? '<span class="state err">Kunde inte spara — försöker igen.</span>'
              : saveState === "auth"
                ? '<span class="state err">Du har loggats ut.</span>'
                : saveState === "gone"
                  ? '<span class="state err">Rollpersonen är inte längre tillgänglig.</span>'
                  : '<span class="state">Sparad i Arkivskåpet.</span>';
      html =
        '<div class="loc"><span class="dot cloud"></span>Arkivskåpet · ' +
        esc(ptr.name || "") +
        "</div><div>" +
        s +
        "</div>" +
        (saveState === "conflict" || saveState === "gone"
          ? '<div class="acts"><button class="irt-btn sm" data-act="resolve" type="button">Spara som ny kopia</button></div>'
          : saveState === "auth"
            ? '<div class="acts"><button class="irt-btn sm" data-act="login" type="button">Logga in igen</button></div>'
            : "");
    }
    chipEl.innerHTML = html;
  }

  // Called by the sheet component after every autosave to the buffer.
  function afterPersist() {
    var ptr = getOpen();
    var buf = readBuffer();
    if (!ptr || ptr.source === "none") {
      renderChip();
      return;
    }
    if (ptr.source === "local") {
      // The single open character is already in the buffer; debounce the
      // (potentially large, photo-bearing) library-map write.
      localDirty = true;
      var nm = nameOf(buf);
      if (ptr.name !== nm) {
        ptr.name = nm;
        setOpen(ptr);
      }
      renderChip();
      clearTimeout(localTimer);
      localTimer = setTimeout(flushLocal, 700);
      return;
    }
    // cloud: debounced push
    dirty = true;
    if (saveState !== "conflict" && saveState !== "auth") saveState = "saving";
    renderChip();
    scheduleCloudPush();
  }

  function flushLocal() {
    var ptr = getOpen();
    if (!ptr || ptr.source !== "local" || !localDirty) return;
    localDirty = false;
    upsertLocal(ptr.id, readBuffer());
  }

  function scheduleCloudPush() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(pushCloud, 1500);
  }

  function pushCloud() {
    if (saving) return; // a later edit will reschedule on completion
    var ptr = getOpen();
    if (!ptr || ptr.source !== "cloud" || !dirty) return;
    if (saveState === "conflict") return; // wait for the user to resolve
    saving = true;
    dirty = false;
    var buf = readBuffer();
    putCloud(ptr.id, buf, ptr.version).then(function (r) {
      saving = false;
      if (r.ok) {
        setOpen({ source: "cloud", id: ptr.id, version: r.data.version, name: r.data.name });
        saveState = dirty ? "saving" : "saved";
        renderChip();
        if (dirty) scheduleCloudPush();
      } else if (r.status === 409) {
        saveState = "conflict";
        renderChip();
      } else if (r.status === 401) {
        saveState = "auth";
        me = { authenticated: false };
        renderChip();
      } else if (r.status === 404) {
        // Gone or unassigned mid-edit — stop retrying (don't spam the server).
        saveState = "gone";
        renderChip();
      } else {
        dirty = true; // retry on next edit / schedule
        saveState = "error";
        renderChip();
        scheduleCloudPush();
      }
    });
  }

  // Best-effort final flush when leaving the page (last-write-wins).
  function flushOnExit() {
    var ptr = getOpen();
    if (!ptr) return;
    if (ptr.source === "local" && localDirty) {
      localDirty = false;
      upsertLocal(ptr.id, readBuffer());
    } else if (ptr.source === "cloud" && dirty && !saving) {
      putCloud(ptr.id, readBuffer(), ptr.version, true);
      dirty = false;
    }
  }

  function resolveConflict() {
    var buf = readBuffer();
    var suggestion = nameOf(buf) + " (kopia)";
    var name = window.prompt(
      "Rollpersonen ändrades i Arkivskåpet sedan du öppnade den. Spara din version som en NY rollperson med namnet:",
      suggestion,
    );
    if (!name) return;
    createCloud(buf, name).then(function (r) {
      if (r.ok) {
        setOpen({ source: "cloud", id: r.data.id, version: r.data.version, name: r.data.name });
        saveState = "saved";
        dirty = false;
        renderChip();
        toast("Sparad som ny: «" + r.data.name + "».");
      } else if (r.status === 401) {
        saveState = "auth";
        renderChip();
      } else {
        toast((r.data && r.data.error) || "Kunde inte spara.");
      }
    });
  }

  // Save an unsaved (source 'none') buffer into the library.
  function saveCurrentAs(target) {
    var buf = readBuffer();
    if (!sheetHasContent(buf)) {
      toast("Formuläret är tomt — fyll i något först.");
      return;
    }
    if (target === "local") {
      var id = createLocal(buf);
      setOpen({ source: "local", id: id, name: nameOf(buf) });
      renderChip();
      toast("Sparad på Skrivbordet.");
    } else {
      if (!(me && me.authenticated)) {
        openLogin();
        return;
      }
      createCloud(buf, nameOf(buf)).then(function (r) {
        if (r.ok) {
          setOpen({ source: "cloud", id: r.data.id, version: r.data.version, name: r.data.name });
          saveState = "saved";
          renderChip();
          toast("Sparad i Arkivskåpet.");
        } else if (r.status === 401) {
          openLogin();
        } else {
          toast((r.data && r.data.error) || "Kunde inte spara.");
        }
      });
    }
  }

  function moveCurrentToCloud() {
    var ptr = getOpen();
    if (!ptr || ptr.source !== "local") return;
    if (!(me && me.authenticated)) {
      openLogin();
      return;
    }
    var buf = readBuffer();
    createCloud(buf, nameOf(buf)).then(function (r) {
      if (r.ok) {
        deleteLocal(ptr.id);
        setOpen({ source: "cloud", id: r.data.id, version: r.data.version, name: r.data.name });
        saveState = "saved";
        renderChip();
        toast("Flyttad till Arkivskåpet.");
      } else if (r.status === 401) {
        openLogin();
      } else {
        toast((r.data && r.data.error) || "Kunde inte flytta.");
      }
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
    if (login === "ok") toast("Inloggad.");
    else {
      loginState.notice = {
        kind: "err",
        text:
          login === "expired"
            ? "Inloggningslänken har gått ut eller redan använts. Begär en ny."
            : "Kunde inte logga in. Försök igen.",
      };
      pendingLogin = true;
    }
  }

  var pendingLogin = false;

  function boot() {
    migrate();
    injectStyles();
    buildLoginModal();
    handleLoginRedirect();

    galleryEl = document.getElementById("irt-gallery");
    var onSheet = !!document.getElementById("irt-sheet-status");

    window.IRTStore = {
      open: openCharacter,
      newCharacter: newCharacter,
      moveToCloud: moveToCloud,
      openLogin: openLogin,
      pickPhoto: pickPhoto,
      _afterPersist: afterPersist,
    };

    if (onSheet) attachSheet();
    if (galleryEl) wireGallery();

    Promise.all([
      api("/config").then(function (r) {
        config = (r.ok && r.data) || {};
      }),
      meGet().then(function (m) {
        me = m;
      }),
    ]).then(function () {
      if (pendingLogin) openLogin();
      if (galleryEl) renderGallery();
      if (onSheet) renderChip();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
