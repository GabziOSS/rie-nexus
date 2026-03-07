export type ThemeId =
  | "civicpulse"
  | "calbayog-gov-plus"
  | "nwssu-academic"
  | "civic-fusion"
  | "obsidian-ops"
  | "terracotta-republic"
  | "typhoon-watch"
  | "teal-sentinel"
  | "accessibility-first"
  | "violet-dawn"

export interface ThemeMeta {
  id: ThemeId
  label: string
  description: string
  font: string
  preview: {
    background: string
    primary: string
    accent: string
  }
  tags: string[]
}

export const THEMES: ThemeMeta[] = [
  {
    id: "civicpulse",
    label: "CivicPulse",
    description: "Modern data-forward civic tech dashboard with electric blue energy",
    font: "Sora",
    preview: {
      background: "#0e1929",
      primary: "#00d4ff",
      accent: "#ffb300",
    },
    tags: ["default", "data-terminal", "responsive"],
  },
  {
    id: "calbayog-gov-plus",
    label: "Calbayog Gov Plus",
    description: "Official local government identity—trusted, authoritative, modern",
    font: "Outfit",
    preview: {
      background: "#0d1629",
      primary: "#004fa8",
      accent: "#d4af37",
    },
    tags: ["official", "government", "civic"],
  },
  {
    id: "nwssu-academic",
    label: "NWSSU Academic",
    description: "Institutional academia modernized—scholarly weight with crimson depth",
    font: "Crimson Pro",
    preview: {
      background: "#0f0807",
      primary: "#c41e3a",
      accent: "#8b7355",
    },
    tags: ["academic", "serif", "scholarly"],
  },
  {
    id: "civic-fusion",
    label: "Civic Fusion",
    description: "Government authority and academic heritage merged into one",
    font: "Inter",
    preview: {
      background: "#101620",
      primary: "#0052cc",
      accent: "#d4af37",
    },
    tags: ["fusion", "hybrid", "balanced"],
  },
  {
    id: "obsidian-ops",
    label: "Obsidian Ops",
    description: "Operator-grade precision—near-black with ice-blue clarity",
    font: "Space Grotesk",
    preview: {
      background: "#0d0d0d",
      primary: "#00d9ff",
      accent: "#9d4edd",
    },
    tags: ["precision", "minimal", "professional"],
  },
  {
    id: "terracotta-republic",
    label: "Terracotta Republic",
    description: "Warm civic boldness—sun-bleached parchment meets governance",
    font: "DM Sans",
    preview: {
      background: "#2b1810",
      primary: "#c85a28",
      accent: "#d4a574",
    },
    tags: ["warm", "accessible", "human"],
  },
  {
    id: "typhoon-watch",
    label: "Typhoon Watch",
    description: "Storm-green environmental monitoring—weather terminal aesthetic",
    font: "IBM Plex Mono",
    preview: {
      background: "#0d2620",
      primary: "#00b386",
      accent: "#ffff00",
    },
    tags: ["environmental", "monospace", "urgent"],
  },
  {
    id: "teal-sentinel",
    label: "Teal Sentinel",
    description: "Cool dark teal monitoring—emerald precision without terminal feel",
    font: "Inter",
    preview: {
      background: "#091e24",
      primary: "#00c9b4",
      accent: "#ffcc00",
    },
    tags: ["cool", "environmental", "modern"],
  },
  {
    id: "accessibility-first",
    label: "Accessibility First",
    description: "High-contrast accessible theme—maximum readability and clarity",
    font: "Inter",
    preview: {
      background: "#0a0a0a",
      primary: "#0066ff",
      accent: "#ff6600",
    },
    tags: ["accessible", "high-contrast", "wcag"],
  },
  {
    id: "violet-dawn",
    label: "Violet Dawn",
    description: "Violet and magenta modern aesthetic—energetic yet refined",
    font: "Outfit",
    preview: {
      background: "#1a0d28",
      primary: "#9d4edd",
      accent: "#ffcc00",
    },
    tags: ["vibrant", "modern", "creative"],
  },
]

export const DEFAULT_THEME: ThemeId = "civicpulse"
