function siteUrl() {
  return (process.env.FRONTEND_URL || 'https://harvdreams.com').replace(/\/$/, '');
}

function logoUrl() {
  return `${siteUrl()}/brand/harv-dreams-logo-nav.png`;
}

/**
 * Branded HTML wrapper for transactional emails.
 * @param {{ title: string, bodyHtml: string, preheader?: string }} opts
 */
function harvEmailLayout({ title, bodyHtml, preheader = '' }) {
  const url = siteUrl();
  const logo = logoUrl();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ''}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #111;">
          <tr>
            <td style="padding:28px 28px 20px;text-align:center;border-bottom:1px solid #e8e8e8;">
              <a href="${url}" style="text-decoration:none;display:inline-block;">
                <img src="${logo}" alt="HARV DREAMS" width="160" style="display:block;margin:0 auto;max-width:160px;height:auto;border:0;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 20px;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#111;">${title}</p>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px;border-top:1px solid #e8e8e8;text-align:center;">
              <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#111;">HARV DREAMS</p>
              <p style="margin:0;font-size:11px;color:#666;">Bold streetwear from Ghana</p>
              <p style="margin:12px 0 0;font-size:11px;">
                <a href="${url}" style="color:#111;text-decoration:underline;">harvdreams.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { harvEmailLayout, siteUrl, logoUrl };
