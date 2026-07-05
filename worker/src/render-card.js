// GitHub README SVG cards, themed to match the portfolio template.
//
// Card types:
//   hero          -> name + tagline + about
//   projects      -> top 3 projects (combined)
//   stack         -> tech stack chips
//   contact       -> contact methods + socials
//   project/<i>   -> single project (links to that project in the README)
//
// GitHub serves these as static images (via Camo) — no JS, no external fonts.
// SVG text does not wrap, so wrapping/truncation is manual.

import { getCardTheme } from "./card-themes.js";

const W = 800;

export function renderCard(section, artifact) {
  const theme = getCardTheme(artifact.template_id);
  const content = artifact.content;

  // Normalize: strip surrounding slashes so "contact/", "/contact", and
  // "project/0/" all resolve. GitHub/Camo and browsers may add trailing slashes.
  section = String(section).replace(/^\/+|\/+$/g, "");

  let svg;
  if (section === "hero") svg = heroCard(content, theme);
  else if (section === "projects") svg = projectsCard(content, theme);
  else if (section === "stack") svg = stackCard(content, theme);
  else if (section === "contact") svg = contactCard(content, theme);
  else if (section.startsWith("project/")) {
    const idx = parseInt(section.slice("project/".length), 10);
    svg = singleProjectCard(content, theme, idx);
  } else svg = notFoundCard(theme);

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "max-age=300",
    },
  });
}

// ─── text helpers ─────────────────────────────────────────────

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length <= maxChars) {
      line = (line + " " + word).trim();
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function truncate(text, max) {
  const s = String(text);
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

// ─── frame + decorations (per style) ──────────────────────────

function frame(t, height, inner, opts = {}) {
  const strokeW = t.heavyBorder ? 2 : 1;
  let bg = `<rect x="0.5" y="0.5" width="${W - 1}" height="${height - 1}" rx="${t.radius}" fill="${t.bg}" stroke="${t.border}" stroke-width="${strokeW}"/>`;

  // gradient background for glass
  let defs = "";
  if (t.gradient) {
    defs = `<defs><linearGradient id="gbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0b1e"/><stop offset="0.55" stop-color="#1a0b3e"/><stop offset="1" stop-color="#0b1a3e"/>
    </linearGradient></defs>`;
    bg = `<rect x="0.5" y="0.5" width="${W - 1}" height="${height - 1}" rx="${t.radius}" fill="url(#gbg)" stroke="${t.border}" stroke-width="${strokeW}"/>`;
  }

  // corner brackets for futuristic (pulsing if animated)
  let corners = "";
  if (t.corners) {
    const b = 16;
    const pulse = t.animated
      ? `<animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/>`
      : "";
    const mk = (x, y, dx, dy, delay) => `<path d="M ${x} ${y + dy * b} L ${x} ${y} L ${x + dx * b} ${y}" stroke="${t.accent}" stroke-width="2" fill="none">${t.animated ? `<animate attributeName="opacity" values="0.4;1;0.4" dur="3s" begin="${delay}s" repeatCount="indefinite"/>` : ""}</path>`;
    corners = mk(14, 14, 1, 1, 0) + mk(W - 14, 14, -1, 1, 0.75) + mk(14, height - 14, 1, -1, 1.5) + mk(W - 14, height - 14, -1, -1, 2.25);
  }

  // futuristic extras: animated circuit traces + scan-line sweep
  let futExtras = "";
  if (t.style === "futuristic") {
    const trace = (d, color, dur, begin, dash) =>
      `<path d="${d}" stroke="${color}" stroke-width="1" fill="none" opacity="0.25" stroke-dasharray="${dash}">${t.animated ? `<animate attributeName="stroke-dashoffset" values="${dash};0" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.1;0.35;0.1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>` : ""}</path>`;
    const node = (cx, cy, color, dur, begin) =>
      `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${color}">${t.animated ? `<animate attributeName="opacity" values="0.4;1;0.4" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/><animate attributeName="r" values="2;3.5;2" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>` : ""}</circle>`;
    futExtras =
      trace(`M 0 ${height * 0.3} H 120 V ${height * 0.6} H 280`, t.accent, 6, 0, 300) +
      trace(`M ${W} ${height * 0.7} H ${W - 140} V ${height * 0.35} H ${W - 320}`, t.green, 7, 1, 260) +
      node(120, height * 0.6, t.accent, 2.4, 0) +
      node(W - 140, height * 0.35, t.green, 2.8, 0.5);
    // scan-line sweep across the whole card
    if (t.animated) {
      futExtras += `
      <rect x="1" y="0" width="${W - 2}" height="60" fill="url(#scanGrad)" opacity="0.5">
        <animate attributeName="y" values="-60;${height}" dur="4s" repeatCount="indefinite"/>
      </rect>`;
      defs += `<linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.08"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient>`;
    }
  }

  // terminal title bar (traffic lights)
  let titleBar = "";
  if (t.style === "terminal") {
    titleBar = `
      <rect x="0.5" y="0.5" width="${W - 1}" height="34" rx="${t.radius}" fill="${t.surface}" stroke="${t.border}"/>
      <rect x="0.5" y="18" width="${W - 1}" height="16" fill="${t.surface}"/>
      <circle cx="24" cy="17" r="5.5" fill="#ff5f56"/><circle cx="42" cy="17" r="5.5" fill="#ffbd2e"/><circle cx="60" cy="17" r="5.5" fill="#27c93f"/>
      <text x="${W / 2}" y="21" text-anchor="middle" font-family="${t.monoFont}" font-size="11" fill="${t.muted}">${esc(opts.termTitle || "portfolio")}</text>`;
  }

  // geocities navy banner
  let banner = "";
  if (t.style === "geocities" && opts.bannerTitle) {
    banner = `<rect x="0.5" y="0.5" width="${W - 1}" height="42" fill="${t.accent}"/>
      <rect x="0.5" y="42" width="${W - 1}" height="4" fill="${t.red}"/>
      <text x="20" y="30" font-family="${t.headingFont}" font-size="22" font-weight="bold" fill="#ffffff">${esc(opts.bannerTitle)}</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${height}" viewBox="0 0 ${W} ${height}" role="img" aria-label="${esc(opts.aria || "card")}">
${defs}${bg}${futExtras}${titleBar}${banner}${corners}${inner}
</svg>`;
}

// section label per style (e.g. "// PROJECTS" mono, or "PROJECTS" serif)
function label(t, text, x, y) {
  if (t.style === "terminal") {
    return `<text x="${x}" y="${y}" font-family="${t.monoFont}" font-size="13" fill="${t.green}">$ ${esc(text.toLowerCase())}</text>`;
  }
  if (t.style === "futuristic") {
    return `<text x="${x}" y="${y}" font-family="${t.monoFont}" font-size="11" letter-spacing="2" fill="${t.accent}">[ SYS::${esc(text.toUpperCase())} ]</text>`;
  }
  if (t.style === "retro") {
    return `<text x="${x}" y="${y}" font-family="${t.monoFont}" font-size="12" letter-spacing="1" fill="${t.pink}">01 / </text><text x="${x + 42}" y="${y}" font-family="${t.headingFont}" font-size="15" font-weight="700" fill="${t.fg}" letter-spacing="1">${esc(text.toUpperCase())}</text>`;
  }
  if (t.style === "geocities") {
    return `<rect x="${x}" y="${y - 15}" width="${W - x * 2}" height="22" fill="${t.accent}"/><text x="${x + 10}" y="${y}" font-family="${t.headingFont}" font-size="14" font-weight="bold" fill="#ffffff">${esc(text)}</text>`;
  }
  const weight = t.serifHeading ? "400" : "500";
  return `<text x="${x}" y="${y}" font-family="${t.bodyFont}" font-size="11" letter-spacing="2" fill="${t.muted}" font-weight="${weight}">${esc(text.toUpperCase())}</text>`;
}

// ─── hero ─────────────────────────────────────────────────────

function heroCard(content, t) {
  const name = esc(truncate(content.identity.name, 40));
  const tagline = esc(truncate(content.identity.tagline || "", 60));
  const aboutLines = wrapText(esc(content.about || ""), 74).slice(0, 2);
  const height = 200;

  const nameWeight = t.serifHeading ? "500" : "700";
  const nameSize = t.style === "terminal" ? 34 : 38;
  let x = 44, y = 84;

  if (t.style === "terminal") {
    const inner = `
      <text x="${x}" y="70" font-family="${t.monoFont}" font-size="13" fill="${t.green}">$ whoami</text>
      <text x="${x}" y="112" font-family="${t.monoFont}" font-size="${nameSize}" font-weight="700" fill="${t.fg}">${name}<tspan fill="${t.green}">_</tspan></text>
      ${tagline ? `<text x="${x}" y="142" font-family="${t.monoFont}" font-size="15" fill="${t.green}">&gt; ${tagline}</text>` : ""}
      ${aboutLines.map((l, i) => `<text x="${x}" y="${172 + i * 20}" font-family="${t.monoFont}" font-size="12" fill="${t.muted}"># ${l}</text>`).join("")}`;
    return frame(t, height, inner, { termTitle: "whoami", aria: `${content.identity.name} — profile` });
  }

  if (t.style === "geocities") {
    const inner = `
      ${label(t, "Welcome to My Page!", 20, 78)}
      <text x="20" y="110" font-family="${t.bodyFont}" font-size="16" fill="${t.fg}">Hi! My name is <tspan font-weight="bold">${name}</tspan>${tagline ? `, ${tagline}.` : "."}</text>
      ${aboutLines.map((l, i) => `<text x="20" y="${134 + i * 22}" font-family="${t.bodyFont}" font-size="15" fill="${t.fg}">${l}</text>`).join("")}`;
    return frame(t, height, inner, { bannerTitle: `${content.identity.name}'s Home Page`, aria: `${content.identity.name} — home page` });
  }

  // default / minimal / editorial / retro / glass / pastel / futuristic
  const cursor = t.style === "futuristic"
    ? `<text x="${x + name.length * nameSize * 0.58 + 8}" y="${y}" font-family="${t.headingFont}" font-size="${nameSize}" font-weight="${nameWeight}" fill="${t.accent}">_<animate attributeName="opacity" values="1;1;0;0" dur="1.1s" repeatCount="indefinite"/></text>`
    : "";
  const inner = `
    <text x="${x + (t.style === "minimal" || t.style === "glass" || t.style === "pastel" ? 20 : 0)}" y="${y - 40}" font-family="${t.bodyFont}" font-size="12" fill="${t.muted}" letter-spacing="1">${t.style === "futuristic" ? "// HELLO" : ""}</text>
    <text x="${x}" y="${y}" font-family="${t.headingFont}" font-size="${nameSize}" font-weight="${nameWeight}" fill="${t.fg}">${name}</text>
    ${cursor}
    ${tagline ? `<text x="${x}" y="${y + 32}" font-family="${t.bodyFont}" font-size="17" fill="${t.accent}">${tagline}</text>` : ""}
    ${aboutLines.map((l, i) => `<text x="${x}" y="${y + 66 + i * 22}" font-family="${t.bodyFont}" font-size="14" fill="${t.muted}">${l}</text>`).join("")}`;
  return frame(t, height, inner, { aria: `${content.identity.name} — profile` });
}

// ─── projects (combined) ──────────────────────────────────────

function projectsCard(content, t) {
  const projects = (content.projects || []).slice(0, 3);
  const top = t.style === "terminal" ? 56 : (t.style === "geocities" ? 60 : 54);
  const rowH = 72;
  const height = top + 20 + projects.length * rowH;

  const rows = projects.map((p, i) => {
    const y = top + 40 + i * rowH;
    const title = esc(truncate(p.title, 42));
    const desc = esc(truncate(p.description || "", 78));
    const tags = (p.tags || []).slice(0, 4).map(esc).join("  ·  ");
    const titleColor = t.style === "terminal" ? t.blue : t.accent;
    if (t.style === "terminal") {
      return `
        <text x="44" y="${y}" font-family="${t.monoFont}" font-size="11" fill="${t.muted}">drwxr-xr-x</text>
        <text x="140" y="${y}" font-family="${t.monoFont}" font-size="15" font-weight="500" fill="${titleColor}">${title}/</text>
        ${desc ? `<text x="44" y="${y + 20}" font-family="${t.monoFont}" font-size="12" fill="${t.muted}">${desc}</text>` : ""}
        ${tags ? `<text x="44" y="${y + 40}" font-family="${t.monoFont}" font-size="11" fill="${t.green}">${tags}</text>` : ""}`;
    }
    return `
      <text x="44" y="${y}" font-family="${t.headingFont}" font-size="18" font-weight="${t.serifHeading ? "500" : "600"}" fill="${titleColor}">${title}</text>
      ${desc ? `<text x="44" y="${y + 22}" font-family="${t.bodyFont}" font-size="13" fill="${t.muted}">${desc}</text>` : ""}
      ${tags ? `<text x="44" y="${y + 42}" font-family="${t.monoFont}" font-size="11" fill="${t.muted}">${tags}</text>` : ""}`;
  }).join("");

  const inner = `${label(t, content.section_titles?.projects || "Projects", 44, top - 8)}
    ${t.style === "geocities" || t.style === "terminal" ? "" : `<line x1="44" y1="${top}" x2="${W - 44}" y2="${top}" stroke="${t.border}"/>`}
    ${rows}`;
  return frame(t, height, inner, { termTitle: "ls -la projects/", bannerTitle: "My Projects", aria: "projects" });
}

// ─── single project (links individually) ──────────────────────

function singleProjectCard(content, t, idx) {
  const p = (content.projects || [])[idx];
  if (!p) return notFoundCard(t);
  const title = esc(truncate(p.title, 44));
  const desc = wrapText(esc(p.description || ""), 76).slice(0, 2);
  const tags = (p.tags || []).slice(0, 5).map(esc).join("  ·  ");
  const titleColor = t.style === "terminal" ? t.blue : t.accent;

  if (t.style === "terminal") {
    // dynamic layout: prompt, title, desc lines, then tags below.
    let y = 66;
    const promptLine = `<text x="44" y="${y}" font-family="${t.monoFont}" font-size="13" fill="${t.green}">$ cat ${esc(truncate(p.title, 30))}/README.md</text>`;
    y += 32;
    const titleLine = `<text x="44" y="${y}" font-family="${t.monoFont}" font-size="20" font-weight="700" fill="${titleColor}">${title}</text>`;
    y += 26;
    const descLines = desc.map((l) => { const line = `<text x="44" y="${y}" font-family="${t.monoFont}" font-size="12" fill="${t.muted}">${l}</text>`; y += 18; return line; }).join("");
    const tagLine = tags ? (() => { y += 4; const line = `<text x="44" y="${y}" font-family="${t.monoFont}" font-size="11" fill="${t.green}">${tags}</text>`; y += 12; return line; })() : "";
    const height = y + 20;
    return frame(t, height, promptLine + titleLine + descLines + tagLine, { termTitle: title, aria: title });
  }

  // default: label, title, desc lines, then tags below (all dynamic).
  let y = 46;
  const labelLine = label(t, "Project", 44, y);
  y += 38;
  const titleLine = `<text x="44" y="${y}" font-family="${t.headingFont}" font-size="24" font-weight="${t.serifHeading ? "500" : "700"}" fill="${titleColor}">${title}</text>`;
  y += 28;
  const descLines = desc.map((l) => { const line = `<text x="44" y="${y}" font-family="${t.bodyFont}" font-size="14" fill="${t.muted}">${l}</text>`; y += 22; return line; }).join("");
  const tagLine = tags ? (() => { y += 6; const line = `<text x="44" y="${y}" font-family="${t.monoFont}" font-size="11" fill="${t.muted}">${tags}</text>`; y += 11; return line; })() : "";
  const height = y + 22;
  return frame(t, height, labelLine + titleLine + descLines + tagLine, { bannerTitle: title, aria: title });
}

// ─── stack ────────────────────────────────────────────────────

function stackCard(content, t) {
  const stack = (content.stack || []).slice(0, 12).map((s) => esc(s.name));
  const top = t.style === "terminal" ? 56 : 54;
  // simple wrap: ~5 per row
  const perRow = 5, rows = Math.ceil(stack.length / perRow);
  const height = top + 20 + rows * 46;

  let chips = "";
  let cx = 44, cy = top + 28;
  stack.forEach((name, i) => {
    const w = 20 + name.length * 8.5;
    if (cx + w > W - 44) { cx = 44; cy += 46; }
    if (t.style === "geocities") {
      chips += `<rect x="${cx}" y="${cy - 18}" width="${w}" height="28" fill="#c0c0c0" stroke="#ffffff" stroke-width="1"/><rect x="${cx}" y="${cy - 18}" width="${w}" height="28" fill="none" stroke="#808080" stroke-width="1" stroke-dasharray="0"/><text x="${cx + w / 2}" y="${cy}" text-anchor="middle" font-family="${t.bodyFont}" font-size="13" fill="${t.fg}">${name}</text>`;
    } else if (t.style === "terminal") {
      chips += `<rect x="${cx}" y="${cy - 18}" width="${w}" height="26" rx="2" fill="none" stroke="${t.border}"/><text x="${cx + w / 2}" y="${cy}" text-anchor="middle" font-family="${t.monoFont}" font-size="12" fill="${t.green}">${name}</text>`;
    } else {
      const chipBg = t.style === "glass" ? "rgba(255,255,255,0.08)" : (t.style === "pastel" ? "rgba(200,126,106,0.1)" : "none");
      const chipStroke = t.style === "pastel" ? "none" : t.border;
      const chipText = t.style === "pastel" ? t.accent : t.fg;
      chips += `<rect x="${cx}" y="${cy - 18}" width="${w}" height="28" rx="${Math.min(t.radius, 14)}" fill="${chipBg}" stroke="${chipStroke}"/><text x="${cx + w / 2}" y="${cy}" text-anchor="middle" font-family="${t.bodyFont}" font-size="13" fill="${chipText}">${name}</text>`;
    }
    cx += w + 10;
  });

  const inner = `${label(t, content.section_titles?.stack || "Stack", 44, top - 8)}${chips}`;
  return frame(t, height, inner, { termTitle: "tree skills/", bannerTitle: "My Tech Stack", aria: "tech stack" });
}

// ─── contact (contacts + socials) ─────────────────────────────

function contactCard(content, t) {
  const contacts = (content.contacts || []).map((c) => [c.label, c.value.replace(/^(mailto:|tel:|https?:\/\/)/, "")]);
  const socials = (content.socials || []).map((s) => [s.platform, s.url.replace(/^https?:\/\//, "")]);
  const all = [...contacts, ...socials].slice(0, 5);
  const top = t.style === "terminal" ? 56 : 54;
  const height = top + 24 + all.length * 32;

  const rows = all.map(([lbl, val], i) => {
    const y = top + 44 + i * 32;
    const valColor = t.style === "terminal" ? t.blue : t.accent;
    if (t.style === "terminal") {
      return `<text x="44" y="${y}" font-family="${t.monoFont}" font-size="13" fill="${t.muted}">[${esc(lbl.toLowerCase())}]</text><text x="180" y="${y}" font-family="${t.monoFont}" font-size="13" fill="${valColor}">${esc(val)}</text>`;
    }
    return `<text x="44" y="${y}" font-family="${t.bodyFont}" font-size="14" fill="${t.muted}">${esc(lbl)}</text><text x="${W - 44}" y="${y}" text-anchor="end" font-family="${t.bodyFont}" font-size="14" fill="${valColor}">${esc(val)}</text>`;
  }).join("");

  const inner = `${label(t, content.section_titles?.contact || "Contact", 44, top - 8)}
    ${t.style === "geocities" || t.style === "terminal" ? "" : `<line x1="44" y1="${top}" x2="${W - 44}" y2="${top}" stroke="${t.border}"/>`}
    ${rows}`;
  return frame(t, height, inner, { termTitle: "contact --info", bannerTitle: "Contact", aria: "contact" });
}

// ─── fallback ─────────────────────────────────────────────────

function notFoundCard(t) {
  return frame(t, 120, `<text x="${W / 2}" y="66" text-anchor="middle" font-family="${t.bodyFont}" font-size="18" fill="${t.muted}">Card not found</text>`, { aria: "not found" });
}