// Minimal template: clean, typographic, ultra-light Geist. Lots of whitespace,
// inline project rows, dark toggle. Converted from the Minimal design.
//
// Own light + dark palette; scheme controls the primary accent (used sparingly
// — the status dot and a couple of highlights). Toggle flips light/dark.

import { esc, faviconHref, metaTags } from "./_helpers.js";

export const accents = {
  green: "#22C55E",
  blue: "#3B82F6",
  violet: "#8B5CF6",
  amber: "#F59E0B",
  rose: "#F43F5E",
};
export const SIGNATURE_ACCENT = "green";

export function render(content, scheme, meta = {}) {
  const accentKey = (meta.accent && accents[meta.accent]) ? meta.accent : SIGNATURE_ACCENT;
  const a = accents[accentKey];
  const url = meta.url || "";
  const t = content.section_titles || {};
  const title = {
    about: t.about || "About",
    projects: t.projects || "Selected work",
    stack: t.stack || "Stack",
    experience: t.experience || "Experience",
    contact: t.contact || "Contact",
  };

  const navFirst = content.identity.name;

  // Nav: About, Work, Contact.
  const navItems = [];
  if (content.about) navItems.push([title.about, "#about"]);
  if (content.projects?.length) navItems.push(["Work", "#projects"]);
  if (content.contacts?.length) navItems.push([title.contact, "#contact"]);
  const navLinks = navItems.map(([label, href]) =>
    `<a href="${href}" class="navlink" style="font-size:13px;color:var(--muted);text-decoration:none;">${esc(label)}</a>`
  ).join("");

  // Projects as inline rows: year · name · description · tech.
  const projects = (content.projects || []).slice(0, 3);
  const projectRows = projects.map((p, i) => {
    const isLast = i === projects.length - 1;
    const primaryUrl = p.primary_link === "live" ? (p.live_url || p.repo_url) : (p.repo_url || p.live_url);
    const tech = (p.tags || []).slice(0, 2).join(" · ");
    return `
    <a href="${esc(primaryUrl || "#")}" class="projrow" style="display:grid;grid-template-columns:80px 1fr auto;gap:40px;align-items:baseline;padding:28px 0;${isLast ? "" : "border-bottom:1px solid var(--border);"}text-decoration:none;color:inherit;">
      <span style="font-size:12px;color:var(--muted);"></span>
      <div>
        <span style="font-size:17px;font-weight:400;letter-spacing:-0.4px;">${esc(p.title)}</span>
        ${p.description ? `<span style="font-size:13px;color:var(--muted);margin-left:16px;">${esc(p.description)}</span>` : ""}
      </div>
      ${tech ? `<span style="font-size:13px;color:var(--muted);white-space:nowrap;">${esc(tech)}</span>` : "<span></span>"}
    </a>`;
  }).join("");

  // About detail rows — only real, derivable facts.
  const detailRows = [];
  if (content.stack?.length) {
    detailRows.push(["Focus", content.stack.slice(0, 2).map((s) => s.name).join(" · ")]);
  }
  const detailsHtml = detailRows.map(([k, v], i) =>
    `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:14px 0;${i < detailRows.length - 1 ? "border-bottom:1px solid var(--border);" : ""}">
      <span style="font-size:12px;color:var(--muted);">${esc(k)}</span>
      <span style="font-size:13px;">${esc(v)}</span>
    </div>`
  ).join("");

  // Experience.
  const exp = content.experience || [];
  const experienceRows = exp.map((e, i) => {
    const isLast = i === exp.length - 1;
    return `
    <div style="display:grid;grid-template-columns:140px 1fr;gap:24px;padding:28px 0;${isLast ? "" : "border-bottom:1px solid var(--border);"}">
      <span style="font-size:12px;color:var(--muted);padding-top:2px;">${esc(e.period || "")}</span>
      <div>
        <p style="font-size:15px;font-weight:400;margin:0 0 4px;letter-spacing:-0.3px;">${esc(e.role)}</p>
        ${e.organisation ? `<p style="font-size:13px;color:var(--muted);margin:0 0 12px;">${esc(e.organisation)}</p>` : ""}
        ${e.description ? `<p style="font-size:13px;color:var(--muted);line-height:1.75;margin:0;">${esc(e.description)}</p>` : ""}
      </div>
    </div>`;
  }).join("");

  // Contact rows — contacts + socials, each a row with a label.
  const contactLinks = [
    ...(content.contacts || []).map((ct) => [ct.value.replace(/^(mailto:|tel:|https?:\/\/)/, ""), ct.label, ct.value]),
    ...(content.socials || []).map((s) => [s.url.replace(/^https?:\/\//, ""), s.platform, s.url]),
  ];
  const contactRows = contactLinks.map(([display, label, href], i) =>
    `<a href="${esc(href)}" class="projrow" style="display:flex;justify-content:space-between;align-items:center;padding:20px 0;${i < contactLinks.length - 1 ? "border-bottom:1px solid var(--border);" : ""}text-decoration:none;color:var(--fg);font-size:14px;">
      <span>${esc(display)}</span>
      <span style="color:var(--muted);">${esc(label)} ↗</span>
    </a>`
  ).join("");

  const sectionLabel = (label) => `<p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin:0 0 48px;font-weight:400;">${esc(label)}</p>`;
  const divider = `<div style="border-top:1px solid var(--border);margin:0 clamp(24px,8vw,120px);"></div>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(content.identity.name)}</title>
<link rel="icon" href="${faviconHref(content, a)}">
${metaTags(content, url)}
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root { --bg:#fff; --fg:#0a0a0a; --muted:#999; --border:#e8e8e8; --accent:${a}; }
  [data-theme="dark"] { --bg:#0a0a0a; --fg:#f0f0ee; --muted:#666; --border:#1e1e1e; }
  * { box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { margin:0; background:var(--bg); color:var(--fg); font-family:'Geist',system-ui,sans-serif; font-weight:300; transition:background .25s,color .25s; }
  section { scroll-margin-top:70px; }
  .navlink:hover { color:var(--fg) !important; }
  .projrow:hover { opacity:0.45; transition:opacity .15s; }
  .toggle:hover { color:var(--fg) !important; border-color:var(--fg) !important; }
  @media (max-width:640px) {
    .navlink { display:none; }
    .about-grid { grid-template-columns:1fr !important; gap:40px !important; }
    .projrow { grid-template-columns:1fr !important; gap:6px !important; }
    .projrow span:last-child { text-align:left !important; }
    .exp-row { grid-template-columns:1fr !important; gap:6px !important; }
  }
</style>
</head>
<body>

<nav style="padding:28px clamp(24px,8vw,120px);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;background:var(--bg);transition:background .25s;">
  <span style="font-size:14px;font-weight:500;letter-spacing:-0.3px;">${esc(navFirst)}</span>
  <div style="display:flex;gap:32px;align-items:center;">
    ${navLinks}
    <button class="toggle" onclick="tt()" id="tglabel" style="background:none;border:1px solid var(--border);color:var(--muted);font-size:12px;font-family:inherit;padding:5px 14px;border-radius:100px;cursor:pointer;transition:all .15s;">◑ Dark</button>
  </div>
</nav>

<section style="padding:clamp(60px,10vw,120px) clamp(24px,8vw,120px) clamp(80px,12vw,140px);">
  ${content.contacts?.length ? `<p style="font-size:13px;color:var(--muted);margin:0 0 32px;display:flex;align-items:center;gap:8px;">
    <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${a};flex-shrink:0;"></span>
    Let's connect
  </p>` : ""}
  <h1 style="font-size:clamp(48px,9vw,96px);font-weight:300;letter-spacing:-3px;line-height:0.95;margin:0 0 24px;max-width:900px;">${esc(content.identity.name)}</h1>
  ${content.identity.tagline ? `<p style="font-size:clamp(18px,2.4vw,24px);color:var(--fg);max-width:520px;line-height:1.4;margin:0 0 48px;font-weight:300;letter-spacing:-0.5px;">${esc(content.identity.tagline)}</p>` : ""}
  <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
    ${content.contacts?.length ? `<a href="#contact" style="font-size:14px;font-weight:400;color:var(--bg);background:var(--fg);padding:11px 24px;border-radius:6px;text-decoration:none;">Get in touch</a>` : ""}
    ${projects.length ? `<a href="#projects" class="navlink" style="font-size:14px;color:var(--muted);text-decoration:none;">View work →</a>` : ""}
  </div>
</section>

${content.about ? `${divider}<section id="about" style="padding:clamp(60px,8vw,100px) clamp(24px,8vw,120px);">
  ${sectionLabel(title.about)}
  <div class="about-grid" style="display:grid;grid-template-columns:${detailsHtml ? "1fr 1fr" : "1fr"};gap:80px;max-width:900px;">
    <div>
      <p style="font-size:17px;line-height:1.8;margin:0;color:var(--fg);font-weight:300;">${esc(content.about)}</p>
    </div>
    ${detailsHtml ? `<div style="display:flex;flex-direction:column;">${detailsHtml}</div>` : ""}
  </div>
</section>` : ""}

${projects.length ? `${divider}<section id="projects" style="padding:clamp(60px,8vw,100px) clamp(24px,8vw,120px);">
  ${sectionLabel(title.projects)}
  <div style="display:flex;flex-direction:column;">${projectRows}</div>
</section>` : ""}

${exp.length ? `${divider}<section id="experience" style="padding:clamp(60px,8vw,100px) clamp(24px,8vw,120px);">
  ${sectionLabel(title.experience)}
  <div style="display:flex;flex-direction:column;max-width:640px;">${experienceRows}</div>
</section>` : ""}

${content.contacts?.length ? `${divider}<section id="contact" style="padding:clamp(60px,8vw,100px) clamp(24px,8vw,120px) clamp(80px,12vw,140px);">
  ${sectionLabel(title.contact)}
  <div style="max-width:560px;">
    <h2 style="font-size:clamp(32px,5vw,52px);font-weight:300;letter-spacing:-2px;line-height:1.05;margin:0 0 24px;">Let's work<br>together.</h2>
    <p style="font-size:15px;color:var(--muted);line-height:1.75;margin:0 0 44px;">Have a project in mind or want to chat about a role? I'm always open to interesting conversations.</p>
    <div style="display:flex;flex-direction:column;">${contactRows}</div>
  </div>
</section>` : ""}

${divider}
<footer style="padding:28px clamp(24px,8vw,120px);display:flex;justify-content:space-between;align-items:center;">
  <span style="font-size:12px;color:var(--muted);">© ${new Date().getFullYear()} ${esc(content.identity.name)}</span>
  ${content.socials?.length ? `<div style="display:flex;gap:20px;">${content.socials.map((s) => `<a href="${esc(s.url)}" class="navlink" style="font-size:12px;color:var(--muted);text-decoration:none;">${esc(s.platform)}</a>`).join("")}</div>` : ""}
</footer>

<script>
  function tt(){
    var d = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(d ? 'light' : 'dark');
  }
  function setTheme(mode){
    if (mode === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('theme', mode); } catch(e){}
    var b = document.getElementById('tglabel');
    if (b) b.textContent = mode === 'dark' ? '☀ Light' : '◑ Dark';
  }
  (function(){
    var saved = 'light';
    try { saved = localStorage.getItem('theme') || 'light'; } catch(e){}
    setTheme(saved);
  })();
</script>
</body>
</html>`;
}

// Minimal 404: ultra-light "Page not found.", back-home underline link.
export function notFound(scheme) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — Page not found</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root { --bg:#fff; --fg:#0a0a0a; --muted:#999; --border:#e8e8e8; }
  [data-theme="dark"] { --bg:#0a0a0a; --fg:#f0f0ee; --muted:#666; --border:#1e1e1e; }
  * { box-sizing:border-box; }
  body { margin:0; min-height:100vh; background:var(--bg); color:var(--fg); font-family:'Geist',system-ui,sans-serif; font-weight:300; display:flex; flex-direction:column; transition:background .25s,color .25s; }
  a.back:hover { opacity:0.45; }
</style>
<script>(function(){ try { if ((localStorage.getItem('theme')||'light')==='dark') document.documentElement.setAttribute('data-theme','dark'); } catch(e){} })();</script>
</head>
<body>
  <nav style="padding:28px clamp(24px,8vw,120px);"><span style="font-size:14px;font-weight:500;letter-spacing:-0.3px;">404</span></nav>
  <div style="flex:1;display:flex;align-items:center;padding:0 clamp(24px,8vw,120px) clamp(60px,10vw,120px);">
    <div style="width:100%;">
      <p style="font-size:12px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin:0 0 48px;font-weight:400;">404</p>
      <h1 style="font-size:clamp(52px,10vw,104px);font-weight:300;letter-spacing:-3.5px;line-height:0.95;margin:0 0 40px;">Page not<br>found.</h1>
      <p style="font-size:15px;color:var(--muted);max-width:380px;line-height:1.75;margin:0 0 56px;">This page doesn't exist or has been moved. Head back to the homepage.</p>
      <a href="/" class="back" style="display:inline-flex;align-items:center;gap:10px;font-size:14px;color:var(--fg);text-decoration:none;border-bottom:1px solid var(--fg);padding-bottom:4px;transition:opacity .15s;">← Back home</a>
    </div>
  </div>
</body>
</html>`;
}