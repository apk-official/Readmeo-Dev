// Organic Pastel template: warm cream background, soft blobs, rounded white
// cards, Playfair serif headings, terracotta/sage/lavender accents.
// Converted from the Organic Pastel design.
//
// Own light palette + a dark variant via toggle. Scheme controls the primary
// accent (terracotta); the sage/lavender secondaries stay for the trio.

import { esc, faviconHref, metaTags } from "./_helpers.js";

export const accents = {
  terracotta: "#C87E6A",
  sage: "#7CB895",
  lavender: "#9B85C4",
  blush: "#D98BA5",
  ochre: "#C9A227",
};
export const SIGNATURE_ACCENT = "terracotta";

export function render(content, scheme, meta = {}) {
  const accentKey = (meta.accent && accents[meta.accent]) ? meta.accent : SIGNATURE_ACCENT;
  const a = accents[accentKey];
  const a2 = "#7CB895", a3 = "#9B85C4"; // sage, lavender secondaries
  const url = meta.url || "";
  const t = content.section_titles || {};
  const title = {
    about: t.about || "About me",
    projects: t.projects || "Projects",
    stack: t.stack || "Stack",
    experience: t.experience || "Experience",
    contact: t.contact || "Contact",
  };

  const rgba = (hex, al) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${al})`; };
  const firstLetter = content.identity.name[0].toUpperCase();
  const navFirst = content.identity.name.split(" ")[0];

  const navItems = [];
  if (content.about) navItems.push([title.about, "#about"]);
  if (content.projects?.length) navItems.push([title.projects, "#projects"]);
  if (content.contacts?.length) navItems.push([title.contact, "#contact"]);
  const navLinks = navItems.map(([label, href]) =>
    `<a href="${href}" class="navlink" style="color:var(--fg-muted);text-decoration:none;font-size:13.5px;">${esc(label)}</a>`
  ).join("");

  const trio = [a, a2, a3];
  const projects = (content.projects || []).slice(0, 3);
  const projectCards = projects.map((p, i) => {
    const featured = i === 0;
    const col = trio[i % 3];
    const letter = p.title[0].toUpperCase();
    const primaryUrl = p.primary_link === "live" ? (p.live_url || p.repo_url) : (p.repo_url || p.live_url);
    return `
    <a href="${esc(primaryUrl || "#")}" class="softcard" style="${featured ? "grid-column:1/-1;" : ""}display:block;text-decoration:none;background:var(--card-bg);border-radius:20px;padding:${featured ? "28px 32px" : "24px 28px"};box-shadow:var(--shadow);border:1px solid var(--border);">
      ${featured ? `
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:20px;">
          <div style="flex:1;min-width:0;">
            <div style="display:inline-flex;align-items:center;background:${rgba(a, 0.1)};padding:3px 10px;border-radius:12px;margin-bottom:12px;">
              <span style="font-size:11px;color:${a};font-weight:500;">Featured</span>
            </div>
            <h3 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:500;margin:0 0 10px;color:var(--fg);">${esc(p.title)}</h3>
            ${p.description ? `<p style="font-size:13.5px;color:var(--fg-muted);line-height:1.7;margin:0;max-width:440px;">${esc(p.description)}</p>` : ""}
          </div>
          ${p.tags?.length ? `<div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;">${p.tags.slice(0, 3).map((tag) => `<span style="background:${rgba(a, 0.1)};color:${a};padding:4px 12px;border-radius:12px;font-size:11.5px;font-weight:500;text-align:center;">${esc(tag)}</span>`).join("")}</div>` : ""}
        </div>
      ` : `
        <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,${rgba(col, 0.3)},${rgba(trio[(i + 1) % 3], 0.2)});display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:18px;font-weight:600;color:${col};margin-bottom:14px;">${esc(letter)}</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:19px;font-weight:500;margin:0 0 8px;color:var(--fg);">${esc(p.title)}</h3>
        ${p.description ? `<p style="font-size:13px;color:var(--fg-muted);line-height:1.7;margin:0 0 14px;">${esc(p.description)}</p>` : ""}
        ${p.tags?.length ? `<div style="display:flex;gap:6px;"><span style="background:${rgba(col, 0.12)};color:${col};padding:3px 10px;border-radius:10px;font-size:11px;font-weight:500;">${esc(p.tags[0])}</span></div>` : ""}
      `}
    </a>`;
  }).join("");

  const stackChips = (content.stack || []).map((s, i) => {
    const col = trio[i % 3];
    return `<span class="chip" style="background:${rgba(col, 0.1)};color:${col};padding:7px 16px;border-radius:20px;font-size:13px;font-weight:500;transition:background .15s;" data-col="${col}">${esc(s.name)}</span>`;
  }).join("");

  const exp = content.experience || [];
  const experienceRows = exp.map((e, i) => {
    const isLast = i === exp.length - 1;
    const dotColor = trio[i % 3];
    return `
    <div style="position:relative;padding:0 0 ${isLast ? "0" : "36px"} 28px;">
      <div style="position:absolute;left:-11px;top:4px;width:18px;height:18px;border-radius:50%;background:${dotColor};box-shadow:0 0 0 4px ${rgba(dotColor, 0.15)};"></div>
      <div style="background:var(--card-bg);border-radius:16px;padding:22px 26px;box-shadow:var(--shadow);border:1px solid var(--border);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;gap:16px;">
          <h3 style="font-family:'Playfair Display',serif;font-size:17px;font-weight:500;margin:0;color:var(--fg);">${esc(e.role)}</h3>
          ${e.period ? `<span style="font-size:12px;color:var(--fg-muted);white-space:nowrap;">${esc(e.period)}</span>` : ""}
        </div>
        ${e.organisation ? `<p style="font-size:13.5px;color:${dotColor};margin:0 0 10px;font-weight:500;">${esc(e.organisation)}</p>` : ""}
        ${e.description ? `<p style="font-size:13px;color:var(--fg-muted);line-height:1.75;margin:0;">${esc(e.description)}</p>` : ""}
      </div>
    </div>`;
  }).join("");

  const contactButtons = (content.contacts || []).map((ct) =>
    `<a href="${esc(ct.value)}" class="pillbtn" style="background:var(--accent);color:#fff;padding:13px 28px;border-radius:40px;text-decoration:none;font-size:13.5px;font-weight:500;box-shadow:0 4px 16px ${rgba(a, 0.3)};display:inline-flex;align-items:center;gap:8px;">${esc(ct.label)} →</a>`
  ).join("");

  const footerSocials = (content.socials || []).map((s) =>
    `<a href="${esc(s.url)}" class="navlink" style="color:var(--fg-muted);text-decoration:none;font-size:13px;">${esc(s.platform)}</a>`
  ).join("");

  const sectionTitle = (label) => `<h2 style="font-family:'Playfair Display',serif;font-size:30px;font-weight:500;letter-spacing:-0.5px;margin:0 0 22px;color:var(--fg);">${esc(label)}</h2>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(content.identity.name)}</title>
<link rel="icon" href="${faviconHref(content, a)}">
${metaTags(content, url)}
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg:#FAF7F2; --fg:#1C1714; --fg-muted:#7A6B63;
    --card-bg:#FFFFFF; --border:rgba(0,0,0,0.07); --shadow:0 2px 16px rgba(0,0,0,0.06);
    --nav-bg:rgba(250,247,242,0.88);
    --accent:${a};
  }
  [data-theme="dark"] {
    --bg:#1A1613; --fg:#F5EFE8; --fg-muted:#A89A90;
    --card-bg:#241E1A; --border:rgba(255,255,255,0.08); --shadow:0 2px 16px rgba(0,0,0,0.3);
    --nav-bg:rgba(26,22,19,0.88);
  }
  * { box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { margin:0; background:var(--bg); color:var(--fg); font-family:'DM Sans',sans-serif; transition:background .3s,color .3s; }
  section { scroll-margin-top:62px; }
  .navlink:hover { color:var(--accent) !important; }
  .softcard { transition:transform .2s, box-shadow .2s; }
  .softcard:hover { transform:translateY(-3px); box-shadow:0 8px 32px rgba(0,0,0,0.09); }
  .pillbtn:hover { opacity:0.88; transform:translateY(-1px); }
  .toggle:hover { border-color:var(--accent); color:var(--accent); }
  @media (max-width:700px) {
    .navlink[data-nav] { display:none; }
    .proj-grid { grid-template-columns:1fr !important; }
    .about-grid { grid-template-columns:1fr !important; gap:24px !important; }
  }
</style>
</head>
<body>

<div style="position:fixed;top:-150px;left:-150px;width:550px;height:550px;background:radial-gradient(circle,${rgba(a, 0.14)},transparent 70%);pointer-events:none;z-index:0;border-radius:50%;"></div>
<div style="position:fixed;bottom:-120px;right:-120px;width:480px;height:480px;background:radial-gradient(circle,${rgba(a2, 0.12)},transparent 70%);pointer-events:none;z-index:0;border-radius:50%;"></div>
<div style="position:fixed;top:50%;left:60%;width:360px;height:360px;background:radial-gradient(circle,${rgba(a3, 0.09)},transparent 70%);pointer-events:none;z-index:0;border-radius:50%;"></div>

<div style="position:relative;z-index:1;min-height:100vh;">

  <nav style="position:sticky;top:0;z-index:100;background:var(--nav-bg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 clamp(24px,6vw,72px);display:flex;align-items:center;justify-content:space-between;height:58px;">
    <span style="font-family:'Playfair Display',serif;font-size:19px;color:var(--fg);letter-spacing:-0.3px;font-style:italic;">${esc(navFirst)}</span>
    <div style="display:flex;gap:24px;align-items:center;">
      ${navLinks}
      <button class="toggle" onclick="tt()" id="tglabel" style="border:1.5px solid ${rgba(a, 0.35)};background:transparent;color:var(--fg-muted);padding:5px 14px;border-radius:20px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;">Dark</button>
    </div>
  </nav>

  <section style="max-width:860px;margin:0 auto;padding:clamp(70px,12vw,120px) clamp(24px,6vw,72px) 80px;display:flex;flex-direction:column;align-items:center;text-align:center;">
    <div style="width:110px;height:110px;border-radius:50%;overflow:hidden;border:3px solid ${rgba(a, 0.28)};box-shadow:0 0 0 6px ${rgba(a, 0.1)},0 8px 32px ${rgba(a, 0.18)};margin-bottom:28px;display:flex;align-items:center;justify-content:center;background:${rgba(a, 0.12)};">
      ${content.identity.avatar_url
      ? `<img src="${esc(content.identity.avatar_url)}" alt="${esc(content.identity.name)}" style="width:100%;height:100%;object-fit:cover;">`
      : `<span style="font-family:'Playfair Display',serif;font-size:44px;font-weight:500;color:${a};">${esc(firstLetter)}</span>`}
    </div>
    ${content.contacts?.length ? `<div style="display:inline-flex;align-items:center;gap:7px;background:${rgba(a2, 0.15)};border:1px solid ${rgba(a2, 0.3)};padding:5px 14px;border-radius:20px;margin-bottom:20px;">
      <div style="width:6px;height:6px;border-radius:50%;background:${a2};"></div>
      <span style="font-size:12.5px;color:${a2};font-weight:500;">Let's connect</span>
    </div>` : ""}
    <h1 style="font-family:'Playfair Display',serif;font-size:clamp(40px,8vw,72px);line-height:1.05;letter-spacing:-1.5px;margin:0 0 18px;font-weight:500;color:var(--fg);">${esc(content.identity.name)}</h1>
    ${content.identity.tagline ? `<p style="font-size:18px;color:var(--fg-muted);margin:0 0 36px;font-weight:300;max-width:480px;line-height:1.65;">${esc(content.identity.tagline)}</p>` : ""}
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
      ${content.contacts?.length ? `<a href="#contact" class="pillbtn" style="background:var(--accent);color:#fff;padding:12px 26px;border-radius:40px;text-decoration:none;font-size:13.5px;font-weight:500;box-shadow:0 4px 16px ${rgba(a, 0.3)};">Get in touch</a>` : ""}
      ${projects.length ? `<a href="#projects" style="border:1.5px solid ${rgba(a, 0.35)};color:var(--accent);padding:12px 26px;border-radius:40px;text-decoration:none;font-size:13.5px;font-weight:500;background:transparent;">View work</a>` : ""}
    </div>
  </section>

  ${content.about ? `<section id="about" style="max-width:860px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 70px;">
    <div style="background:var(--card-bg);border-radius:24px;padding:40px 44px;box-shadow:var(--shadow);border:1px solid var(--border);">
      ${sectionTitle(title.about)}
      <p style="color:var(--fg-muted);font-size:15px;line-height:1.85;margin:0;max-width:640px;">${esc(content.about)}</p>
    </div>
  </section>` : ""}

  ${projects.length ? `<section id="projects" style="max-width:860px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 70px;">
    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:20px;padding:0 4px;">
      ${sectionTitle(title.projects)}
      <span style="font-size:12.5px;color:var(--fg-muted);">Selected work</span>
    </div>
    <div class="proj-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">${projectCards}</div>
  </section>` : ""}

  ${content.stack?.length ? `<section id="stack" style="max-width:860px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 70px;">
    <div style="background:var(--card-bg);border-radius:24px;padding:32px 40px;box-shadow:var(--shadow);border:1px solid var(--border);">
      ${sectionTitle(title.stack)}
      <div style="display:flex;flex-wrap:wrap;gap:8px;">${stackChips}</div>
    </div>
  </section>` : ""}

  ${exp.length ? `<section id="experience" style="max-width:860px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 70px;">
    <div style="padding:0 4px;">${sectionTitle(title.experience)}</div>
    <div style="display:flex;flex-direction:column;padding-left:20px;border-left:2px solid ${rgba(a, 0.2)};">${experienceRows}</div>
  </section>` : ""}

  ${content.contacts?.length ? `<section id="contact" style="max-width:860px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 70px;">
    <div style="background:var(--card-bg);border-radius:24px;padding:40px 44px;box-shadow:var(--shadow);border:1px solid var(--border);text-align:center;">
      ${sectionTitle(title.contact)}
      <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">${contactButtons}</div>
    </div>
  </section>` : ""}

  <footer style="max-width:860px;margin:0 auto;padding:24px clamp(24px,6vw,72px) 60px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;">
    <span style="font-family:'Playfair Display',serif;font-size:15px;font-style:italic;color:var(--fg);">${esc(content.identity.name)}</span>
    <div style="display:flex;gap:20px;">${footerSocials}</div>
  </footer>

</div>

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
    if (b) b.textContent = mode === 'dark' ? 'Light' : 'Dark';
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

// Organic Pastel 404: floating gradient 404, soft card, pastel tag pills.
export function notFound(scheme) {
  const a = "#C87E6A", a2 = "#7CB895", a3 = "#9B85C4";
  const rgba = (hex, al) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${al})`; };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — Page not found</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root { --bg:#FAF7F2; --fg:#1C1714; --fg-muted:#7A6B63; --card-bg:#FFFFFF; --border:rgba(0,0,0,0.07); --shadow:0 2px 16px rgba(0,0,0,0.06); }
  [data-theme="dark"] { --bg:#1A1613; --fg:#F5EFE8; --fg-muted:#A89A90; --card-bg:#241E1A; --border:rgba(255,255,255,0.08); --shadow:0 2px 16px rgba(0,0,0,0.3); }
  * { box-sizing:border-box; }
  body { margin:0; min-height:100vh; background:var(--bg); color:var(--fg); font-family:'DM Sans',sans-serif; display:flex; align-items:center; justify-content:center; padding:40px; transition:background .3s,color .3s; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
</style>
<script>
  (function(){ try { if ((localStorage.getItem('theme')||'light')==='dark') document.documentElement.setAttribute('data-theme','dark'); } catch(e){} })();
</script>
</head>
<body>
  <div style="position:fixed;top:-150px;left:-150px;width:550px;height:550px;background:radial-gradient(circle,${rgba(a,0.14)},transparent 70%);pointer-events:none;border-radius:50%;"></div>
  <div style="position:fixed;bottom:-120px;right:-120px;width:480px;height:480px;background:radial-gradient(circle,${rgba(a2,0.12)},transparent 70%);pointer-events:none;border-radius:50%;"></div>
  <div style="position:relative;max-width:520px;width:100%;text-align:center;">
    <h1 style="font-family:'Playfair Display',serif;font-size:clamp(120px,26vw,220px);font-weight:600;letter-spacing:-4px;margin:0 0 8px;line-height:0.9;background:linear-gradient(120deg,${a},${a3},${a2});background-clip:text;-webkit-background-clip:text;color:transparent;animation:float 4s ease-in-out infinite;">404</h1>
    <div style="background:var(--card-bg);border-radius:24px;padding:36px 40px;box-shadow:var(--shadow);border:1px solid var(--border);margin-bottom:28px;">
      <h2 style="font-family:'Playfair Display',serif;font-size:26px;font-weight:500;margin:0 0 12px;color:var(--fg);">Oh, this page wandered off</h2>
      <p style="color:var(--fg-muted);font-size:15px;line-height:1.75;margin:0 0 20px;">It seems like this page has gone on a little adventure of its own. Let's get you back somewhere familiar.</p>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
        <span style="background:${rgba(a,0.1)};color:${a};padding:5px 14px;border-radius:16px;font-size:12px;font-weight:500;">error: 404</span>
        <span style="background:${rgba(a3,0.1)};color:${a3};padding:5px 14px;border-radius:16px;font-size:12px;font-weight:500;">page: not found</span>
        <span style="background:${rgba(a2,0.1)};color:${a2};padding:5px 14px;border-radius:16px;font-size:12px;font-weight:500;">status: lost</span>
      </div>
    </div>
    <a href="/" style="background:${a};color:#fff;padding:13px 32px;border-radius:40px;text-decoration:none;font-size:14px;font-weight:500;box-shadow:0 4px 16px ${rgba(a,0.3)};display:inline-block;">Take me home</a>
  </div>
</body>
</html>`;
}