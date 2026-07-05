// Per-template card themes for the GitHub README SVG cards.
// Each theme describes the visual treatment (colors, fonts, decorations) so the
// card renderer can produce cards that match the portfolio template's look.
//
// GitHub renders these as static images via Camo — no JS, no external CSS.
// Fonts must be web-safe or common (GitHub strips <link>), so we use system
// stacks that approximate each template's typeface.

// font stacks (GitHub-safe: no external font loading in SVG-as-image)
const MONO = "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

export const cardThemes = {
  minimal: {
    bg: "#ffffff", surface: "#ffffff", border: "#e8e8e8",
    fg: "#0a0a0a", muted: "#999999", accent: "#22c55e",
    headingFont: SANS, bodyFont: SANS, monoFont: MONO,
    radius: 10, style: "minimal",
  },
  editorial: {
    bg: "#fafaf8", surface: "#f4f4f1", border: "#e4e4e0",
    fg: "#111110", muted: "#6b6b68", accent: "#e8b23f",
    headingFont: SERIF, bodyFont: SANS, monoFont: MONO,
    radius: 10, style: "editorial", serifHeading: true,
  },
  terminal: {
    bg: "#0a0e17", surface: "#0d1220", border: "#1a2538",
    fg: "#f1f5f9", muted: "#64748b", accent: "#4ade80",
    green: "#4ade80", blue: "#60a5fa", yellow: "#fbbf24", pink: "#f472b6",
    headingFont: MONO, bodyFont: MONO, monoFont: MONO,
    radius: 8, style: "terminal",
  },
  retro: {
    bg: "#0a0a0a", surface: "#111110", border: "#222220",
    fg: "#f5f5f0", muted: "#666660", accent: "#c8f500",
    pink: "#ff2d78",
    headingFont: SANS, bodyFont: SANS, monoFont: MONO,
    radius: 0, style: "retro", heavyBorder: true,
  },
  futuristic: {
    bg: "#050a0f", surface: "#0a1119", border: "rgba(0,245,255,0.15)",
    fg: "#ddf0ff", muted: "rgba(221,240,255,0.5)", accent: "#00f5ff",
    green: "#00ff88",
    headingFont: MONO, bodyFont: SANS, monoFont: MONO,
    radius: 2, style: "futuristic", corners: true, animated: true,
  },
  glass: {
    bg: "#0f0b26", surface: "rgba(255,255,255,0.07)", border: "rgba(255,255,255,0.14)",
    fg: "#f2eeff", muted: "rgba(255,255,255,0.55)", accent: "#a78bfa",
    accent2: "#38bdf8",
    headingFont: SANS, bodyFont: SANS, monoFont: MONO,
    radius: 16, style: "glass", gradient: true,
  },
  pastel: {
    bg: "#faf7f2", surface: "#ffffff", border: "rgba(0,0,0,0.08)",
    fg: "#1c1714", muted: "#7a6b63", accent: "#c87e6a",
    accent2: "#7cb895", accent3: "#9b85c4",
    headingFont: SERIF, bodyFont: SANS, monoFont: MONO,
    radius: 18, style: "pastel", serifHeading: true, softShadow: true,
  },
  geocities: {
    bg: "#c0c0c0", surface: "#ffffff", border: "#808080",
    fg: "#000000", muted: "#555555", accent: "#000080",
    red: "#ff0000", yellow: "#ffff00",
    headingFont: SERIF, bodyFont: SERIF, monoFont: MONO,
    radius: 0, style: "geocities", heavyBorder: true,
  },
};

export const DEFAULT_CARD_THEME = "minimal";

export function getCardTheme(templateId) {
  return cardThemes[templateId] || cardThemes[DEFAULT_CARD_THEME];
}