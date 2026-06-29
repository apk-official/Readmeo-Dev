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