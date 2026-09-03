import "server-only";
import { getAppUrl } from "@/server/env";

type EmailDetail = {
  label: string;
  value: string;
};

type EmailAction = {
  label: string;
  href: string;
};

type LabelVanlifeEmailOptions = {
  preheader: string;
  eyebrow?: string;
  title: string;
  greeting?: string;
  paragraphs?: string[];
  details?: EmailDetail[];
  code?: string;
  action?: EmailAction;
  notice?: string;
  signature?: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function textBlock(value: string): string {
  return escapeHtml(value).replaceAll("\n", "<br>");
}

export function labelVanlifeEmail(options: LabelVanlifeEmailOptions): string {
  const appUrl = getAppUrl();
  const eyebrow = options.eyebrow || "LABEL VANLIFE";
  const signature = options.signature || "L’équipe Label Vanlife";
  const paragraphs = options.paragraphs || [];
  const details = options.details || [];

  const paragraphsHtml = paragraphs.map((paragraph) => `
    <p style="margin:0 0 18px;color:#4b5563;font-family:Arial,sans-serif;font-size:16px;line-height:1.65;">${textBlock(paragraph)}</p>`).join("");

  const detailsHtml = details.length > 0 ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid #e5e1da;border-radius:14px;background:#f8f6f1;overflow:hidden;">
      ${details.map((detail, index) => `
        <tr>
          <td style="padding:13px 16px;${index < details.length - 1 ? "border-bottom:1px solid #e5e1da;" : ""}color:#6b6b6b;font-family:Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">${escapeHtml(detail.label)}</td>
          <td align="right" style="padding:13px 16px;${index < details.length - 1 ? "border-bottom:1px solid #e5e1da;" : ""}color:#1a1a1a;font-family:Arial,sans-serif;font-size:15px;font-weight:700;">${textBlock(detail.value)}</td>
        </tr>`).join("")}
    </table>` : "";

  const codeHtml = options.code ? `
    <div style="margin:26px 0;padding:22px 16px;border:2px solid #c39960;border-radius:14px;background:#fffaf2;text-align:center;">
      <div style="margin-bottom:8px;color:#6b6b6b;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;">Votre code personnel</div>
      <div style="color:#065f46;font-family:'Courier New',monospace;font-size:30px;font-weight:700;letter-spacing:.14em;">${escapeHtml(options.code)}</div>
    </div>` : "";

  const actionHtml = options.action ? `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr>
        <td bgcolor="#059669" style="border-radius:12px;">
          <a href="${escapeHtml(options.action.href)}" style="display:inline-block;padding:15px 24px;color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;">${escapeHtml(options.action.label)} &nbsp;→</a>
        </td>
      </tr>
    </table>` : "";

  const noticeHtml = options.notice ? `
    <div style="margin:24px 0;padding:15px 17px;border-left:4px solid #c39960;border-radius:8px;background:#fffaf2;color:#66533b;font-family:Arial,sans-serif;font-size:14px;line-height:1.55;">${textBlock(options.notice)}</div>` : "";

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${escapeHtml(options.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f8f6f1;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(options.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#f8f6f1;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:620px;border:1px solid #e5e1da;border-radius:20px;background:#ffffff;overflow:hidden;box-shadow:0 10px 30px rgba(26,26,26,.06);">
            <tr>
              <td style="padding:12px 34px;background:#065f46;color:#ffffff;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;">${escapeHtml(eyebrow)}</td>
            </tr>
            <tr>
              <td style="padding:34px 34px 28px;">
                <h1 style="margin:0 0 20px;color:#1a1a1a;font-family:Arial,sans-serif;font-size:29px;line-height:1.2;letter-spacing:-.02em;">${escapeHtml(options.title)}</h1>
                ${options.greeting ? `<p style="margin:0 0 18px;color:#1a1a1a;font-family:Arial,sans-serif;font-size:17px;font-weight:700;line-height:1.5;">${escapeHtml(options.greeting)}</p>` : ""}
                ${paragraphsHtml}
                ${detailsHtml}
                ${codeHtml}
                ${actionHtml}
                ${noticeHtml}
                <p style="margin:28px 0 0;color:#1a1a1a;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;">À bientôt sur la route,<br><strong>${escapeHtml(signature)}</strong></p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 34px;background:#1a1a1a;color:#cfcfcf;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;text-align:center;">
                Des lieux vérifiés, une carte membre et des avantages pour voyager autrement.<br>
                <a href="${escapeHtml(appUrl)}" style="color:#d0ad7d;text-decoration:none;font-weight:700;">labelvanlife.fr</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
