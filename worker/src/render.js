// Render dispatcher: picks a template and a scheme, then renders the content.
//
// template = HTML structure (minimal, terminal, editorial, ...)
// scheme   = colors + fonts + sizing (dark, light, gold, ...)
// They are independent: any template works with any scheme.

import { render as minimal } from "./templates/minimal.js";
import { render as terminal, notFound as terminalNotFound } from "./templates/terminal.js";
import { render as editorial, notFound as editorialNotFound } from "./templates/editorial.js";
import { render as retro, notFound as retroNotFound } from "./templates/retro.js";
import { render as futuristic, notFound as futuristicNotFound } from "./templates/futuristic.js";
import { render as glass, notFound as glassNotFound } from "./templates/glass.js";
import { render as pastel, notFound as pastelNotFound } from "./templates/pastel.js";
import { schemes, DEFAULT_SCHEME } from "./schemes/index.js";

const templates = {
  minimal,
  terminal,
  editorial,
  retro,
  futuristic,
  glass,
  pastel,
};

// Per-design 404 pages. Templates that define one register it here;
// others fall back to the default template's 404.
const notFoundPages = {
  editorial: editorialNotFound,
  terminal: terminalNotFound,
  retro: retroNotFound,
  futuristic: futuristicNotFound,
  glass: glassNotFound,
  pastel: pastelNotFound,
};

const DEFAULT_TEMPLATE = "minimal";

// meta carries page-level info for SEO/OG tags (canonical url, og image).
export function renderPortfolio(artifact, meta = {}) {
  const content = artifact.content;

  const templateFn = templates[artifact.template_id] || templates[DEFAULT_TEMPLATE];
  const scheme = schemes[artifact.scheme_id] || schemes[DEFAULT_SCHEME];

  // The per-template accent choice (e.g. "lime", "pink") travels in meta so
  // each template can map it to its own allowed palette.
  return templateFn(content, scheme, { ...meta, accent: artifact.accent });
}

// Styled 404 for a bad path on an existing portfolio, matching its template.
export function renderNotFound(artifact) {
  const scheme = schemes[artifact.scheme_id] || schemes[DEFAULT_SCHEME];
  const notFoundFn = notFoundPages[artifact.template_id];
  if (notFoundFn) return notFoundFn(scheme);
  // Fallback: a minimal generic 404 in the scheme's accent.
  return `<!doctype html><html><head><meta charset="utf-8"><title>404</title></head><body style="font-family:sans-serif;text-align:center;padding:80px;"><h1>404</h1><p>Page not found.</p><a href="/">Back home</a></body></html>`;
}