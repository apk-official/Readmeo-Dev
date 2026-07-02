// Render dispatcher: picks a template and a scheme, then renders the content.
//
// template = HTML structure (minimal, terminal, ...)
// scheme   = colors + fonts (dark, light, gold, ...)
// They are independent: any template works with any scheme.

import { render as minimal } from "./templates/minimal.js";
import { render as terminal } from "./templates/terminal.js";
import { render as editorial } from "./templates/editorial.js";
import { schemes, DEFAULT_SCHEME } from "./schemes/index.js";

const templates = {
  minimal,
  terminal,
  editorial,
};

const DEFAULT_TEMPLATE = "minimal";

export function renderPortfolio(artifact) {
  const content = artifact.content;

  // template_id and scheme_id come from the artifact; fall back if unknown.
  const templateFn = templates[artifact.template_id] || templates[DEFAULT_TEMPLATE];
  const scheme = schemes[artifact.scheme_id] || schemes[DEFAULT_SCHEME];

  return templateFn(content, scheme);
}