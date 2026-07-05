// Retro Y2K template: brutalist bordered grid, dual lime/pink accents,
// numbered sections, monospace labels. Converted from the Retro Y2K design.
//
// Carries its own light + dark palette; scheme controls only the primary
// accent (the lime). Dark toggle via vanilla JS. Dotted-grid background.

import { esc, faviconHref, metaTags } from "./_helpers.js";

// Retro's allowed accent options. First is the signature (default).
export const accents = {
  lime: "#C8F500",
  pink: "#FF2D78",
  cyan: "#00E5FF",
  orange: "#FF6B1A",
  violet: "#B47AFF",
};
export const SIGNATURE_ACCENT = "lime";

export function render(content, scheme, meta = {}) {
  // Accent: the user's chosen option for this template, else the signature.
  const accentKey = (meta.accent && accents[meta.accent]) ? meta.accent : SIGNATURE_ACCENT;
  const accent = accents[accentKey];
  const url = meta.url || "";
  // Secondary accent pairs with the primary. If the user chose pink as the
  // primary, use lime as the secondary so the dual-accent look still reads.
  const pink = accentKey === "pink" ? accents.lime : accents.pink;
  const t = content.section_titles || {};
  const title = {
    about: t.about || "About",
    projects: t.projects || "Selected Work",
    stack: t.stack || "Stack",
    experience: t.experience || "Experience",
    contact: t.contact || "Contact",
  };

  const initials = content.identity.name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase();

  // Nav: About, Projects, Contact only.
  const navItems = [];
  if (content.about) navItems.push([title.about, "#about"]);
  if (content.projects?.length) navItems.push([title.projects, "#projects"]);
  if (content.contacts?.length) navItems.push([title.contact, "#contact"]);
  const navLinks = navItems.map(([label, href], i) =>
    `<a href="${href}" class="navlink" style="color:var(--fg-muted);text-decoration:none;font-size:12px;font-weight:500;letter-spacing:0.5px;text-transform:uppercase;padding:6px 14px;border:1px solid var(--border);border-right:none;">${esc(label)}</a>`
  ).join("");


  // Projects: 2-col grid with shared borders (brutalist).
  const projects = (content.projects || []).slice(0, 3);
  const projectCards = projects.map((p, i) => {
    const isRight = i % 2 === 1;
    const isLower = i >= 2;
    const borderStyle = `border:2px solid var(--fg);${isRight ? "border-left:none;" : ""}${isLower ? "border-top:none;" : ""}`;
    const yearColor = i % 2 === 0 ? accent : pink;
    const primaryUrl = p.primary_link === "live" ? (p.live_url || p.repo_url) : (p.repo_url || p.live_url);
    return `
    <a href="${esc(primaryUrl || "#")}" class="pcard" style="${borderStyle}padding:28px 32px;text-decoration:none;display:block;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:12px;">
        <h3 style="font-size:22px;font-weight:700;margin:0;text-transform:uppercase;letter-spacing:-0.5px;color:var(--fg);">${esc(p.title)}</h3>
        <span style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:${yearColor};border:1px solid ${yearColor};padding:2px 7px;text-transform:uppercase;white-space:nowrap;flex-shrink:0;">${p.repo_url ? "CODE" : "LIVE"}</span>
      </div>
      ${p.description ? `<p style="font-size:13.5px;color:var(--fg-muted);line-height:1.7;margin:0 0 20px;">${esc(p.description)}</p>` : ""}
      ${p.tags?.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;">${p.tags.slice(0, 4).map((tag) => `<span style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--fg-muted);border:1px solid var(--border);padding:2px 8px;">${esc(tag)}</span>`).join("")}</div>` : ""}
    </a>`;
  }).join("");

  // Stack: connected chip grid.
  const stackChips = (content.stack || []).map((s) =>
    `<span class="chip" style="border:1px solid var(--border);padding:9px 18px;font-size:13px;font-weight:500;color:var(--fg);margin:0 -1px -1px 0;">${esc(s.name)}</span>`
  ).join("");

  // Experience: bordered rows, 160px date column.
  const exp = content.experience || [];
  const experienceRows = exp.map((e, i) => {
    const isLast = i === exp.length - 1;
    const faded = isLast && exp.length > 2;
    const dateColor = i % 2 === 0 ? accent : pink;
    return `
    <div class="xprow" style="display:grid;grid-template-columns:160px 1fr;gap:0;border:2px solid var(--fg);margin-bottom:-2px;${faded ? "opacity:0.65;" : ""}">
      <div style="border-right:2px solid var(--fg);padding:20px 22px;">
        <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:${faded ? "var(--fg-muted)" : dateColor};">${esc(e.period || "")}</div>
        <div style="font-size:16px;font-weight:700;margin-top:8px;color:var(--fg);text-transform:uppercase;">${esc(e.organisation || "")}</div>
      </div>
      <div style="padding:20px 28px;">
        <h3 style="font-size:15px;font-weight:600;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px;color:var(--fg);">${esc(e.role)}</h3>
        ${e.description ? `<p style="font-size:13px;color:var(--fg-muted);line-height:1.7;margin:0;">${esc(e.description)}</p>` : ""}
      </div>
    </div>`;
  }).join("");

  // Contact + socials for footer.
  const allLinks = [
    ...(content.contacts || []).map((ct) => [ct.label, ct.value]),
    ...(content.socials || []).map((s) => [s.platform, s.url]),
  ];
  const footerLinks = allLinks.map(([label, val], i) =>
    `<a href="${esc(val)}" class="flink" style="font-family:'IBM Plex Mono',monospace;color:var(--fg-muted);font-size:12px;text-decoration:none;border:1px solid var(--border);padding:6px 14px;${i < allLinks.length - 1 ? "border-right:none;" : ""}text-transform:uppercase;letter-spacing:0.5px;">${esc(label)}</a>`
  ).join("");

  const sectionNum = (n, label) => `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:28px;">
      <span style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:${pink};text-transform:uppercase;letter-spacing:2px;">0${n} /</span>
      <h2 style="font-size:26px;font-weight:700;text-transform:uppercase;letter-spacing:-0.5px;margin:0;color:var(--fg);">${esc(label)}</h2>
    </div>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(content.identity.name)}</title>
<link rel="icon" href="${faviconHref(content, accent)}">
${metaTags(content, url)}
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg:#0A0A0A; --fg:#F5F5F0; --fg-muted:#666660;
    --border:#222220; --card-bg:#111110;
    --accent:${accent}; --accent-dim:${accent}1f;
  }
  [data-theme="light"] {
    --bg:#F5F5F0; --fg:#0A0A0A; --fg-muted:#888880;
    --border:#D0D0C8; --card-bg:#EEEEE8;
  }
  * { box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body {
    margin:0; color:var(--fg); font-family:'Space Grotesk',sans-serif;
    background-color:var(--bg);
    background-image:radial-gradient(circle,${accent}12 1px,transparent 1px);
    background-size:24px 24px;
    transition:background-color .3s,color .3s;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  section { scroll-margin-top:60px; }
  .navlink:hover, .flink:hover { color:var(--accent); border-color:var(--accent); }
  .pcard:hover { background:var(--accent-dim); }
  .chip:hover { border-color:var(--accent); color:var(--accent); }
  .xprow:hover { background:var(--card-bg); }
  .toggle:hover { color:var(--accent); border-color:var(--accent); }
  .contactbtn:hover { background:var(--accent); color:#0A0A0A; border-color:var(--accent); }
  @media (max-width:640px) {
    .hero-grid { grid-template-columns:1fr !important; }
    .about-grid { grid-template-columns:1fr !important; gap:28px !important; }
    .proj-grid { grid-template-columns:1fr !important; }
    .pcard { border-left:2px solid var(--fg) !important; border-top:2px solid var(--fg) !important; margin-bottom:-2px; }
    .navlink { display:none; }
    .xprow { grid-template-columns:1fr !important; }
    .xprow > div:first-child { border-right:none !important; border-bottom:2px solid var(--fg); }
  }
</style>
</head>
<body>
<div style="min-height:100vh;animation:fadeIn .4s ease-out;">

  <header style="border-bottom:2px solid var(--border);padding:0 clamp(24px,6vw,72px);display:flex;align-items:center;justify-content:space-between;height:60px;background:var(--bg);position:sticky;top:0;z-index:100;">
    <div style="display:flex;align-items:center;gap:20px;">
      <span style="font-size:18px;font-weight:700;letter-spacing:-0.5px;color:var(--fg);">${esc(content.identity.name.toUpperCase())}</span>
    </div>
    <div style="display:flex;gap:0;align-items:center;">
      ${navLinks}
      <button class="toggle" onclick="tt()" id="tglabel" style="background:var(--card-bg);border:1px solid var(--border);color:var(--fg-muted);padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer;font-family:'IBM Plex Mono',monospace;letter-spacing:0.5px;text-transform:uppercase;">LIGHT</button>
    </div>
  </header>

  <section style="padding:clamp(60px,10vw,100px) clamp(24px,6vw,72px) 60px;border-bottom:2px solid var(--border);">
    <div class="hero-grid" style="max-width:1100px;">
      <div>
        <p style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--accent);text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">// Hello, I'm</p>
        <h1 style="font-size:clamp(38px,8vw,100px);font-weight:700;line-height:0.95;letter-spacing:-3px;margin:0 0 20px;color:var(--fg);text-transform:uppercase;overflow-wrap:break-word;">${esc(content.identity.name)}.</h1>
        ${content.identity.tagline ? `<p style="font-size:18px;color:var(--fg);font-weight:600;margin:0 0 36px;max-width:480px;line-height:1.5;">${esc(content.identity.tagline)}</p>` : ""}
        <div style="display:flex;gap:0;flex-wrap:wrap;">
          ${content.contacts?.length ? `<a href="#contact" style="background:var(--accent);color:#0A0A0A;padding:12px 24px;text-decoration:none;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Get in touch →</a>` : ""}
          ${projects.length ? `<a href="#projects" style="background:transparent;border:2px solid var(--fg);color:var(--fg);padding:10px 24px;text-decoration:none;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-left:-2px;">View work →</a>` : ""}
        </div>
      </div>
    </div>
  </section>

  ${content.about ? `<section id="about" style="padding:60px clamp(24px,6vw,72px);border-bottom:2px solid var(--border);">
    <div style="max-width:1100px;">
      ${sectionNum(1, title.about)}
      <div class="about-grid" style="display:grid;grid-template-columns:2fr 1fr;gap:60px;align-items:start;">
        <p style="font-size:17px;color:var(--fg-muted);line-height:1.75;margin:0;font-weight:400;">${esc(content.about)}</p>
        ${content.experience?.length ? `<div style="border:2px solid var(--border);padding:20px 24px;background:var(--card-bg);">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:var(--fg-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Prev. employers</div>
          ${[...new Set(content.experience.map((e) => e.organisation).filter(Boolean))].slice(0, 3).map((org) => `<div style="font-size:15px;font-weight:600;color:var(--accent);margin-bottom:6px;">${esc(org)}</div>`).join("")}
        </div>` : ""}
      </div>
    </div>
  </section>` : ""}

  ${projects.length ? `<section id="projects" style="padding:60px clamp(24px,6vw,72px);border-bottom:2px solid var(--border);">
    <div style="max-width:1100px;">
      ${sectionNum(2, title.projects)}
      <div class="proj-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:0;">${projectCards}</div>
    </div>
  </section>` : ""}

  ${content.stack?.length ? `<section id="stack" style="padding:60px clamp(24px,6vw,72px);border-bottom:2px solid var(--border);">
    <div style="max-width:1100px;">
      ${sectionNum(3, title.stack)}
      <div style="display:flex;flex-wrap:wrap;gap:0;">${stackChips}</div>
    </div>
  </section>` : ""}

  ${exp.length ? `<section id="experience" style="padding:60px clamp(24px,6vw,72px);border-bottom:2px solid var(--border);">
    <div style="max-width:1100px;">
      ${sectionNum(4, title.experience)}
      <div>${experienceRows}</div>
    </div>
  </section>` : ""}

  ${content.contacts?.length ? `<section id="contact" style="padding:60px clamp(24px,6vw,72px);border-bottom:2px solid var(--border);">
    <div style="max-width:1100px;">
      ${sectionNum(5, title.contact)}
      <div style="display:flex;flex-wrap:wrap;gap:0;">
        ${content.contacts.map((ct) =>
          `<a href="${esc(ct.value)}" class="contactbtn" style="border:2px solid var(--fg);color:var(--fg);padding:16px 28px;text-decoration:none;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 -2px -2px 0;display:inline-flex;align-items:center;gap:10px;">${esc(ct.label)} →</a>`
        ).join("")}
      </div>
    </div>
  </section>` : ""}

  <footer style="padding:24px clamp(24px,6vw,72px);display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;">
    <span style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--fg-muted);">© ${esc(content.identity.name.toUpperCase())}</span>
    <div style="display:flex;gap:0;">${footerLinks}</div>
  </footer>

</div>

<script>
  function tt(){
    var light = document.documentElement.getAttribute('data-theme') === 'light';
    setTheme(light ? 'dark' : 'light');
  }
  function setTheme(mode){
    if (mode === 'light') document.documentElement.setAttribute('data-theme','light');
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('theme', mode); } catch(e){}
    var b = document.getElementById('tglabel');
    if (b) b.textContent = mode === 'light' ? 'DARK' : 'LIGHT';
  }
  (function(){
    var saved = 'dark';
    try { saved = localStorage.getItem('theme') || 'dark'; } catch(e){}
    setTheme(saved);
  })();
</script>
</body>
</html>`;
}

// Retro Y2K 404: marquee banner, glitch, SYSTEM STATUS box.
export function notFound(scheme) {
  const accent = scheme.colors.accent;
  const pink = "#FF2D78";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — Page not found</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root { --bg:#0A0A0A; --fg:#F5F5F0; --fg-muted:#666660; --border:#222220; --card-bg:#111110; --accent:${accent}; }
  * { box-sizing:border-box; }
  body { margin:0; min-height:100vh; color:var(--fg); font-family:'Space Grotesk',sans-serif; background-color:var(--bg); background-image:radial-gradient(circle,${accent}12 1px,transparent 1px); background-size:24px 24px; display:flex; flex-direction:column; }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes glitchBar { 0%,90%,100%{opacity:0} 91%,93%{opacity:1;transform:translateY(-3px)} 92%{transform:translateY(3px)} }
</style>
</head>
<body>
  <header style="border-bottom:2px solid var(--border);padding:0 clamp(24px,6vw,72px);display:flex;align-items:center;gap:20px;height:60px;">
    <span style="font-size:18px;font-weight:700;letter-spacing:-0.5px;">404</span>
    <span style="background:${pink};color:#fff;font-size:10px;font-weight:700;letter-spacing:1.5px;padding:3px 8px;text-transform:uppercase;font-family:'IBM Plex Mono',monospace;">ERR</span>
  </header>
  <div style="border-bottom:2px solid var(--border);background:var(--card-bg);overflow:hidden;white-space:nowrap;padding:8px 0;">
    <div style="display:inline-flex;animation:marquee 18s linear infinite;">
      ${Array(4).fill(0).map((_, i) => `<span style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:${i % 2 ? accent : pink};letter-spacing:1px;text-transform:uppercase;padding:0 32px;">ERROR 404 — PAGE NOT FOUND —</span>`).join("")}
    </div>
  </div>
  <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:clamp(40px,8vw,80px) clamp(24px,6vw,72px);">
    <div style="max-width:700px;width:100%;">
      <div style="position:relative;margin-bottom:24px;">
        <h1 style="font-size:clamp(100px,20vw,200px);font-weight:700;line-height:0.85;letter-spacing:-8px;margin:0;color:var(--fg);text-transform:uppercase;">404.</h1>
        <div style="position:absolute;inset:0;font-size:clamp(100px,20vw,200px);font-weight:700;line-height:0.85;letter-spacing:-8px;color:${pink};opacity:0;text-transform:uppercase;animation:glitchBar 5s ease-in-out infinite;">404.</div>
      </div>
      <div style="border:2px solid var(--fg);padding:24px 28px;background:var(--card-bg);margin-bottom:24px;">
        <div style="font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:var(--fg-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">[ SYSTEM STATUS ]</div>
        <div style="display:grid;grid-template-columns:max-content 1fr;gap:6px 28px;font-family:'IBM Plex Mono',monospace;font-size:12.5px;">
          <span style="color:var(--fg-muted);">CODE</span><span style="color:${pink};">404</span>
          <span style="color:var(--fg-muted);">MSG</span><span style="color:var(--fg);">PAGE_NOT_FOUND</span>
          <span style="color:var(--fg-muted);">ACTION</span><span style="color:var(--accent);">RETURN_HOME</span>
        </div>
      </div>
      <p style="font-size:16px;color:var(--fg-muted);margin:0 0 32px;line-height:1.7;">This URL doesn't resolve to anything. It might have been moved, deleted, or you took a wrong turn somewhere.</p>
      <a href="/" style="background:var(--accent);color:#0A0A0A;padding:12px 24px;text-decoration:none;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;display:inline-block;">Back to home →</a>
    </div>
  </div>
</body>
</html>`;
}