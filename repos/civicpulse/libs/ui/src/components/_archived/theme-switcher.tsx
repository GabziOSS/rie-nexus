/**
 * ThemeSwitcher — Popover for selecting from 6 available themes.
 * Shows themes as labeled cards in a 2x3 grid with color preview dots.
 * Persists selection to localStorage and applies data-theme attribute.
 */

import { useState, useEffect } from "react"
import { Palette } from "@phosphor-icons/react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

// TODO: wire activeThemeAtom from atoms/theme.atoms.ts

interface ThemeConfig {
  id: string
  name: string
  /** HSL values for preview dots: background, primary, accent */
  colors: {
    background: string
    primary: string
    accent: string
  }
}

const themes: ThemeConfig[] = [
  {
    id: "civicpulse",
    name: "CivicPulse",
    colors: {
      background: "222 47% 8%",
      primary: "219 95% 61%",
      accent: "32 94% 49%",
    },
  },
  {
    id: "calbayog-gov-plus",
    name: "Gov Plus",
    colors: {
      background: "220 45% 6%",
      primary: "213 84% 47%",
      accent: "45 100% 50%",
    },
  },
  {
    id: "nwssu-academic",
    name: "Academic",
    colors: {
      background: "0 20% 6%",
      primary: "350 67% 36%",
      accent: "42 66% 47%",
    },
  },
  {
    id: "civic-fusion",
    name: "Civic Fusion",
    colors: {
      background: "215 40% 7%",
      primary: "213 72% 42%",
      accent: "43 82% 48%",
    },
  },
  {
    id: "obsidian-ops",
    name: "Obsidian Ops",
    colors: {
      background: "240 10% 4%",
      primary: "199 98% 58%",
      accent: "270 75% 65%",
    },
  },
  {
    id: "terracotta-republic",
    name: "Terracotta",
    colors: {
      background: "25 25% 7%",
      primary: "17 90% 55%",
      accent: "47 95% 60%",
    },
  },
]

export interface ThemeSwitcherProps {
  /** Whether the parent sidebar is collapsed */
  collapsed?: boolean
}

function ThemeSwitcher({ collapsed = false }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTheme, setActiveTheme] = useState("civicpulse")

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("civicpulse_theme")
    if (stored && themes.some((t) => t.id === stored)) {
      setActiveTheme(stored)
      document.documentElement.setAttribute("data-theme", stored)
    } else {
      document.documentElement.setAttribute("data-theme", "civicpulse")
    }
  }, [])

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !(e.target as Element).closest("[data-theme-switcher]")) {
        setIsOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isOpen])

  const handleSelectTheme = (themeId: string) => {
    setActiveTheme(themeId)
    localStorage.setItem("civicpulse_theme", themeId)
    document.documentElement.setAttribute("data-theme", themeId)
    setIsOpen(false)
  }

  return (
    <div className="relative" data-theme-switcher>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          collapsed && "justify-center px-0 py-2"
        )}
        aria-label="Change theme"
      >
        <Palette size={18} weight="duotone" />
        {!collapsed && <span>Theme</span>}
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 rounded-lg border border-border bg-card p-3 shadow-lg",
            collapsed ? "bottom-0 left-full ml-2" : "bottom-full left-0 mb-2"
          )}
        >
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            Select Theme
          </div>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(theme.id)}
                className={cn(
                  "flex flex-col gap-2 rounded-md border border-border p-2 transition-all hover:scale-[1.02] hover:brightness-110",
                  activeTheme === theme.id && "ring-2 ring-primary"
                )}
              >
                {/* Theme name */}
                <span className="text-xs font-medium text-foreground">
                  {theme.name}
                </span>

                {/* Color preview dots */}
                <div className="flex gap-1.5">
                  <span
                    className="size-3 rounded-full border border-border/50"
                    style={{ backgroundColor: `hsl(${theme.colors.background})` }}
                    title="Background"
                  />
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                    title="Primary"
                  />
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                    title="Accent"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { ThemeSwitcher }
export default ThemeSwitcher
