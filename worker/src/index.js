// GitBunny Worker — serves portfolios and README cards from KV.
//
// Routing:
//   /readme/<section>  -> SVG card for that section
//   /                  -> full HTML portfolio page
//
// The user is resolved from the subdomain: abhinav.gitbunny.dev -> "abhinav".
// That subdomain is the KV key holding the artifact JSON.

import { renderPortfolio } from "./render.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const subdomain = getSubdomain(request, url);

    if (!subdomain) {
      return new Response("No portfolio specified", { status: 404 });
    }

    const raw = await env.PORTFOLIO_KV.get(subdomain);
    if (!raw) {
      return new Response("Portfolio not found", { status: 404 });
    }

    let artifact;
    try {
      artifact = JSON.parse(raw);
    } catch {
      return new Response("Corrupt portfolio data", { status: 500 });
    }

    // Route: /readme/* -> SVG cards, everything else -> HTML page.
    if (url.pathname.startsWith("/readme/")) {
      const section = url.pathname.slice("/readme/".length);
      return renderCard(section, artifact);
    }

    return new Response(renderPortfolio(artifact), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};

// Pull the subdomain from the host. Locally (wrangler dev) there's no
// subdomain, so fall back to a ?u= query param for testing.
function getSubdomain(request, url) {
  const override = url.searchParams.get("u");
  if (override) return override;

  const host = request.headers.get("host") || "";

  if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
    return null;
  }

  const parts = host.split(".");
  if (parts.length >= 3) {
    return parts[0];
  }
  return null;
}

// Placeholder SVG card — replaced when we build the real card renderer.
function renderCard(section, artifact) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="100">
    <text x="20" y="50" font-size="20">${section}: ${artifact.content.identity.name}</text>
  </svg>`;
  return new Response(svg, {
    headers: { "content-type": "image/svg+xml" },
  });
}