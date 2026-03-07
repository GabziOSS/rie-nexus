"use client"

/**
 * ThemeSwitcher — Palette popover for selecting from available themes.
 * Shows themes as labeled cards in a 2-column grid with color preview dots.
 * Uses useTheme() hook for state management.
 */

import { PaletteIcon as Palette } from "@phosphor-icons/react"
import { memo, useCallback, useEffect, useState } from "react"
import { useTheme } from "@rie-civicpulse/ui/components/theme-provider"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import type { ThemeId, ThemeMeta } from "@rie-civicpulse/ui/lib/themes"

// TODO: wire activeThemeAtom from atoms/theme.atoms.ts

export interface ThemeSwitcherProps {
  /** Whether the parent sidebar is collapsed */
  collapsed?: boolean
}

/**
 * Individual theme card — memoized to prevent re-renders.
 */
const ThemeCard = memo(function ThemeCardImpl({
  theme,
  isActive,
  onSelect,
}: {
  theme: ThemeMeta
  isActive: boolean
  onSelect: (id: ThemeId) => void
}) {
  const handleClick = useCallback(() => {
    onSelect(theme.id)
  }, [onSelect, theme.id])

  return (
    <button
      onClick={handleClick}
      className={cn(
        "border-border flex flex-col gap-2 rounded-md border p-2 transition-all hover:scale-[1.02] hover:brightness-110",
        isActive && "ring-primary scale-[1.02] ring-2"
      )}
    >
      {/* Theme name */}
      <span className="text-foreground text-xs font-medium">{theme.label}</span>

      {/* Color preview dots */}
      <div className="flex gap-1.5">
        <span
          className="border-border/50 size-3 rounded-full border"
          style={{ backgroundColor: theme.preview.background }}
          title="Background"
        />
        <span
          className="size-3 rounded-full"
          style={{ backgroundColor: theme.preview.primary }}
          title="Primary"
        />
        <span
          className="size-3 rounded-full"
          style={{ backgroundColor: theme.preview.accent }}
          title="Accent"
        />
      </div>
    </button>
  )
})

/**
 * ThemeSwitcher component.
 * Wrapped in React.memo for performance (renders 10 theme cards).
 */
const ThemeSwitcher = memo(function ThemeSwitcherImpl({
  collapsed = false,
}: ThemeSwitcherProps) {
  const { theme, setTheme, themes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  // Close popover when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest("[data-theme-switcher]")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isOpen])

  // Stable handler for theme selection
  const handleSelectTheme = useCallback(
    (themeId: ThemeId) => {
      setTheme(themeId)
      setIsOpen(false)
    },
    [setTheme]
  )

  // Toggle handler
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return (
    <div className="relative" data-theme-switcher>
      {/* Trigger button */}
      <button
        onClick={handleToggle}
        className={cn(
          "text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
          collapsed && "justify-center px-0 py-2"
        )}
        aria-label="Change theme"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Palette size={18} weight="duotone" />
        {!collapsed && <span>Theme</span>}
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Theme selection"
          className={cn(
            "border-border bg-card absolute z-50 rounded-lg border p-3 shadow-lg",
            collapsed ? "bottom-0 left-full ml-2" : "bottom-full left-0 mb-2"
          )}
        >
          <div className="text-muted-foreground mb-2 text-xs font-medium">
            Select Theme
          </div>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((t) => (
              <ThemeCard
                key={t.id}
                theme={t}
                isActive={theme === t.id}
                onSelect={handleSelectTheme}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

export { ThemeSwitcher }
export default ThemeSwitcher
