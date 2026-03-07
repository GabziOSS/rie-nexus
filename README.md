# shadcn/ui monorepo template

This is a TanStack Start monorepo template with shadcn/ui.

## Adding components

To add components to your app, run the following command at the root of your `civicpulse-web` app:

```bash
yarn dlx shadcn@latest add button -c apps/civicpulse-web
```

This will place the ui components in the `repos/civicpulse/libs/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@rie-civicpulse/ui/components/button"
```
