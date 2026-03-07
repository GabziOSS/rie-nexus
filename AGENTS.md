# Agent Guidelines for rie-nexus

This is a Yarn monorepo using Turbo for build orchestration.

---

## Project Structure

```
rie-nexus/
├── repos/
│   └── civicpulse/
│       ├── apps/
│       │   ├── civicpulse-web/       # TanStack Start (real app)
│       │   └── civicpulse-scaffold/  # Next.js App Router (v0 surrogate — disposable)
│       └── libs/
│           └── ui/                   # Shared UI component library (@rie-civicpulse/ui)
├── AGENTS.md
├── opencode.json
├── package.json
└── turbo.json
```

---

## Workspace Packages

| Package       | Path                                        | Name                        | Role                                           |
| ------------- | ------------------------------------------- | --------------------------- | ---------------------------------------------- |
| Real web app  | `repos/civicpulse/apps/civicpulse-web`      | `civicpulse-web`            | TanStack Start SPA                             |
| Surrogate app | `repos/civicpulse/apps/civicpulse-scaffold` | `civicpulse-scaffold`       | Next.js App Router — v0 generation target only |
| UI library    | `repos/civicpulse/libs/ui`                  | `@rie-civicpulse/ui`        | shadcn components + themes                     |
| Mock data     | `repos/civicpulse/libs/mock-data`           | `@rie-civicpulse/mock-data` | Generated safety data (added in later chunk)   |

---

## Surrogate App Rules

`civicpulse-scaffold` is a Next.js App Router app used exclusively as a
v0 generation target and visual QA environment.

- All real components live in `libs/ui` — not in the scaffold
- The scaffold only imports from `@rie-civicpulse/ui`
- Do NOT add business logic to civicpulse-scaffold
- Do NOT import from civicpulse-scaffold into civicpulse-web
- The scaffold is disposable — delete it when no longer needed for visual QA

---

## Package Manager

- **Yarn 4** — use `yarn` for all commands
- Never use pnpm or npm
- Run `yarn install` after pulling changes or adding packages

---

## Workspace Configuration

```json
"workspaces": [
  "./repos/*/apps/*",
  "./repos/*/libs/*"
]
```

---

## Commands

### Root (Turbo)

| Command          | Description             |
| ---------------- | ----------------------- |
| `yarn build`     | Build all packages      |
| `yarn dev`       | Start all dev servers   |
| `yarn lint`      | Lint all packages       |
| `yarn format`    | Format all packages     |
| `yarn typecheck` | Type-check all packages |

### Per-package

```bash
# Scope to a specific package
yarn --filter civicpulse-web dev
yarn --filter civicpulse-scaffold dev
yarn --filter @rie-civicpulse/ui typecheck

# Install into a specific package
yarn workspace civicpulse-web add [package]
yarn workspace @rie-civicpulse/ui add [package]
```

---

## Branch Convention

- `main` — stable, reviewed code only
- `feat/v0-scaffold` — v0 generation output, reviewed before merging
- Feature branches from `main` for all other work

---

## Code Style

- **Prettier**: 2-space indent, no semicolons, double quotes, trailing commas ES5, LF
- **ESLint**: `@tanstack/eslint-config`
- **TypeScript**: strict mode, `verbatimModuleSyntax`, use `import { type X }`
- **Files**: kebab-case (`my-component.tsx`)
- **Components**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase with `use` prefix (`useMyHook.ts`)

---

## Import Patterns

```tsx
// UI components
import { Button } from "@rie-civicpulse/ui/components/button"
import { cn } from "@rie-civicpulse/ui/lib/utils"

// Type imports
import { type ComponentProps } from "react"
import type { Incident } from "@rie-civicpulse/mock-data/types"
```

---

## Tailwind CSS v4

- CSS-first configuration — no `tailwind.config.js`
- Use `@import "tailwindcss"` in globals.css
- `@tailwindcss/vite` or `@tailwindcss/next` handles processing
- All color values in components via CSS variables: `hsl(var(--primary))`
- Never hardcode hex or rgb values in components

---

## Important Notes

- No test framework configured yet
- pnpm is NOT supported
- All workspace packages use `workspace:*` protocol for internal deps
- Theme switching via `data-theme` attribute on `<html>`
