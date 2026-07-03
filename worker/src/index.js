// GitBunny Worker — serves portfolios and README cards from KV.
//
// Routing:
//   /readme/<section>  -> SVG card for that section
//   /                  -> full HTML portfolio page
//   anything else      -> styled per-design 404
//
// The user is resolved from the subdomain: abhinav.gitbunny.dev -> "abhinav".
// That subdomain is the KV key holding the artifact JSON.

import { renderPortfolio, renderNotFound } from "./render.js";
import { renderCard } from "./render-card.js";

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

    // /readme/* -> SVG cards.
    if (url.pathname.startsWith("/readme/")) {
      const section = url.pathname.slice("/readme/".length);
      return renderCard(section, artifact);
    }

    // Home page -> the portfolio. Pass the canonical url for SEO/OG tags.
    if (url.pathname === "/" || url.pathname === "") {
      return new Response(
        renderPortfolio(artifact, { url: `https://${subdomain}.gitbunny.dev` }),
        { headers: { "content-type": "text/html; charset=utf-8" } },
      );
    }

    // Any other path on an existing portfolio -> styled 404 matching its design.
    return new Response(renderNotFound(artifact), {
      status: 404,
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