# AGENTS.md - Agent Coding Guidelines

This document provides guidance for agentic coding agents operating in this repository.

## Project Overview

This is a Yarn monorepo using Turbo for build orchestration. The repository structure is:

```
rie-nexus/
├── repos/
│   └── civicpulse/
│       ├── apps/
│       │   └── civicpulse-web/  # TanStack Start web application
│       └── libs/
│           └── ui/              # Shared UI component library (shadcn)
└── package.json
```

## Package Manager

- **Yarn 4.13.0** (Berry) - Use `yarn` for all commands
- Run `yarn install` after pulling changes
- Do NOT use pnpm or npm - this is a Yarn monorepo

## Workspace Configuration

Workspaces are defined in `package.json`:

```json
"workspaces": [
  "./repos/*/apps/*",
  "./repos/*/libs/*"
]
```

## Commands

### Root Commands (Turbo)

| Command          | Description             |
| ---------------- | ----------------------- |
| `yarn build`     | Build all packages      |
| `yarn dev`       | Start all dev servers   |
| `yarn lint`      | Lint all packages       |
| `yarn format`    | Format all packages     |
| `yarn typecheck` | Type-check all packages |

### Individual Package Commands

Run from within the package directory (e.g., `repos/civicpulse/apps/civicpulse-web/`):

```bash
# Web app
yarn dev          # Start dev server on port 3000
yarn build        # Build for production
yarn lint         # Run ESLint
yarn format       # Format with Prettier
yarn typecheck    # Type-check with TypeScript

# UI library
yarn lint
yarn format
yarn typecheck
```

### Single Test Execution

There is currently **no test framework configured** in this project. Tests (Vitest/Jest) should be added if needed.

## Code Style

### Formatting

- **Prettier** is used for code formatting
- Configuration in `.prettierrc`:
  - 2-space indentation
  - Single quotes disabled
  - Semicolons disabled
  - Trailing commas in ES5 positions
  - 80-character line width
  - LF line endings

Run formatting: `yarn format` or `prettier --write "**/*.{ts,tsx}"`

### Linting

- **ESLint** with `@tanstack/eslint-config`
- Configuration files: `eslint.config.ts` or `eslint.config.js` in each package

Run linting: `yarn lint`

### TypeScript

- Strict mode enabled
- Module resolution: `bundler`
- Target: ES2022
- `verbatimModuleSyntax` enabled (use `import { type X }` for types)

Run typecheck: `yarn typecheck` or `tsc --noEmit`

## Naming Conventions

- **Files**: kebab-case (e.g., `my-component.tsx`, `utils.ts`)
- **Components**: PascalCase (e.g., `Button.tsx`, `SelectMenu.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`, `useCounter.ts`)
- **Utilities**: camelCase (e.g., `cn.ts`, `formatDate.ts`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`, `ApiResponse`)

## Imports

### Workspace Imports

Use workspace protocol for internal packages:

```tsx
// In civicpulse-web app, import from ui lib
import { Button } from "@rie-civicpulse/ui/components/button"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import "@rie-civicpulse/ui/globals.css"
```

### Path Aliases

The civicpulse-web app uses path aliases:

- `@/*` maps to `./src/*`
- `@rie-civicpulse/ui/*` maps to `../../libs/ui/src/*`

### Type Imports

Use explicit type imports with `import { type X }` or `import type { X }`:

```tsx
import { type ComponentProps } from "react"
import type { User } from "./types"
```

## Error Handling

- Use `try/catch` with async/await for error boundaries
- Prefer explicit error messages
- Consider using error boundaries in React components

## Component Patterns

### UI Library (shadcn)

Components live in `repos/civicpulse/libs/ui/src/components/` and use:

- Tailwind CSS for styling
- `cva` (class-variance-authority) for variants
- `cn` utility for class merging

Example component structure:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@rie-civicpulse/ui/lib/utils";

const buttonVariants = cva("...", {
  variants: {
    variant: { ... },
    size: { ... },
  },
});

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  // ...
}
```

### TanStack Start Routes

Routes are defined using file-based routing in `repos/civicpulse/apps/civicpulse-web/src/routes/`.

## Tailwind CSS v4

This project uses **Tailwind CSS v4** (not v3). Key differences:

- Configuration is in CSS, not `tailwind.config.js`
- Use `@import "tailwindcss"` in globals.css
- The `@tailwindcss/vite` plugin handles processing

## Adding New Components

To add shadcn components to the civicpulse-web app:

```bash
cd repos/civicpulse/apps/civicpulse-web
yarn dlx shadcn@latest add button
```

This places components in `repos/civicpulse/libs/ui/src/components/`.

## Git Conventions

- Use conventional commit messages
- Create feature branches from `main`
- Run `yarn lint` and `yarn typecheck` before committing

## IDE Settings

VSCode settings in `.vscode/settings.json`:

- Tailwind CSS experimental config points to UI library styles

## Important Notes

1. **No test framework** is currently configured
2. **pnpm is NOT supported** - use Yarn 4
3. The monorepo structure uses `repos/*/apps` and `repos/*/libs` (NOT `packages`)
4. All workspace packages use `workspace:*` protocol for dependencies
