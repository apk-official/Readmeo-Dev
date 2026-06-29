// Schemes: color + font sets. A scheme is combinable with any template.
// Add a new scheme here and it works with every template automatically.

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