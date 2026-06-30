// Schemes: color + font sets. A scheme is combinable with any template.
// Add a new scheme here and it works with every template automatically.
export function cssVars(scheme) {
  const c = scheme.colors;
  const f = scheme.fonts;
  return [
    `--color-background: ${c.background}`,
    `--color-surface: ${c.surface}`,
    `--color-primary: ${c.primary}`,
    `--color-accent: ${c.accent}`,
    `--color-text: ${c.text_primary}`,
    `--color-muted: ${c.text_muted}`,
    `--color-border: ${c.border}`,
    `--font-heading: "${f.heading}", system-ui, sans-serif`,
    `--font-body: "${f.body}", system-ui, sans-serif`,
    `--font-mono: "${f.mono}", monospace`,
    `--font-base: 16px`,
    `--space: 8px`,
    `--radius: 8px`,
    `--max-width: 680px`,
  ].join("; ");
}

export const schemes = {
  dark: {
    colors: {
      background: "#0d1117",
      surface: "#161b22",
      primary: "#e8b23f",
      accent: "#58a6ff",
      text_primary: "#e6edf3",
      text_muted: "#8b949e",
      border: "#30363d",
    },
    fonts: {
      heading: "Space Grotesk",
      body: "Inter",
      mono: "JetBrains Mono",
    },
  },

  light: {
    colors: {
      background: "#ffffff",
      surface: "#f6f8fa",
      primary: "#0969da",
      accent: "#0969da",
      text_primary: "#1f2328",
      text_muted: "#656d76",
      border: "#d0d7de",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
      mono: "JetBrains Mono",
    },
  },

  gold: {
    colors: {
      background: "#1a1505",
      surface: "#2a2208",
      primary: "#e8b23f",
      accent: "#f0c674",
      text_primary: "#f5e9c8",
      text_muted: "#b8a878",
      border: "#4a3d1a",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Inter",
      mono: "JetBrains Mono",
    },
  },
};

// Fallback if a portfolio references a scheme that doesn't exist.
export const DEFAULT_SCHEME = "dark";