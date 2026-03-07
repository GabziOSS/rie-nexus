"use client"

import { useState } from "react"
import { ThemeProvider } from "@rie-civicpulse/ui/components/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  )
}
