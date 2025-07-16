import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import ConditionalNav from "@/components/conditional-nav"
import InstallPrompt from "@/components/mobile/install-prompt"
import { ThemeProvider } from "@/lib/theme-provider"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SKCC" />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="suicide-kings-theme">
          <ConditionalNav />
          {children}
          <InstallPrompt />
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `,
          }}
        />
      </body>
    </html>
  )
}
