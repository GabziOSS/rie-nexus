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
    <html lang="en" data-theme="civicpulse" suppressHydrationWarning>
      <body className="bg-background min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
