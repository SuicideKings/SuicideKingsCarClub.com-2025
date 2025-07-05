import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import MobileNav from "@/components/mobile/mobile-nav"
import InstallPrompt from "@/components/mobile/install-prompt"
import MainNav from "@/components/main-nav"
import AnnouncementBanner from "@/components/announcement-banner"
import ScrollToTop from "@/components/scroll-to-top"

export const metadata: Metadata = {
  title: "Suicide Kings Car Club - 1961-1969 Lincoln Continental Enthusiasts",
  description: "Join the Suicide Kings Car Club - A community of enthusiasts dedicated to the iconic Lincoln Continental with its legendary suicide doors from 1961-1969",
  keywords: "Lincoln Continental, suicide doors, car club, classic cars, vintage automobiles, 1961-1969 Lincoln",
  authors: [{ name: "Suicide Kings Car Club" }],
  manifest: "/manifest.json",
  appleWebAppCapable: "yes",
  appleMobileWebAppStatusBarStyle: "black-translucent",
  appleMobileWebAppTitle: "SKCC",
  openGraph: {
    title: "Suicide Kings Car Club",
    description: "A community of enthusiasts dedicated to the iconic Lincoln Continental with its legendary suicide doors",
    url: "https://suicidekingscarclub.com",
    siteName: "Suicide Kings Car Club",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suicide Kings Car Club",
    description: "A community of enthusiasts dedicated to the iconic Lincoln Continental with its legendary suicide doors",
  },
}

export const viewport: Viewport = {
  themeColor: "#dc2626",
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
        <ScrollToTop />
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
