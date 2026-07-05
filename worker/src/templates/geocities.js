// 90s Web template: GeoCities/Netscape nostalgia. Table layout, marquee banner,
// sidebar nav, Times New Roman, beveled buttons. Converted from the 90s Web design.
//
// Uses only real content fields — the fake retro chrome (visitor counter, web
// rings, awards, guestbook) is dropped since it maps to no data.
// Light-only (a dark 90s page would be inauthentic). Accent options recolor
// the banner links and highlights; the navy/silver frame is intrinsic.

import { esc, faviconHref, metaTags } from "./_helpers.js";

export const accents = {
  navy: "#000080",
  maroon: "#800000",
  teal: "#008080",
  purple: "#4B0082",
  green: "#006400",
};
export const SIGNATURE_ACCENT = "navy";

export function render(content, scheme, meta = {}) {
  const accentKey = (meta.accent && accents[meta.accent]) ? meta.accent : SIGNATURE_ACCENT;
  const bar = accents[accentKey];        // banner / section-bar color
  const url = meta.url || "";
  const t = content.section_titles || {};
  const title = {
    about: t.about || "About Me",
    projects: t.projects || "My Projects",
    stack: t.stack || "My Tech Stack",
    experience: t.experience || "Work Experience",
    contact: t.contact || "Contact",
  };

  const name = content.identity.name;
  const firstLetter = name[0].toUpperCase();

  // Sidebar nav — only sections we have.
  const navRows = [];
  navRows.push(["\u{1F3E0}", "Home", "#top"]);
  if (content.about) navRows.push(["\u{1F464}", title.about, "#about"]);
  if (content.projects?.length) navRows.push(["\u{1F4BB}", title.projects, "#projects"]);
  if (content.stack?.length) navRows.push(["\u{1F527}", title.stack, "#stack"]);
  if (content.experience?.length) navRows.push(["\u{1F4BC}", title.experience, "#experience"]);
  if (content.contacts?.length) navRows.push(["\u{2709}", title.contact, "#contact"]);
  const navLinks = navRows.map(([icon, label, href]) =>
    `<div style="padding:6px 12px;"><a href="${href}" style="color:#0000EE;font-size:15px;">${icon} ${esc(label)}</a></div>`
  ).join("");

  // Projects table.
  const projects = (content.projects || []).slice(0, 3);
  const projectRows = projects.map((p, i) => {
    const stripe = i % 2 === 0 ? "#FFFFFF" : "#E8E8E8";
    const primaryUrl = p.primary_link === "live" ? (p.live_url || p.repo_url) : (p.repo_url || p.live_url);
    const tech = (p.tags || []).slice(0, 4).join(", ");
    return `
      <tr style="background:${stripe};">
        <td style="padding:6px 10px;border:1px solid #808080;"><strong><a href="${esc(primaryUrl || "#")}">${esc(p.title)}</a></strong>${i === 0 ? ` <span style="color:#FF0000;font-size:11px;font-weight:bold;animation:blink 1s step-end infinite;">NEW!</span>` : ""}</td>
        <td style="padding:6px 10px;border:1px solid #808080;">${esc(p.description || "")}</td>
        <td style="padding:6px 10px;border:1px solid #808080;font-family:'Courier New',monospace;font-size:12px;">${esc(tech)}</td>
        <td align="center" style="padding:6px 10px;border:1px solid #808080;"><a href="${esc(primaryUrl || "#")}">[VIEW]</a></td>
      </tr>`;
  }).join("");

  // Stack — beveled silver buttons.
  const stackButtons = (content.stack || []).map((s) =>
    `<td><table border="2" cellpadding="4" style="border-style:outset;background:#C0C0C0;"><tr><td style="font-size:13px;font-family:'Times New Roman',serif;">${esc(s.name)}</td></tr></table></td>`
  ).join("");

  // Experience table.
  const exp = content.experience || [];
  const experienceRows = exp.map((e, i) => {
    const sep = i < exp.length - 1 ? `<tr><td colspan="2" style="padding:4px 0;"><hr style="margin:4px 0;border:none;border-top:1px solid #D0D0D0;"></td></tr>` : "";
    return `
      <tr>
        <td width="130" valign="top" style="color:#808080;font-size:13px;white-space:nowrap;padding:4px;">${esc(e.period || "")}</td>
        <td valign="top" style="padding:4px;"><strong>${esc(e.role)}</strong>${e.organisation ? ` @ ${esc(e.organisation)}` : ""}<br><span style="font-size:13px;color:#444444;">${esc(e.description || "")}</span></td>
      </tr>${sep}`;
  }).join("");

  // Contact rows.
  const contactRows = (content.contacts || []).map((ct) =>
    `<tr><td style="padding:4px 10px;font-weight:bold;color:${bar};">${esc(ct.label)}:</td><td style="padding:4px 10px;"><a href="${esc(ct.value)}">${esc(ct.value.replace(/^(mailto:|tel:|https?:\/\/)/, ""))}</a></td></tr>`
  ).join("");

  const footerSocials = (content.socials || []).map((s) =>
    `<a href="${esc(s.url)}" style="color:#FFFF00;">${esc(s.platform)}</a>`
  ).join(" &nbsp;|&nbsp; ");

  const sectionBar = (label) => `<div style="background:${bar};color:#FFFFFF;padding:5px 10px;font-weight:bold;font-size:15px;margin-bottom:10px;">${esc(label)}</div>`;
  const hr = `<hr style="border:none;border-top:2px inset #808080;margin:16px 0;">`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)}'s Home Page</title>
<link rel="icon" href="${faviconHref(content, bar)}">
${metaTags(content, url)}
<style>
  body { margin:0; background:#C0C0C0; font-family:'Times New Roman',Times,serif; font-size:16px; color:#000000; }
  a { color:#0000EE; text-decoration:underline; }
  a:visited { color:#551A8B; }
  a:active { color:#FF0000; }
  * { box-sizing:border-box; }
  @keyframes blink { 0%,49%{visibility:visible} 50%,100%{visibility:hidden} }
  @keyframes marqueeScroll { from{transform:translateX(100%)} to{transform:translateX(-100%)} }
  html { scroll-behavior:smooth; }
  .frame { width:820px; max-width:100%; margin:0 auto; background:#FFFFFF; min-height:100vh; }
  @media (max-width:760px) {
    .layout { display:block !important; }
    .sidebar { width:100% !important; border-right:none !important; border-bottom:3px solid #808080; }
  }
</style>
</head>
<body>
<a id="top"></a>
<div class="frame">

  <!-- marquee banner -->
  <div style="background:${bar};padding:10px 12px;overflow:hidden;white-space:nowrap;">
    <div style="display:inline-block;animation:marqueeScroll 22s linear infinite;font-size:13px;color:#FFFF00;letter-spacing:1px;">
      \u{2605} WELCOME TO ${esc(name.toUpperCase())}'S HOMEPAGE \u{2605} &nbsp;&nbsp;&nbsp; BEST VIEWED IN NETSCAPE NAVIGATOR 4.0 AT 800\u00d7600 &nbsp;&nbsp;&nbsp; \u{2605} THIS PAGE IS FRAMES-FREE! \u{2605} &nbsp;&nbsp;&nbsp;
    </div>
  </div>

  <!-- header -->
  <div style="background:${bar};border-bottom:4px solid #FF0000;padding:16px 18px;">
    <div style="font-size:32px;font-weight:bold;color:#FFFFFF;letter-spacing:-1px;text-shadow:2px 2px #000000;">${esc(name)}'s Home Page</div>
    ${content.identity.tagline ? `<div style="font-size:13px;color:#FFFF00;margin-top:4px;">\u{2605} ${esc(content.identity.tagline)} \u{2605}</div>` : ""}
  </div>

  <!-- layout: sidebar + main -->
  <div class="layout" style="display:flex;">
    <div class="sidebar" style="width:170px;flex-shrink:0;background:#C0C0C0;border-right:3px solid #808080;padding:10px 0;">
      <div style="background:${bar};color:#FFFFFF;text-align:center;font-weight:bold;padding:4px;margin:0 8px 8px;border:2px outset #C0C0C0;">NAVIGATION</div>
      ${navLinks}
      ${content.socials?.length ? `
      <div style="background:${bar};color:#FFFFFF;text-align:center;font-weight:bold;padding:4px;margin:16px 8px 8px;border:2px outset #C0C0C0;">LINKS</div>
      ${content.socials.map((s) => `<div style="padding:5px 12px;"><a href="${esc(s.url)}" style="color:#0000EE;font-size:14px;">${esc(s.platform)}</a></div>`).join("")}` : ""}
      <div style="margin:16px 8px 0;border:2px solid #FF0000;background:#FFFF00;padding:8px;text-align:center;font-size:12px;font-weight:bold;color:#FF0000;">\u{1F6A7} UNDER CONSTRUCTION \u{1F6A7}</div>
    </div>

    <div style="flex:1;min-width:0;padding:16px 20px;background:#FFFFFF;">

      <div style="background:${bar};color:#FFFFFF;padding:6px 12px;font-weight:bold;margin-bottom:12px;">Welcome to My Page!</div>
      ${content.about ? `<p style="line-height:1.6;margin:0 0 12px;">Hi! My name is <strong>${esc(name)}</strong>${content.identity.tagline ? ` and I'm a ${esc(content.identity.tagline)}` : ""}. ${esc(content.about)} <span style="color:#FF0000;font-weight:bold;">NEW!</span></p>` : ""}

      ${content.about ? `${hr}<a id="about"></a>${sectionBar(title.about)}
      <table border="0" cellpadding="4" cellspacing="0" style="font-size:15px;margin-bottom:6px;">
        <tr><td valign="top" width="150" style="padding-right:16px;">
          <div style="width:130px;height:150px;border:2px inset #808080;background:#C0C0C0;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;">
            ${content.identity.avatar_url ? `<img src="${esc(content.identity.avatar_url)}" alt="${esc(name)}" style="width:100%;height:120px;object-fit:cover;">` : `<div style="font-size:56px;color:#808080;">\u{1F464}</div>`}
            <div style="font-size:11px;font-weight:bold;text-align:center;padding:4px;">${esc(name)}</div>
          </div>
        </td>
        <td valign="top">
          <table border="0" cellpadding="3" style="font-size:15px;">
            <tr><td style="color:${bar};font-weight:bold;padding-right:14px;">Name:</td><td>${esc(name)}</td></tr>
            ${content.identity.tagline ? `<tr><td style="color:${bar};font-weight:bold;">Occupation:</td><td>${esc(content.identity.tagline)}</td></tr>` : ""}
            ${content.contacts?.length ? `<tr><td style="color:${bar};font-weight:bold;">Email:</td><td><a href="${esc(content.contacts[0].value)}">${esc(content.contacts[0].value.replace(/^mailto:/, ""))}</a></td></tr>` : ""}
          </table>
        </td></tr>
      </table>` : ""}

      ${projects.length ? `${hr}<a id="projects"></a><div style="background:${bar};color:#FFFFFF;padding:5px 10px;font-weight:bold;font-size:15px;margin-bottom:10px;">${esc(title.projects)} <span style="font-size:12px;font-weight:normal;">(click to view!)</span></div>
      <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
        <tr style="background:${bar};color:#FFFFFF;">
          <th align="left" style="padding:6px 10px;border:1px solid #808080;">Project Name</th>
          <th align="left" style="padding:6px 10px;border:1px solid #808080;">Description</th>
          <th align="left" style="padding:6px 10px;border:1px solid #808080;">Tech</th>
          <th align="center" style="padding:6px 10px;border:1px solid #808080;">Link</th>
        </tr>
        ${projectRows}
      </table>` : ""}

      ${content.stack?.length ? `${hr}<a id="stack"></a>${sectionBar(title.stack)}
      <table border="0" cellpadding="4" cellspacing="4"><tr>${stackButtons}</tr></table>` : ""}

      ${exp.length ? `${hr}<a id="experience"></a>${sectionBar(title.experience)}
      <table width="100%" border="0" cellpadding="4" cellspacing="0" style="font-size:14px;">${experienceRows}</table>` : ""}

      ${content.contacts?.length ? `${hr}<a id="contact"></a>${sectionBar(title.contact)}
      <table border="0" cellpadding="4" cellspacing="0" style="font-size:15px;">${contactRows}</table>` : ""}

    </div>
  </div>

  <!-- footer -->
  <div style="background:${bar};border-top:4px solid #FF0000;padding:12px 18px;color:#FFFFFF;font-size:13px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;">
    <span>Copyright \u00a9 ${new Date().getFullYear()} ${esc(name)}. All rights reserved.</span>
    ${footerSocials ? `<span>${footerSocials}</span>` : ""}
  </div>

</div>
</body>
</html>`;
}

// 90s Web 404: navy banner, red 404 box, "What Happened?" list, error table.
export function notFound(scheme) {
  const bar = "#000080";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — Page Not Found</title>
<style>
  body { margin:0; background:#C0C0C0; font-family:'Times New Roman',Times,serif; font-size:16px; color:#000000; }
  a { color:#0000EE; }
  * { box-sizing:border-box; }
  @keyframes marqueeScroll { from{transform:translateX(100%)} to{transform:translateX(-100%)} }
  .frame { width:820px; max-width:100%; margin:0 auto; background:#FFFFFF; min-height:100vh; }
</style>
</head>
<body>
<div class="frame">
  <div style="background:${bar};padding:10px 12px;overflow:hidden;white-space:nowrap;">
    <div style="display:inline-block;animation:marqueeScroll 18s linear infinite;font-size:13px;color:#FF0000;letter-spacing:1px;">
      \u26a0 ERROR 404 — PAGE NOT FOUND \u26a0 &nbsp;&nbsp;&nbsp; THE PAGE YOU REQUESTED DOES NOT EXIST ON THIS SERVER &nbsp;&nbsp;&nbsp; \u26a0 ERROR 404 — PAGE NOT FOUND \u26a0 &nbsp;&nbsp;&nbsp;
    </div>
  </div>
  <div style="background:${bar};border-bottom:4px solid #FF0000;padding:16px 18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
    <div style="font-size:32px;font-weight:bold;color:#FFFFFF;letter-spacing:-1px;text-shadow:2px 2px #000000;">404</div>
    <div style="font-size:28px;font-weight:bold;color:#FF0000;text-shadow:1px 1px #000000;">ERROR!</div>
  </div>
  <div style="padding:20px;">
    <div style="border:3px solid #FF0000;background:#FFFFF0;padding:36px;text-align:center;margin-bottom:20px;">
      <div style="font-size:80px;font-weight:bold;color:#FF0000;text-shadow:3px 3px #800000;line-height:1;">404</div>
      <div style="font-size:24px;font-weight:bold;color:${bar};margin-top:12px;">PAGE NOT FOUND</div>
    </div>
    <div style="background:${bar};color:#FFFFFF;padding:5px 10px;font-weight:bold;margin-bottom:10px;">What Happened?</div>
    <p style="margin:0 0 8px;">The page you are looking for <strong>cannot be found</strong> on this server. This could be because:</p>
    <ul style="line-height:1.8;margin:0 0 16px;">
      <li>The page has been <strong>moved</strong> or <strong>deleted</strong></li>
      <li>You may have <strong>mistyped</strong> the URL</li>
      <li>The link you followed may be <strong>broken</strong></li>
      <li>This section is still <span style="color:#FF0000;font-weight:bold;">UNDER CONSTRUCTION</span></li>
    </ul>
    <div style="background:${bar};color:#FFFFFF;padding:5px 10px;font-weight:bold;margin-bottom:10px;">Return to Safety</div>
    <a href="/" style="display:inline-block;border:2px outset #C0C0C0;background:#C0C0C0;padding:8px 18px;font-weight:bold;color:#000000;text-decoration:none;font-size:15px;">\u{1F3E0} Go Back to Home Page</a>
  </div>
  <div style="background:${bar};border-top:4px solid #FF0000;padding:12px 18px;color:#FFFFFF;font-size:13px;">Best viewed in Netscape Navigator 4.0 at 800\u00d7600</div>
</div>
</body>
</html>`;
}