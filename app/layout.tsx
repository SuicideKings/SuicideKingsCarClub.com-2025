import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import MobileNav from "@/components/mobile/mobile-nav"
import InstallPrompt from "@/components/mobile/install-prompt"
import MainNav from "@/components/main-nav"
import AnnouncementBanner from "@/components/announcement-banner"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
  manifest: "/manifest.json",
  themeColor: "#dc2626",
  appleWebAppCapable: "yes",
  appleMobileWebAppStatusBarStyle: "black-translucent",
  appleMobileWebAppTitle: "SKCC",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SKCC" />
      </head>
      <body>
        <AnnouncementBanner />
        <MainNav />
        {children}
        <MobileNav />
        <InstallPrompt />
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
