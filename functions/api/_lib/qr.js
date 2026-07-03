// Shared constants for the cross-device QR login flow (start / status /
// approve). A QR request is short-lived: the starting device shows a QR that a
// logged-in device scans and approves, then the starting device polls and gets
// a session. Keep the window short — it only has to survive scan + tap.

export const QR_TTL = 60 * 5; // 5 minutes, seconds

// Path (relative to the site origin) of the approval page the QR points to. The
// phone opens `${origin}${QR_APPROVE_PATH}?c=<code>`; the page reads the code,
// confirms the (already logged-in) user, and approves the request.
export const QR_APPROVE_PATH = "/static/arkivet/qr";
