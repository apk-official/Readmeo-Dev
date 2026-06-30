// SVG README cards. Three cards matching the split:
//   hero     -> name + tagline + about
//   projects -> highlighted projects
//   contact  -> stack + socials
//
// GitHub renders these as static images (no JS), so everything is plain SVG.
// Text does not wrap in SVG, so we wrap and truncate manually.

import { schemes, DEFAULT_SCHEME } from "./schemes/index.js";

const W = 800; // card width

export function renderCard(section, artifact) {
  const scheme = schemes[artifact.scheme_id] || schemes[DEFAULT_SCHEME];
  const content = artifact.content;

  let svg;
  if (section === "hero") svg = heroCard(content, scheme);
  else if (section === "projects") svg = projectsCard(content, scheme);
  else if (section === "contact") svg = contactCard(content, scheme);
  else if (section.startsWith("project/")) {
    const idx = parseInt(section.slice("project/".length), 10);
    svg = singleProjectCard(content, scheme, idx);
  } else svg = notFoundCard(scheme);

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      // GitHub caches via Camo; allow refresh.
      "cache-control": "max-age=300",
    },
  });
}

// ─── helpers ──────────────────────────────────────────────────

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Rough character-width wrapping. avg ~0.55em per char at given size.
function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > maxChars) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

function truncate(text, max) {
  const s = String(text);
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function frame(c, height, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${height}" viewBox="0 0 ${W} ${height}" fill="none" role="img">
  <rect x="0.5" y="0.5" width="${W - 1}" height="${height - 1}" rx="12" fill="${c.surface}" stroke="${c.border}"/>
  ${inner}
</svg>`;
}

// ─── hero ─────────────────────────────────────────────────────

function heroCard(content, scheme) {
  const c = scheme.colors;
  const f = scheme.fonts;
  const name = esc(truncate(content.identity.name, 40));
  const tagline = esc(truncate(content.identity.tagline || "", 60));
  const aboutLines = wrapText(esc(content.about || ""), 70).slice(0, 3);

  const height = 220;
  let y = 70;
  const inner = `
  <text x="40" y="${y}" font-family="${f.heading}, sans-serif" font-size="36" font-weight="700" fill="${c.text_primary}">${name}</text>
  ${tagline ? `<text x="40" y="${(y += 36)}" font-family="${f.body}, sans-serif" font-size="18" fill="${c.primary}">${tagline}</text>` : ""}
  ${aboutLines.map((line, i) => `<text x="40" y="${y + 40 + i * 24}" font-family="${f.body}, sans-serif" font-size="15" fill="${c.text_muted}">${line}</text>`).join("")}
  `;
  return frame(c, height, inner);
}

// ─── projects ─────────────────────────────────────────────────

function projectsCard(content, scheme) {
  const c = scheme.colors;
  const f = scheme.fonts;
  const projects = (content.projects || []).slice(0, 3);

  const rowH = 70;
  const height = 80 + projects.length * rowH;

  const rows = projects.map((p, i) => {
    const y = 90 + i * rowH;
    const title = esc(truncate(p.title, 40));
    const desc = esc(truncate(p.description || "", 75));
    const tags = (p.tags || []).slice(0, 4).map(esc).join("  ·  ");
    return `
    <text x="40" y="${y}" font-family="${f.heading}, sans-serif" font-size="18" font-weight="600" fill="${c.accent}">${title}</text>
    ${desc ? `<text x="40" y="${y + 22}" font-family="${f.body}, sans-serif" font-size="14" fill="${c.text_muted}">${desc}</text>` : ""}
    ${tags ? `<text x="40" y="${y + 42}" font-family="${f.mono}, monospace" font-size="12" fill="${c.text_muted}">${tags}</text>` : ""}`;
  }).join("");

  const inner = `
  <text x="40" y="50" font-family="${f.heading}, sans-serif" font-size="22" font-weight="700" fill="${c.text_primary}">Projects</text>
  <line x1="40" y1="62" x2="${W - 40}" y2="62" stroke="${c.border}"/>
  ${rows}
  `;
  return frame(c, height, inner);
}

// ─── contact (stack + socials) ────────────────────────────────

function contactCard(content, scheme) {
  const c = scheme.colors;
  const f = scheme.fonts;
  const stack = (content.stack || []).slice(0, 10).map((s) => esc(s.name));
  const socials = (content.socials || []).slice(0, 6).map((s) => esc(s.platform));

  const height = 200;

  // Stack chips laid out left to right, wrapping.
  let cx = 40;
  let cy = 90;
  const chipGap = 12;
  const chips = stack.map((name) => {
    const wChip = 20 + name.length * 8.5;
    if (cx + wChip > W - 40) { cx = 40; cy += 38; }
    const rect = `<g>
      <rect x="${cx}" y="${cy - 20}" width="${wChip}" height="28" rx="6" fill="${c.background}" stroke="${c.border}"/>
      <text x="${cx + wChip / 2}" y="${cy - 1}" text-anchor="middle" font-family="${f.mono}, monospace" font-size="13" fill="${c.text_muted}">${name}</text>
    </g>`;
    cx += wChip + chipGap;
    return rect;
  }).join("");

  const socialsLine = socials.join("    ·    ");

  const inner = `
  <text x="40" y="50" font-family="${f.heading}, sans-serif" font-size="22" font-weight="700" fill="${c.text_primary}">Stack &amp; Contact</text>
  <line x1="40" y1="62" x2="${W - 40}" y2="62" stroke="${c.border}"/>
  ${chips}
  ${socialsLine ? `<text x="40" y="${height - 30}" font-family="${f.body}, sans-serif" font-size="15" fill="${c.accent}">${socialsLine}</text>` : ""}
  `;
  return frame(c, height, inner);
}

// ─── single project (one card, for per-project linking) ───────

function singleProjectCard(content, scheme, idx) {
  const c = scheme.colors;
  const f = scheme.fonts;
  const projects = content.projects || [];
  const p = projects[idx];

  if (!p) return notFoundCard(scheme);

  const title = esc(truncate(p.title, 36));
  const descLines = wrapText(esc(p.description || ""), 44).slice(0, 3);
  const tags = (p.tags || []).slice(0, 4).map(esc).join("  ·  ");

  const width = 400;
  const height = 200;
  let y = 60;

  const inner = `
  <text x="32" y="${y}" font-family="${f.heading}, sans-serif" font-size="22" font-weight="700" fill="${c.accent}">${title}</text>
  ${descLines.map((line, i) => `<text x="32" y="${y + 32 + i * 22}" font-family="${f.body}, sans-serif" font-size="14" fill="${c.text_muted}">${line}</text>`).join("")}
  ${tags ? `<text x="32" y="${height - 28}" font-family="${f.mono}, monospace" font-size="12" fill="${c.primary}">${tags}</text>` : ""}
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img">
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="12" fill="${c.surface}" stroke="${c.border}"/>
  ${inner}
</svg>`;
}

function notFoundCard(scheme) {
  const c = scheme.colors;
  return frame(c, 100, `<text x="40" y="55" font-family="sans-serif" font-size="18" fill="${c.text_muted}">Unknown card</text>`);
}