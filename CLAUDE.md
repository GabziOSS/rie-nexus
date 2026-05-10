# [[MONOREPO]] — Development Guide

## Quick Start

This is a Yarn 4 monorepo with Turbo. Primary project: [[PRODUCT-NAME]] (codename [[INTERNAL-CODENAME]]).

```bash
yarn install
yarn dev                                    # all packages
yarn --filter civicpulse-scaffold dev       # scaffold only (port 3000)
yarn typecheck                              # all packages
yarn build                                  # production build
```

## Project Structure

```
repos/civicpulse/
  apps/
    scaffold/     ← Next.js 16 surrogate (v0 output, disposable after migration)
    web/          ← TanStack Start target (real app)
  libs/
    ui/           ← @rie-civicpulse/ui (shared components, themes)
    mock-data/    ← @rie-civicpulse/mock-data (generators, DATA_REGISTRY)
```

## Agent Context

**Read these before any development work:**

1. `docs/agent-context/PLANNING.md` — milestones, phases, acceptance criteria, design decisions
2. `docs/agent-context/AGENT_CONTEXT.md` — full architecture specs (~1200 lines): data model, chart specs, map config, WeatherLink integration, theme system
3. `docs/agent-context/EXECUTION_PLAYBOOK.md` — step-by-step build instructions with code snippets

These documents use `[[TOKEN]]` placeholders for identity masking. Tokens are descriptive (e.g. `[[TARGET-CITY]]`, `[[UNIVERSITY-ABBREV]]`). Develop with tokens in place — restoration happens before deployment.

## Identity Masking

All documents use `[[TOKEN]]` placeholders. This is intentional — do NOT attempt to resolve or replace tokens during development.

- `[[PRODUCT-NAME]]` — the product name
- `[[TARGET-CITY]]`, `[[TARGET-PROVINCE]]`, `[[TARGET-COUNTRY]]` — deployment target location
- `[[UNIVERSITY-ABBREV]]`, `[[DEPT-ABBREV]]` — partner institution
- `[[PARTNER-AGENCY-ABBREV]]` — partner government agency
- See AGENT_CONTEXT.md for the full token list used throughout

**IDENTITY_MAP.md is NOT in this repository.** It contains the real values and is held locally by the project lead only. Tokens are restored before deployment.

## Code Style

- No semicolons, double quotes, 2-space indent, trailing commas ES5
- Files: kebab-case. Components: PascalCase. Hooks: camelCase with `use` prefix
- `import { type X }` for type-only imports
- All colors via CSS variables (`oklch(var(--token))`) — never hardcode hex/rgb
- No `next/navigation` or `next/link` imports outside `lib/routing.ts`
- No `process.env` or `import.meta.env` in components — use `clientEnv` / `serverEnv`
- No bare `Math.random()` outside `lib/mock-data/seed.ts`
- `"use client"` only where genuinely required

## Import Patterns

```tsx
// UI components (from monorepo lib)
import { Button } from "@rie-civicpulse/ui/components/button"
import { cn } from "@rie-civicpulse/ui/lib/utils"

// Mock data (from monorepo lib)
import { INCIDENTS, ZONES, DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import type { Incident, Zone } from "@rie-civicpulse/mock-data/types"

// Routing (framework isolation)
import { useSearchParams, Link } from "@/lib/routing"

// Environment (validated)
import { clientEnv } from "@/lib/env.client"
```

## Standing Rules

1. All routing via `lib/routing.ts` — never import from `next/*` directly
2. All env via `clientEnv` / `serverEnv` — never access `process.env` directly
3. `VITE_*` prefix for client env vars (not `NEXT_PUBLIC_*`)
4. All mock data deterministic via seeded PRNG (seed 20250307)
5. Theme tokens are bare oklch channels: `L% C H` — never `oklch()` wrapped
6. Hono server layer has zero framework imports — only the adapter file is framework-specific
7. WeatherLink v2 is server-to-server ONLY (CORS preflight blocks browser calls)

## Acceptance Gates (run after every phase)

```bash
yarn typecheck     # zero errors
yarn lint          # zero new warnings
yarn build         # successful production build
```

## Commits

- One commit per logical step within a phase
- Message format: `phase N.M: <imperative subject>`
- Never combine phases in a single commit

## When Stuck

1. Read `docs/agent-context/AGENT_CONTEXT.md` for the relevant section number
2. Check `docs/agent-context/EXECUTION_PLAYBOOK.md` for step-by-step code
3. If a decision isn't covered, log it as `// TODO(decision):` with context and continue with the most reversible option
