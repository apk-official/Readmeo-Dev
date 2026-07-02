// Editorial template: serif headings, quiet single-column. Converted from the
// Minimal Modern design. Carries its own light + dark palette as CSS variables;
// the scheme controls only --accent. A nav toggle flips light/dark.

import { esc } from "./_helpers.js";

export function render(content, scheme) {
  const accent = scheme.colors.accent;
  const t = content.section_titles || {};
  const title = {
    about: t.about || "About",
    projects: t.projects || "Projects",
    stack: t.stack || "Stack",
    experience: t.experience || "Experience",
    contact: t.contact || "Contact",
  };

  const fonts = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";

  // Nav links only for sections that have content.
  const navItems = [];
  if (content.about) navItems.push([title.about, "#about"]);
  if (content.projects?.length) navItems.push([title.projects, "#projects"]);
  if (content.stack?.length) navItems.push([title.stack, "#stack"]);
  if (content.experience?.length) navItems.push([title.experience, "#experience"]);
  if (content.socials?.length || content.contacts?.length) navItems.push([title.contact, "#contact"]);
  const navLinks = navItems.map(([label, href]) => `<a href="${href}">${esc(label)}</a>`).join("");

  // Whether a contact section exists to scroll to.
  const hasContact = !!(content.socials?.length || content.contacts?.length);

  const projectCard = (p, featured) => `
    <div class="card"${featured ? ' style="grid-column:1/-1;"' : ""}>
      <h3 class="serif" style="font-size:${featured ? "22px" : "19px"};font-weight:400;margin:0 0 9px;">${esc(p.title)}</h3>
      ${p.description ? `<p class="muted" style="font-size:13.5px;margin:0 0 14px;line-height:1.65;">${esc(p.description)}</p>` : ""}
      <div style="display:flex;gap:14px;margin-bottom:14px;font-size:13px;">
        ${p.repo_url ? `<a class="accent" href="${esc(p.repo_url)}" style="text-decoration:none;">Code →</a>` : ""}
        ${p.live_url ? `<a class="accent" href="${esc(p.live_url)}" style="text-decoration:none;">Live →</a>` : ""}
      </div>
      ${p.tags?.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;">${p.tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</div>` : ""}
    </div>`;

  const projects = (content.projects || []).slice(0, 3);
  const projectsHtml = projects.map((p, i) => projectCard(p, i === 0)).join("");

  const experienceHtml = (content.experience || []).map((e, i, arr) => `
    <div style="display:grid;grid-template-columns:120px 20px 1fr;padding-bottom:${i === arr.length - 1 ? "0" : "44px"};">
      <div style="text-align:right;padding-right:18px;padding-top:3px;"><span class="muted" style="font-size:12px;white-space:nowrap;">${esc(e.period || "")}</span></div>
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div class="dot"></div>
        ${i === arr.length - 1 ? "" : `<div class="line"></div>`}
      </div>
      <div style="padding-left:16px;">
        <h3 style="font-size:15.5px;font-weight:600;margin:0 0 3px;">${esc(e.role)}</h3>
        ${e.organisation ? `<p class="accent" style="font-size:13.5px;margin:0 0 10px;font-weight:500;">${esc(e.organisation)}</p>` : ""}
        ${e.description ? `<p class="muted" style="font-size:13px;line-height:1.75;margin:0;">${esc(e.description)}</p>` : ""}
      </div>
    </div>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(content.identity.name)}</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fonts}" rel="stylesheet">
<style>
  :root {
    --bg:#FAFAF8; --fg:#111110; --muted:#6B6B68;
    --border:#E4E4E0; --card:#F4F4F1; --tag:#EFEFEB;
    --accent:${accent};
  }
  [data-theme="dark"] {
    --bg:#111110; --fg:#FAFAF8; --muted:#9B9B98;
    --border:#2A2A28; --card:#1A1A18; --tag:#222220;
  }
  * { box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { margin:0; background:var(--bg); color:var(--fg); font-family:'DM Sans',sans-serif; transition:background .3s,color .3s; }
  .navlinks { display:flex; gap:24px; align-items:center; }
  .navlinks a { color:var(--muted); text-decoration:none; font-size:13.5px; }
  .navlinks a:hover { color:var(--fg); }
  .cta { display:inline-block; padding:11px 22px; border-radius:6px; text-decoration:none; font-size:13.5px; font-weight:500; }
  .cta-primary { background:var(--fg); color:var(--bg); }
  .cta-secondary { border:1px solid var(--border); color:var(--fg); }
  @media (max-width:600px){ .navlinks a{ display:none; } }
  .serif { font-family:'DM Serif Display',serif; }
  .muted { color:var(--muted); }
  .accent { color:var(--accent); }
  .card { background:var(--card); border:1px solid var(--border); border-radius:10px; padding:26px 28px; }
  .tag { background:var(--tag); padding:3px 9px; border-radius:4px; font-size:11.5px; color:var(--muted); }
  .dot { width:8px; height:8px; border-radius:50%; background:var(--fg); margin-top:4px; flex-shrink:0; }
  .line { width:1px; flex:1; background:var(--border); margin-top:3px; }
  .sec { max-width:860px; margin:0 auto; padding:60px clamp(24px,6vw,72px); border-top:1px solid var(--border); }
  h2.h { font-size:32px; letter-spacing:-1px; margin:0 0 16px; font-weight:400; }
  nav { position:sticky; top:0; z-index:100; background:var(--bg); border-bottom:1px solid var(--border); padding:0 clamp(24px,6vw,72px); display:flex; align-items:center; justify-content:space-between; height:56px; transition:background .3s; }
  .toggle { border:1px solid var(--border); background:transparent; color:var(--muted); padding:5px 14px; border-radius:20px; font-size:12px; cursor:pointer; font-family:'DM Sans',sans-serif; }
  @media (max-width:600px){ .sec{ padding:40px 20px; } h2.h{ font-size:26px; } }
</style>
</head>
<body>
<nav>
  <span class="serif" style="font-size:20px;letter-spacing:-0.5px;">${esc(content.identity.name.split(" ").map((w) => w[0]).join("").slice(0, 2))}</span>
  <div class="navlinks">
    ${navLinks}
    <button class="toggle" onclick="tt()" id="tglabel">◑ Dark</button>
  </div>
</nav>

<section style="max-width:860px;margin:0 auto;padding:clamp(72px,12vw,128px) clamp(24px,6vw,72px) 80px;">
  <h1 class="serif" style="font-size:clamp(48px,8vw,76px);line-height:1;letter-spacing:-2.5px;margin:0 0 22px;font-weight:400;">${esc(content.identity.name)}</h1>
  ${content.identity.tagline ? `<p class="muted" style="font-size:19px;margin:0 0 32px;font-weight:300;max-width:520px;line-height:1.65;">${esc(content.identity.tagline)}</p>` : ""}
  <div style="display:flex;gap:10px;flex-wrap:wrap;">
    ${hasContact ? `<a class="cta cta-primary" href="#contact">Get in touch</a>` : ""}
    ${content.projects?.length ? `<a class="cta cta-secondary" href="#projects">View work ↓</a>` : ""}
  </div>
</section>

${content.about ? `<section class="sec" id="about">
  <h2 class="serif h">${esc(title.about)}</h2>
  <p class="muted" style="font-size:15px;line-height:1.8;margin:0;max-width:600px;">${esc(content.about)}</p>
</section>` : ""}

${projects.length ? `<section class="sec" id="projects">
  <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:28px;">
    <h2 class="serif h" style="margin:0;">${esc(title.projects)}</h2>
    <span class="muted" style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;">Selected work</span>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">${projectsHtml}</div>
</section>` : ""}

${content.stack?.length ? `<section class="sec" id="stack">
  <h2 class="serif h" style="margin-bottom:24px;">${esc(title.stack)}</h2>
  <div style="display:flex;gap:8px;flex-wrap:wrap;">${content.stack.map((s) => `<span style="background:var(--tag);border:1px solid var(--border);padding:7px 16px;border-radius:6px;font-size:13px;color:var(--fg);">${esc(s.name)}</span>`).join("")}</div>
</section>` : ""}

${content.experience?.length ? `<section class="sec" id="experience">
  <h2 class="serif h" style="margin-bottom:44px;">${esc(title.experience)}</h2>
  ${experienceHtml}
</section>` : ""}

${(content.socials?.length || content.contacts?.length) ? `<section class="sec" id="contact">
  <h2 class="serif h" style="margin-bottom:24px;">${esc(title.contact)}</h2>
  ${content.contacts?.length ? `<div style="display:flex;gap:12px;flex-wrap:wrap;">${content.contacts.map((ct) => `<a class="cta cta-secondary" href="${esc(ct.value)}">${esc(ct.label)}</a>`).join("")}</div>` : ""}
</section>` : ""}

${content.socials?.length ? `<footer class="sec">
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <span class="serif" style="font-size:15px;">${esc(content.identity.name)}</span>
    <div style="display:flex;gap:20px;">${content.socials.map((s) => `<a class="muted" href="${esc(s.url)}" style="font-size:13px;text-decoration:none;">${esc(s.platform)}</a>`).join("")}</div>
  </div>
</footer>` : ""}

<script>
  function tt(){
    var d = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(d ? 'light' : 'dark');
  }
  function setTheme(mode){
    document.documentElement.setAttribute('data-theme', mode);
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