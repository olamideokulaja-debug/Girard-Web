// After Paystack payment, it redirects here. This page immediately bounces the
// browser back into the Girard app via the girard:// scheme, so the app can
// confirm the payment automatically.
export default function handler(req, res) {
  const ref = (req.query && (req.query.reference || req.query.trxref)) || "";
  const safe = String(ref).replace(/[^A-Za-z0-9._-]/g, "");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(
    "<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Returning to Girard</title></head>" +
    "<body style=\"font-family:-apple-system,Segoe UI,Roboto,sans-serif;text-align:center;padding:48px 24px;color:#16324F\">" +
    "<h3 style=\"color:#C9A24B\">Payment complete</h3><p>Returning you to the Girard app\\u2026</p>" +
    "<a id=\"back\" href=\"girard://pay-return?reference=" + safe + "\" style=\"display:inline-block;margin-top:16px;background:#1FA5A0;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:700\">Return to the app</a>" +
    "<script>var u=\"girard://pay-return?reference=" + safe + "\";location.replace(u);setTimeout(function(){document.getElementById('back').style.display='inline-block';},800);</script>" +
    "</body></html>"
  );
}
