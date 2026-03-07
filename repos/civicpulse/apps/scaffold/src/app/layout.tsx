import type { Metadata, Viewport } from "next"
import "@rie-civicpulse/ui/globals.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "CivicPulse Scaffold",
  description: "Component testing environment for CivicPulse UI library",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
