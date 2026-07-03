// Shared helpers used by every template.

export function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Build a Google Fonts <link> href for the scheme's three families.
export function fontsHref(scheme) {
  const families = [scheme.fonts.heading, scheme.fonts.body, scheme.fonts.mono];
  const unique = [...new Set(families)];
  const param = unique
    .map((f) => `family=${f.replace(/ /g, "+")}:wght@400;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${param}&display=swap`;
}

// Favicon: use the avatar if present, else a letter-mark SVG data URI
// built from the name's initials on the accent color.
export function faviconHref(content, accent) {
  if (content.identity.avatar_url) return esc(content.identity.avatar_url);
  const initials = content.identity.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' rx='12' fill='${accent}'/><text x='50%' y='50%' dy='.35em' text-anchor='middle' font-family='sans-serif' font-size='30' font-weight='700' fill='white'>${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Auto-generated SEO meta tags from content. No user-facing meta fields —
// everything derives from name, tagline, about, and avatar.
export function metaTags(content, url) {
  const name = esc(content.identity.name);
  const desc = esc((content.identity.tagline || content.about || "").trim().slice(0, 160));
  const img = content.identity.avatar_url ? esc(content.identity.avatar_url) : (url ? `${url}/readme/hero` : "");
  return `
<meta name="description" content="${desc}">
${url ? `<link rel="canonical" href="${url}">` : ""}
<meta property="og:type" content="profile">
<meta property="og:title" content="${name}">
<meta property="og:description" content="${desc}">
${url ? `<meta property="og:url" content="${url}">` : ""}
${img ? `<meta property="og:image" content="${img}">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${name}">
<meta name="twitter:description" content="${desc}">
${img ? `<meta name="twitter:image" content="${img}">` : ""}
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.identity.name,
    description: (content.about || content.identity.tagline || "").trim(),
    url: url || undefined,
    image: content.identity.avatar_url || undefined,
    sameAs: (content.socials || []).map((s) => s.url),
  })}</script>`;
}