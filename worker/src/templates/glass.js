// Glassmorphism template: gradient background, floating blobs, frosted glass
// cards (backdrop-blur), gradient text. Converted from the Glassmorphism design.
//
// Own palette (purple/blue on deep gradient); scheme controls the primary
// accent. Cards lift on hover. Dark-only (glassmorphism is inherently a
// dark, luminous aesthetic).

import { esc, faviconHref, metaTags } from "./_helpers.js";

export const accents = {
  violet: "#A78BFA",
  sky: "#38BDF8",
  rose: "#FB7185",
  emerald: "#34D399",
  amber: "#FBBF24",
};
export const SIGNATURE_ACCENT = "violet";

export function render(content, scheme, meta = {}) {
  const accentKey = (meta.accent && accents[meta.accent]) ? meta.accent : SIGNATURE_ACCENT;
  const a = accents[accentKey];
  const a2 = accentKey === "sky" ? accents.violet : accents.sky; // secondary
  const url = meta.url || "";
  const t = content.section_titles || {};
  const title = {
    about: t.about || "About",
    projects: t.projects || "Projects",
    stack: t.stack || "Stack",
    experience: t.experience || "Experience",
    contact: t.contact || "Contact",
  };

  const rgba = (hex, al) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${al})`; };
  const nameInitials = content.identity.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const firstLetter = content.identity.name[0].toUpperCase();

  const navItems = [];
  if (content.about) navItems.push([title.about, "#about"]);
  if (content.projects?.length) navItems.push([title.projects, "#projects"]);
  if (content.contacts?.length) navItems.push([title.contact, "#contact"]);
  const navLinks = navItems.map(([label, href]) =>
    `<a href="${href}" class="navlink" style="color:var(--fg-muted);text-decoration:none;font-size:14px;">${esc(label)}</a>`
  ).join("");

  // Projects: featured full-width + grid.
  const projects = (content.projects || []).slice(0, 3);
  const projectCards = projects.map((p, i) => {
    const featured = i === 0;
    const col = [a, a2, "#34D399"][i % 3];
    const letter = p.title[0].toUpperCase();
    const primaryUrl = p.primary_link === "live" ? (p.live_url || p.repo_url) : (p.repo_url || p.live_url);
    return `
    <a href="${esc(primaryUrl || "#")}" class="glasscard" style="${featured ? "grid-column:1/-1;" : ""}display:block;text-decoration:none;background:var(--glass-bg);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--glass-border);border-radius:16px;padding:${featured ? "28px 32px" : "24px 28px"};" data-col="${col}">
      ${featured ? `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:20px;">
          <div style="flex:1;min-width:0;">
            <span style="font-size:11px;color:var(--fg-muted);text-transform:uppercase;letter-spacing:1.2px;">Featured</span>
            <h3 style="font-family:'Outfit',sans-serif;font-size:22px;font-weight:600;margin:6px 0 10px;color:var(--fg);">${esc(p.title)}</h3>
            ${p.description ? `<p style="font-size:13.5px;color:var(--fg-muted);line-height:1.65;margin:0;max-width:420px;">${esc(p.description)}</p>` : ""}
          </div>
          <div style="width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,${rgba(a, 0.3)},${rgba(a2, 0.3)});flex-shrink:0;border:1px solid var(--glass-border);display:flex;align-items:center;justify-content:center;font-family:'Outfit',sans-serif;font-size:20px;font-weight:700;color:${a};">${esc(letter)}</div>
        </div>
        ${p.tags?.length ? `<div style="display:flex;gap:6px;margin-top:16px;flex-wrap:wrap;">${p.tags.slice(0, 4).map((tag) => `<span style="background:${rgba(a, 0.14)};border:1px solid ${rgba(a, 0.22)};padding:3px 10px;border-radius:4px;font-size:11.5px;color:${a};">${esc(tag)}</span>`).join("")}</div>` : ""}
      ` : `
        <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,${rgba(col, 0.3)},${rgba(a2, 0.15)});border:1px solid var(--glass-border);display:flex;align-items:center;justify-content:center;font-family:'Outfit',sans-serif;font-size:17px;font-weight:700;color:${col};margin-bottom:14px;">${esc(letter)}</div>
        <h3 style="font-family:'Outfit',sans-serif;font-size:18px;font-weight:600;margin:0 0 8px;color:var(--fg);">${esc(p.title)}</h3>
        ${p.description ? `<p style="font-size:13px;color:var(--fg-muted);line-height:1.65;margin:0 0 14px;">${esc(p.description)}</p>` : ""}
        ${p.tags?.length ? `<span style="background:${rgba(col, 0.12)};border:1px solid ${rgba(col, 0.2)};padding:2px 8px;border-radius:4px;font-size:11px;color:${col};">${esc(p.tags[0])}</span>` : ""}
      `}
    </a>`;
  }).join("");

  const stackChips = (content.stack || []).map((s) =>
    `<span class="chip" style="background:var(--glass-bg);border:1px solid var(--glass-border);backdrop-filter:blur(8px);padding:7px 15px;border-radius:8px;font-size:13px;color:var(--fg);transition:border-color .15s;">${esc(s.name)}</span>`
  ).join("");

  const exp = content.experience || [];
  const experienceRows = exp.map((e, i) => {
    const faded = i === exp.length - 1 && exp.length > 2;
    const orgColor = i % 2 === 0 ? a : a2;
    return `
    <div style="background:var(--glass-bg);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--glass-border);border-radius:16px;padding:24px 28px;display:grid;grid-template-columns:1fr auto;gap:16px;${faded ? "opacity:0.7;" : ""}">
      <div>
        <h3 style="font-family:'Outfit',sans-serif;font-size:16.5px;font-weight:600;margin:0 0 3px;color:var(--fg);">${esc(e.role)}</h3>
        ${e.organisation ? `<p style="font-size:13.5px;color:${faded ? "var(--fg-muted)" : orgColor};margin:0 0 10px;font-weight:500;">${esc(e.organisation)}</p>` : ""}
        ${e.description ? `<p style="font-size:13px;color:var(--fg-muted);line-height:1.7;margin:0;max-width:480px;">${esc(e.description)}</p>` : ""}
      </div>
      ${e.period ? `<span style="font-size:12px;color:var(--fg-muted);white-space:nowrap;padding-top:2px;">${esc(e.period)}</span>` : ""}
    </div>`;
  }).join("");

  const contactButtons = (content.contacts || []).map((ct) =>
    `<a href="${esc(ct.value)}" class="ctabtn" style="background:linear-gradient(135deg,${rgba(a, 0.85)},${rgba(a2, 0.85)});color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:8px;">${esc(ct.label)} →</a>`
  ).join("");

  const footerSocials = (content.socials || []).map((s) =>
    `<a href="${esc(s.url)}" class="navlink" style="color:var(--fg-muted);text-decoration:none;font-size:13px;">${esc(s.platform)}</a>`
  ).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(content.identity.name)}</title>
<link rel="icon" href="${faviconHref(content, a)}">
${metaTags(content, url)}
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --glass-bg:rgba(255,255,255,0.07); --glass-border:rgba(255,255,255,0.11);
    --nav-glass:rgba(11,11,30,0.8); --fg:rgba(255,255,255,0.92); --fg-muted:rgba(255,255,255,0.48);
    --accent:${a}; --accent-2:${a2};
  }
  * { box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { margin:0; background:linear-gradient(135deg,#0B0B1E 0%,#1A0B3E 55%,#0B1A3E 100%); background-attachment:fixed; min-height:100vh; color:var(--fg); font-family:'Nunito',sans-serif; }
  @keyframes gradShift { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
  section { scroll-margin-top:62px; }
  .navlink:hover { color:var(--accent) !important; }
  .glasscard { transition:border-color .2s, transform .2s; }
  .glasscard:hover { transform:translateY(-3px); }
  .chip:hover { border-color:var(--accent) !important; }
  .ctabtn:hover { opacity:0.88; }
  h2.gh { font-family:'Outfit',sans-serif; font-size:26px; font-weight:600; margin:0 0 18px; color:var(--fg); }
  @media (max-width:700px) {
    .navlink[data-nav] { display:none; }
    .about-grid { grid-template-columns:1fr !important; gap:24px !important; }
    .proj-grid { grid-template-columns:1fr !important; }
  }
</style>
</head>
<body>

<div style="position:fixed;top:-200px;right:-200px;width:700px;height:700px;background:radial-gradient(circle,${rgba(a, 0.2)},transparent 70%);pointer-events:none;z-index:0;"></div>
<div style="position:fixed;bottom:-200px;left:-200px;width:600px;height:600px;background:radial-gradient(circle,${rgba(a2, 0.14)},transparent 70%);pointer-events:none;z-index:0;"></div>
<div style="position:fixed;top:35%;right:10%;width:350px;height:350px;background:radial-gradient(circle,rgba(34,197,94,0.07),transparent 70%);pointer-events:none;z-index:0;"></div>

<div style="position:relative;z-index:1;">

  <nav style="position:sticky;top:0;z-index:100;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);background:var(--nav-glass);border-bottom:1px solid var(--glass-border);padding:0 clamp(24px,6vw,72px);display:flex;align-items:center;justify-content:space-between;height:58px;">
    <span style="font-family:'Outfit',sans-serif;font-size:18px;font-weight:700;background:linear-gradient(90deg,${a},${a2});background-clip:text;-webkit-background-clip:text;color:transparent;">${esc(nameInitials)}</span>
    <div style="display:flex;gap:28px;align-items:center;">${navLinks}</div>
  </nav>

  <section style="min-height:88vh;display:flex;align-items:center;justify-content:center;padding:80px clamp(24px,6vw,72px);text-align:center;">
    <div style="max-width:680px;">
      <div style="width:92px;height:92px;border-radius:50%;background:${rgba(a, 0.12)};border:1.5px solid var(--glass-border);margin:0 auto 28px;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 0 0 6px ${rgba(a, 0.1)},0 8px 32px rgba(0,0,0,0.4);">
        ${content.identity.avatar_url
      ? `<img src="${esc(content.identity.avatar_url)}" alt="${esc(content.identity.name)}" style="width:100%;height:100%;object-fit:cover;">`
      : `<span style="font-family:'Outfit',sans-serif;font-size:34px;font-weight:700;color:${a};">${esc(firstLetter)}</span>`}
      </div>
      <h1 style="font-family:'Outfit',sans-serif;font-size:clamp(40px,8vw,72px);font-weight:700;letter-spacing:-2px;margin:0 0 12px;background:linear-gradient(90deg,${a},${a2},${a});background-size:200%;background-clip:text;-webkit-background-clip:text;color:transparent;animation:gradShift 5s linear infinite;">${esc(content.identity.name)}</h1>
      ${content.identity.tagline ? `<p style="font-size:17px;color:var(--fg-muted);margin:0 0 36px;font-weight:400;">${esc(content.identity.tagline)}</p>` : ""}
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        ${content.contacts?.length ? `<a href="#contact" class="ctabtn" style="background:linear-gradient(135deg,${rgba(a, 0.85)},${rgba(a2, 0.85)});color:#fff;padding:12px 26px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Get in touch</a>` : ""}
        ${projects.length ? `<a href="#projects" style="background:var(--glass-bg);border:1px solid var(--glass-border);color:var(--fg);padding:12px 26px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;backdrop-filter:blur(8px);">View projects</a>` : ""}
      </div>
    </div>
  </section>

  ${content.about ? `<section id="about" style="max-width:820px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 60px;">
    <div style="background:var(--glass-bg);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--glass-border);border-radius:20px;padding:36px 44px;">
      <h2 class="gh">${esc(title.about)}</h2>
      <p style="color:var(--fg-muted);font-size:15px;line-height:1.8;margin:0;max-width:640px;">${esc(content.about)}</p>
    </div>
  </section>` : ""}

  ${projects.length ? `<section id="projects" style="max-width:820px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 60px;">
    <h2 class="gh">${esc(title.projects)}</h2>
    <div class="proj-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">${projectCards}</div>
  </section>` : ""}

  ${content.stack?.length ? `<section id="stack" style="max-width:820px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 60px;">
    <h2 class="gh">${esc(title.stack)}</h2>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">${stackChips}</div>
  </section>` : ""}

  ${exp.length ? `<section id="experience" style="max-width:820px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 60px;">
    <h2 class="gh">${esc(title.experience)}</h2>
    <div style="display:flex;flex-direction:column;gap:10px;">${experienceRows}</div>
  </section>` : ""}

  ${content.contacts?.length ? `<section id="contact" style="max-width:820px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 60px;">
    <h2 class="gh">${esc(title.contact)}</h2>
    <div style="display:flex;flex-wrap:wrap;gap:12px;">${contactButtons}</div>
  </section>` : ""}

  <footer style="max-width:820px;margin:0 auto;padding:24px clamp(24px,6vw,72px) 48px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;border-top:1px solid var(--glass-border);">
    <span style="font-family:'Outfit',sans-serif;font-size:14px;background:linear-gradient(90deg,${a},${a2});background-clip:text;-webkit-background-clip:text;color:transparent;font-weight:600;">${esc(content.identity.name)}</span>
    <div style="display:flex;gap:20px;">${footerSocials}</div>
  </footer>

</div>
</body>
</html>`;
}

// Glassmorphism 404: floating gradient 404, glass card, stats row.
export function notFound(scheme) {
  const a = "#A78BFA", a2 = "#38BDF8";
  const rgba = (hex, al) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${al})`; };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — Page not found</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Nunito:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  * { box-sizing:border-box; }
  body { margin:0; min-height:100vh; background:linear-gradient(135deg,#0B0B1E,#1A0B3E 55%,#0B1A3E); background-attachment:fixed; color:rgba(255,255,255,0.92); font-family:'Nunito',sans-serif; display:flex; align-items:center; justify-content:center; padding:40px; }
  @keyframes gradShift { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
</style>
</head>
<body>
  <div style="position:fixed;top:-200px;right:-200px;width:700px;height:700px;background:radial-gradient(circle,${rgba(a,0.2)},transparent 70%);pointer-events:none;"></div>
  <div style="position:fixed;bottom:-200px;left:-200px;width:600px;height:600px;background:radial-gradient(circle,${rgba(a2,0.14)},transparent 70%);pointer-events:none;"></div>
  <div style="position:relative;max-width:520px;width:100%;text-align:center;">
    <h1 style="font-family:'Outfit',sans-serif;font-size:clamp(120px,26vw,220px);font-weight:700;letter-spacing:-6px;margin:0 0 8px;background:linear-gradient(90deg,${a},${a2},${a});background-size:200%;background-clip:text;-webkit-background-clip:text;color:transparent;animation:gradShift 5s linear infinite,float 4s ease-in-out infinite;line-height:0.9;">404</h1>
    <div style="background:rgba(255,255,255,0.07);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.11);border-radius:20px;padding:32px 36px;margin-bottom:24px;">
      <h2 style="font-family:'Outfit',sans-serif;font-size:24px;font-weight:600;margin:0 0 12px;">Page not found</h2>
      <p style="color:rgba(255,255,255,0.48);font-size:15px;line-height:1.7;margin:0;">This page seems to have drifted into the void. Maybe it was moved, deleted, or never existed in the first place.</p>
    </div>
    <a href="/" style="background:linear-gradient(135deg,${rgba(a,0.85)},${rgba(a2,0.85)});color:#fff;padding:13px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">Go home</a>
  </div>
</body>
</html>`;
}