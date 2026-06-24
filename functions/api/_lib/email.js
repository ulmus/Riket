// Sends the passwordless magic-link email via Resend (https://resend.com).
// The sender (MAIL_FROM) must be on a domain you have verified in Resend.

export async function sendMagicLink(env, email, link) {
  const from = env.MAIL_FROM || "I Rikets Tjänst <noreply@exostra.se>";
  const subject = "Din inloggningslänk till Rollpersonsvalvet";

  const text =
    "Hej!\n\n" +
    "Klicka på länken nedan för att logga in i Rollpersonsvalvet. " +
    "Länken gäller i 15 minuter och kan bara användas en gång.\n\n" +
    link +
    "\n\nBeställde du ingen inloggning? Då kan du strunta i det här mejlet.\n\n" +
    "— I Rikets Tjänst";

  const html = `<!doctype html><html lang="sv"><body style="margin:0;background:#2b2a26;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#23201a;">
  <div style="max-width:480px;margin:0 auto;background:#f5f1e6;border:1px solid #c7bea6;border-radius:8px;padding:28px 26px;">
    <div style="font:700 12px/1 Arial;letter-spacing:.18em;text-transform:uppercase;color:#8a8268;">T-Kontoret · Program Frigg</div>
    <h1 style="margin:6px 0 14px;font:700 22px/1.1 Arial;color:#23201a;">Rollpersonsvalvet</h1>
    <p style="margin:0 0 20px;font:400 14px/1.6 Arial;color:#3a362c;">Klicka på knappen för att logga in. Länken gäller i 15&nbsp;minuter och kan bara användas en gång.</p>
    <p style="margin:0 0 22px;"><a href="${link}" style="display:inline-block;background:#0c3a54;color:#f3ecdb;text-decoration:none;font:700 13px/1 Arial;letter-spacing:.04em;text-transform:uppercase;padding:13px 22px;border-radius:4px;">Logga in</a></p>
    <p style="margin:0 0 6px;font:400 12px/1.5 Arial;color:#8a8268;">Fungerar inte knappen? Kopiera länken:</p>
    <p style="margin:0 0 20px;font:400 12px/1.5 Arial;word-break:break-all;"><a href="${link}" style="color:#0c3a54;">${link}</a></p>
    <p style="margin:0;font:400 12px/1.5 Arial;color:#8a8268;">Beställde du ingen inloggning? Då kan du strunta i det här mejlet.</p>
  </div></body></html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [email], subject, html, text }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    // Surface the real reason in the deployment's function logs. The most
    // common cause is a `from` address whose domain isn't verified in Resend.
    console.error(`Resend send failed: HTTP ${res.status} — ${body}`);
    const err = new Error(`Resend HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
}
