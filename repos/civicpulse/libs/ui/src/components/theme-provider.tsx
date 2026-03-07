/**
 * ThemeProvider — Context provider for theme state management.
 * Reads theme from localStorage on mount, applies data-theme attribute to <html>.
 * Exports useTheme() hook for components to access/set active theme.
 */

"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { DEFAULT_THEME, THEMES, type ThemeId } from "@rie-civicpulse/ui/lib/themes"

// TODO: wire activeThemeAtom from atoms/theme.atoms.ts

const STORAGE_KEY = "civicpulse_theme"

interface ThemeContextValue {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
  themes: typeof THEMES
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
ThemeContext.displayName = "ThemeContext"

/**
 * Lazily reads theme from localStorage.
 * Returns DEFAULT_THEME if invalid or not found.
 */
function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && THEMES.some((t) => t.id === stored)) {
      return stored as ThemeId
    }
  } catch {
    // localStorage may be unavailable in some environments
  }

  return DEFAULT_THEME
}

export interface ThemeProviderProps {
  children: ReactNode
  /** Override default theme (useful for SSR or testing) */
  defaultTheme?: ThemeId
}

function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  // Lazy initialization to avoid hydration mismatch
  const [theme, setThemeState] = useState<ThemeId>(() => defaultTheme ?? getStoredTheme())
  const [mounted, setMounted] = useState(false)

  // Mark as mounted after first render
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync theme from localStorage on mount (client-side only)
  useEffect(() => {
    if (!mounted) return

    const stored = getStoredTheme()
    if (stored !== theme) {
      setThemeState(stored)
    }

    // Apply theme attribute
    document.documentElement.setAttribute("data-theme", stored)
  }, [mounted]) // eslint-disable-line react-hooks/exhaustive-deps

  // Stable setter with localStorage persistence
  const setTheme = useCallback((newTheme: ThemeId) => {
    setThemeState(newTheme)

    try {
      localStorage.setItem(STORAGE_KEY, newTheme)
    } catch {
      // Ignore localStorage errors
    }

    document.documentElement.setAttribute("data-theme", newTheme)
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      themes: THEMES,
    }),
    [theme, setTheme]
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

/**
 * Hook to access theme context.
 * Must be used within a ThemeProvider.
 */
function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

export { ThemeProvider, useTheme }
export default ThemeProvider
