"use client"

import { usePathname } from "next/navigation"
import MainNav from "@/components/main-nav"
import MobileNav from "@/components/mobile/mobile-nav"
import AnnouncementBanner from "@/components/announcement-banner"

export default function ConditionalNav() {
  const pathname = usePathname()

  // Don't render public navigation on admin routes
  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <>
      <AnnouncementBanner />
      <MainNav />
      <MobileNav />
    </>
  )
}