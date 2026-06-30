// Minimal template: clean single-column, centered. Quiet and typographic.
//
// Uses the standardized CSS-variable vocabulary (var(--color-*), var(--font-*),
// var(--radius), var(--space)) so it stays decoupled from any specific scheme.
// Responsive via media queries. SEO/OG meta included.

import { esc, fontsHref } from "./_helpers.js";
import { cssVars } from "../schemes/index.js";

export function render(content, scheme, meta = {}) {
  const t = content.section_titles || {};
  const title = {
    about: t.about || "About",
    projects: t.projects || "Projects",
    stack: t.stack || "Stack",
    experience: t.experience || "Experience",
    contact: t.contact || "Contact",
  };

  const name = esc(content.identity.name);
  const desc = esc((content.identity.tagline || content.about || "").slice(0, 160));
  const url = meta.url || "";
  const ogImage = meta.ogImage || (url ? `${url}/readme/hero` : "");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${name}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="profile">
<meta property="og:title" content="${name}">
<meta property="og:description" content="${desc}">
${ogImage ? `<meta property="og:image" content="${ogImage}">` : ""}
${url ? `<meta property="og:url" content="${url}">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${name}">
<meta name="twitter:description" content="${desc}">
${ogImage ? `<meta name="twitter:image" content="${ogImage}">` : ""}
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontsHref(scheme)}" rel="stylesheet">
<style>
  :root { ${cssVars(scheme)} }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: var(--color-background);
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: var(--font-base);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: var(--max-width); margin: 0 auto; padding: calc(var(--space) * 10) calc(var(--space) * 3); }
  h1, h2, h3 { font-family: var(--font-heading); line-height: 1.2; }
  h1 { font-size: 34px; font-weight: 700; }
  h2 {
    font-size: 22px; font-weight: 600;
    margin-bottom: calc(var(--space) * 2.5); padding-bottom: var(--space);
    border-bottom: 1px solid var(--color-border);
  }
  h3 { font-size: 18px; font-weight: 600; }
  a { color: var(--color-accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  section { margin-top: calc(var(--space) * 7); }
  .tagline { color: var(--color-primary); font-weight: 600; font-size: 18px; margin-top: var(--space); }
  .avatar { width: 88px; height: 88px; border-radius: 50%; border: 2px solid var(--color-border); margin-bottom: calc(var(--space) * 2); object-fit: cover; }
  p { color: var(--color-muted); }
  .project { padding: calc(var(--space) * 2.5) 0; border-bottom: 1px solid var(--color-border); }
  .project:last-child { border-bottom: none; }
  .project h3 { margin-bottom: 6px; color: var(--color-text); }
  .project-links { display: flex; gap: 16px; margin-top: var(--space); font-size: 14px; }
  .tags { display: flex; flex-wrap: wrap; gap: var(--space); margin-top: calc(var(--space) * 1.5); }
  .tag { font-family: var(--font-mono); font-size: 12px; color: var(--color-muted); }
  .tag::before { content: "#"; opacity: 0.5; }
  .stack { display: flex; flex-wrap: wrap; gap: 10px; }
  .chip { font-family: var(--font-mono); font-size: 13px; color: var(--color-muted); }
  .exp { margin-bottom: calc(var(--space) * 3); }
  .exp .meta { color: var(--color-muted); font-size: 13px; margin: 4px 0; }
  .socials { display: flex; gap: 20px; flex-wrap: wrap; }
  footer { margin-top: calc(var(--space) * 9); padding-top: calc(var(--space) * 3); border-top: 1px solid var(--color-border); color: var(--color-muted); font-size: 13px; }

  @media (max-width: 600px) {
    .wrap { padding: calc(var(--space) * 5) calc(var(--space) * 2.5); }
    h1 { font-size: 28px; }
    h2 { font-size: 20px; }
    section { margin-top: calc(var(--space) * 5); }
    .project-links { gap: 12px; }
  }
  @media (max-width: 600px) {
    .wrap { padding: 48px 20px; }
    h1 { font-size: 28px; }
    h2 { font-size: 20px; }
    section { margin-top: 40px; }
    .avatar { width: 72px; height: 72px; }
  }
</style>
</head>
<body>
<div class="wrap">
  <header>
    ${content.identity.avatar_url ? `<img class="avatar" src="${esc(content.identity.avatar_url)}" alt="${name}">` : ""}
    <h1>${name}</h1>
    ${content.identity.tagline ? `<p class="tagline">${esc(content.identity.tagline)}</p>` : ""}
  </header>

  ${content.about ? `<section id="about"><h2>${esc(title.about)}</h2><p>${esc(content.about)}</p></section>` : ""}

  ${content.projects?.length ? `<section id="projects"><h2>${esc(title.projects)}</h2>
    ${content.projects.map((p) => `
    <div class="project">
      <h3>${esc(p.title)}</h3>
      ${p.description ? `<p>${esc(p.description)}</p>` : ""}
      <div class="project-links">
        ${p.repo_url ? `<a href="${esc(p.repo_url)}">Code →</a>` : ""}
        ${p.live_url ? `<a href="${esc(p.live_url)}">Live →</a>` : ""}
      </div>
      ${p.tags?.length ? `<div class="tags">${p.tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</div>` : ""}
    </div>`).join("")}
  </section>` : ""}

  ${content.stack?.length ? `<section id="stack"><h2>${esc(title.stack)}</h2>
    <div class="stack">${content.stack.map((s) => `<span class="chip">${esc(s.name)}</span>`).join("")}</div>
  </section>` : ""}

  ${content.experience?.length ? `<section id="experience"><h2>${esc(title.experience)}</h2>
    ${content.experience.map((e) => `
    <div class="exp">
      <h3>${esc(e.role)}${e.organisation ? ` · ${esc(e.organisation)}` : ""}</h3>
      ${e.period ? `<div class="meta">${esc(e.period)}</div>` : ""}
      ${e.description ? `<p>${esc(e.description)}</p>` : ""}
    </div>`).join("")}
  </section>` : ""}

  ${content.socials?.length ? `<section id="contact"><h2>${esc(title.contact)}</h2>
    <div class="socials">${content.socials.map((s) => `<a href="${esc(s.url)}">${esc(s.platform)}</a>`).join("")}</div>
  </section>` : ""}

  ${content.footer ? `<footer>${esc(content.footer)}</footer>` : ""}
</div>
</body>
</html>`;
}