// Terminal template: a fake terminal window. Structurally different from
// minimal — content is framed as terminal output with a prompt motif.

import { esc, fontsHref } from "./_helpers.js";

export function render(content, scheme) {
  const c = scheme.colors;
  const f = scheme.fonts;
  const t = content.section_titles || {};
  const title = {
    about: t.about || "about",
    projects: t.projects || "projects",
    stack: t.stack || "stack",
    experience: t.experience || "experience",
    contact: t.contact || "contact",
  };

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
    font-family: "${f.mono}", monospace;
    font-size: 14px;
    line-height: 1.7;
    padding: 40px 16px;
  }
  .term {
    max-width: 760px; margin: 0 auto;
    background: ${c.surface};
    border: 1px solid ${c.border};
    border-radius: 8px;
    overflow: hidden;
  }
  .bar { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-bottom: 1px solid ${c.border}; }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot.r { background: #ff5f56; } .dot.y { background: #ffbd2e; } .dot.g { background: #27c93f; }
  .bar .title { margin-left: 8px; color: ${c.text_muted}; font-size: 12px; }
  .body { padding: 24px; }
  .prompt { color: ${c.primary}; }
  .prompt::before { content: "$ "; color: ${c.accent}; }
  h1 { font-size: 22px; color: ${c.text_primary}; margin: 4px 0; }
  .tagline { color: ${c.primary}; margin-bottom: 8px; }
  h2 { font-size: 15px; color: ${c.accent}; margin: 28px 0 12px; }
  h2::before { content: "# "; color: ${c.text_muted}; }
  h3 { font-size: 14px; color: ${c.text_primary}; }
  a { color: ${c.accent}; text-decoration: none; }
  a:hover { text-decoration: underline; }
  p { color: ${c.text_muted}; }
  .project { margin-bottom: 16px; padding-left: 16px; border-left: 2px solid ${c.border}; }
  .project-links { margin-top: 4px; }
  .project-links a:not(:last-child)::after { content: "  ·  "; color: ${c.text_muted}; }
  .tags { margin-top: 6px; }
  .tag { color: ${c.text_muted}; } .tag::before { content: "#"; }
  .tag:not(:last-child)::after { content: " "; }
  .stack span:not(:last-child)::after { content: " · "; color: ${c.text_muted}; }
  .exp { margin-bottom: 16px; }
  .exp .meta { color: ${c.text_muted}; font-size: 12px; }
  .socials a:not(:last-child)::after { content: "  ·  "; color: ${c.text_muted}; }
  footer { margin-top: 28px; color: ${c.text_muted}; font-size: 12px; }
  @media (max-width: 600px) {
    body { padding: 20px 10px; font-size: 13px; }
    .body { padding: 16px; }
    h1 { font-size: 19px; }
    .bar .title { display: none; }
  }
</style>
</head>
<body>
<div class="term">
  <div class="bar">
    <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
    <span class="title">${esc(content.identity.name)} — portfolio</span>
  </div>
  <div class="body">
    <div class="prompt">whoami</div>
    <h1>${esc(content.identity.name)}</h1>
    ${content.identity.tagline ? `<div class="tagline">${esc(content.identity.tagline)}</div>` : ""}

    ${content.about ? `<h2 id="about">${esc(title.about)}</h2><p>${esc(content.about)}</p>` : ""}

    ${content.projects?.length ? `<h2 id="projects">${esc(title.projects)}</h2>
      ${content.projects.map((p) => `
      <div class="project">
        <h3>${esc(p.title)}</h3>
        ${p.description ? `<p>${esc(p.description)}</p>` : ""}
        <div class="project-links">
          ${p.repo_url ? `<a href="${esc(p.repo_url)}">code</a>` : ""}
          ${p.live_url ? `<a href="${esc(p.live_url)}">live</a>` : ""}
        </div>
        ${p.tags?.length ? `<div class="tags">${p.tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join(" ")}</div>` : ""}
      </div>`).join("")}` : ""}

    ${content.stack?.length ? `<h2 id="stack">${esc(title.stack)}</h2>
      <div class="stack">${content.stack.map((s) => `<span>${esc(s.name)}</span>`).join("")}</div>` : ""}

    ${content.experience?.length ? `<h2 id="experience">${esc(title.experience)}</h2>
      ${content.experience.map((e) => `
      <div class="exp">
        <h3>${esc(e.role)}${e.organisation ? ` @ ${esc(e.organisation)}` : ""}</h3>
        ${e.period ? `<div class="meta">${esc(e.period)}</div>` : ""}
        ${e.description ? `<p>${esc(e.description)}</p>` : ""}
      </div>`).join("")}` : ""}

    ${content.socials?.length ? `<h2 id="contact">${esc(title.contact)}</h2>
      <div class="socials">${content.socials.map((s) => `<a href="${esc(s.url)}">${esc(s.platform)}</a>`).join("")}</div>` : ""}

    ${content.footer ? `<footer>${esc(content.footer)}</footer>` : ""}
  </div>
</div>
</body>
</html>`;
}