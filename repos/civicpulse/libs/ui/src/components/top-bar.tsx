/**
 * TopBar — Horizontal bar across the top of the content area.
 * Shows breadcrumbs, city name + live clock, and user actions.
 */

import { useState, useEffect } from "react"
import { Bell, CaretRight, SignOut, User, Gear } from "@phosphor-icons/react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

// TODO: wire notificationCountAtom from atoms/ui.atoms.ts
// TODO: wire userAtom from atoms/auth.atoms.ts

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface TopBarProps {
  /** Breadcrumb trail items */
  items?: BreadcrumbItem[]
  /** Number of unread notifications */
  notificationCount?: number
}

function TopBar({ items = [], notificationCount = 0 }: TopBarProps) {
  const [time, setTime] = useState<string>("")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Live clock that updates every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatted = now.toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      setTime(formatted)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownOpen && !(e.target as Element).closest("[data-dropdown]")) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [dropdownOpen])

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      {/* Left: Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && (
              <CaretRight size={12} className="text-muted-foreground" />
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Center: City name + clock */}
      <div className="absolute left-1/2 -translate-x-1/2 text-sm">
        <span className="text-foreground">Calbayog City, Samar</span>
        <span className="mx-2 text-muted-foreground">·</span>
        <span className="font-mono text-muted-foreground">{time}</span>
      </div>

      {/* Right: Notification bell + User dropdown */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell size={18} weight="duotone" />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        {/* User avatar dropdown */}
        <div className="relative" data-dropdown>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary transition-colors hover:bg-primary/30"
            aria-label="User menu"
          >
            <User size={16} weight="fill" />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border border-border bg-card p-1 shadow-lg">
              <a
                href="/profile"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <User size={14} />
                Profile
              </a>
              <a
                href="/settings"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <Gear size={14} />
                Settings
              </a>
              <div className="my-1 border-t border-border" />
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <SignOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export { TopBar }
export default TopBar
