// Minimal template: clean single-column, centered. Quiet and typographic.

import { esc, fontsHref } from "./_helpers.js";

export function render(content, scheme) {
  const c = scheme.colors;
  const f = scheme.fonts;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(content.identity.name)}</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontsHref(scheme)}" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: ${c.background};
    color: ${c.text_primary};
    font-family: "${f.body}", system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 680px; margin: 0 auto; padding: 80px 24px; }
  h1, h2, h3 { font-family: "${f.heading}", system-ui, sans-serif; line-height: 1.2; }
  h1 { font-size: 34px; font-weight: 700; }
  h2 {
    font-size: 22px; font-weight: 600;
    margin-bottom: 20px; padding-bottom: 8px;
    border-bottom: 1px solid ${c.border};
  }
  h3 { font-size: 18px; font-weight: 600; }
  a { color: ${c.accent}; text-decoration: none; }
  a:hover { text-decoration: underline; }
  section { margin-top: 56px; }
  .tagline { color: ${c.primary}; font-weight: 600; font-size: 18px; margin-top: 8px; }
  .avatar { width: 88px; height: 88px; border-radius: 50%; border: 2px solid ${c.border}; margin-bottom: 16px; object-fit: cover; }
  p { color: ${c.text_muted}; }
  .project { padding: 20px 0; border-bottom: 1px solid ${c.border}; }
  .project:last-child { border-bottom: none; }
  .project h3 { margin-bottom: 6px; }
  .project h3 a { color: ${c.text_primary}; }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .tag { font-family: "${f.mono}", monospace; font-size: 12px; color: ${c.text_muted}; }
  .tag::before { content: "#"; opacity: 0.5; }
  .stack { display: flex; flex-wrap: wrap; gap: 10px; }
  .chip { font-family: "${f.mono}", monospace; font-size: 13px; color: ${c.text_muted}; }
  .exp { margin-bottom: 24px; }
  .exp .meta { color: ${c.text_muted}; font-size: 13px; margin: 4px 0; }
  .socials { display: flex; gap: 20px; flex-wrap: wrap; }
  footer { margin-top: 72px; padding-top: 24px; border-top: 1px solid ${c.border}; color: ${c.text_muted}; font-size: 13px; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    ${content.identity.avatar_url ? `<img class="avatar" src="${esc(content.identity.avatar_url)}" alt="${esc(content.identity.name)}">` : ""}
    <h1>${esc(content.identity.name)}</h1>
    ${content.identity.tagline ? `<p class="tagline">${esc(content.identity.tagline)}</p>` : ""}
  </header>

  ${content.about ? `<section id="about"><h2>About</h2><p>${esc(content.about)}</p></section>` : ""}

  ${content.projects?.length ? `<section id="projects"><h2>Projects</h2>
    ${content.projects.map((p) => `
    <div class="project">
      <h3>${p.url ? `<a href="${esc(p.url)}">${esc(p.title)}</a>` : esc(p.title)}</h3>
      ${p.description ? `<p>${esc(p.description)}</p>` : ""}
      ${p.tags?.length ? `<div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
    </div>`).join("")}
  </section>` : ""}

  ${content.stack?.length ? `<section id="stack"><h2>Stack</h2>
    <div class="stack">${content.stack.map((s) => `<span class="chip">${esc(s.name)}</span>`).join("")}</div>
  </section>` : ""}

  ${content.experience?.length ? `<section id="experience"><h2>Experience</h2>
    ${content.experience.map((e) => `
    <div class="exp">
      <h3>${esc(e.role)}${e.organisation ? ` · ${esc(e.organisation)}` : ""}</h3>
      ${e.period ? `<div class="meta">${esc(e.period)}</div>` : ""}
      ${e.description ? `<p>${esc(e.description)}</p>` : ""}
    </div>`).join("")}
  </section>` : ""}

  ${content.socials?.length ? `<section id="contact"><h2>Contact</h2>
    <div class="socials">${content.socials.map((s) => `<a href="${esc(s.url)}">${esc(s.platform)}</a>`).join("")}</div>
  </section>` : ""}

  ${content.footer ? `<footer>${esc(content.footer)}</footer>` : ""}
</div>
</body>
</html>`;
}