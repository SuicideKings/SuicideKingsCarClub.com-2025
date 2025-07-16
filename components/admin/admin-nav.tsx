"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Bell, Menu, Search, X, LogOut, ChevronRight, LayoutDashboard, Users, Calendar, ShoppingBag, MessageSquare, Settings, BarChart, FileText, CreditCard, Map, Palette, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    title: "Visual Editor",
    icon: Palette,
    href: "/admin/editor",
  },
  {
    title: "Members",
    icon: Users,
    href: "/admin/members",
    subItems: [
      { title: "All Members", href: "/admin/members" },
      { title: "Applications", href: "/admin/members/applications" },
      { title: "Renewals", href: "/admin/members/renewals" },
    ],
  },
  {
    title: "Events",
    icon: Calendar,
    href: "/admin/events",
    subItems: [
      { title: "All Events", href: "/admin/events" },
      { title: "Create Event", href: "/admin/events/create" },
      { title: "Registrations", href: "/admin/events/registrations" },
    ],
  },
  {
    title: "Store",
    icon: ShoppingBag,
    href: "/admin/store",
    subItems: [
      { title: "Products", href: "/admin/store/products" },
      { title: "Orders", href: "/admin/store/orders" },
      { title: "Inventory", href: "/admin/store/inventory" },
    ],
  },
  {
    title: "Forum",
    icon: MessageSquare,
    href: "/admin/forum",
  },
  {
    title: "Content",
    icon: FileText,
    href: "/admin/content",
  },
  {
    title: "Finances",
    icon: CreditCard,
    href: "/admin/finances",
  },
  {
    title: "PayPal",
    icon: Banknote,
    href: "/admin/paypal",
    subItems: [
      { title: "Setup Wizard", href: "/admin/paypal/setup" },
      { title: "Monitoring", href: "/admin/paypal/monitoring" },
      { title: "Settings", href: "/admin/paypal/settings" },
    ],
  },
  {
    title: "Maps",
    icon: Map,
    href: "/admin/maps",
  },
  {
    title: "Reports",
    icon: BarChart,
    href: "/admin/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
]

export default function AdminNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [notificationsCount] = useState(3)
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const toggleItem = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <>
      <header className="bg-black border-b border-gray-800">
        <div className="mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <button
              type="button"
              className="mr-4 rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center">
              <Image
                src="/images/suicide-kings-car-club-logo.png"
                alt="Suicide Kings Logo"
                width={40}
                height={40}
                className="h-8 w-auto mr-3"
              />
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
          </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-md border border-gray-700 bg-gray-900 py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-400 focus:border-gray-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
              {notificationsCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {notificationsCount}
                </span>
              )}
            </Button>
          </div>

          {/* User info and sign out */}
          <div className="flex items-center space-x-2">
            <span className="hidden text-sm text-gray-300 md:inline-block">{user?.name || "Admin"}</span>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" asChild>
            <Link href="/">View Site</Link>
          </Button>
        </div>
      </div>
    </header>

    {/* Mobile Menu Overlay */}
    {mobileMenuOpen && (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden">
        <div className="fixed top-16 left-0 bottom-0 w-80 max-w-[85vw] bg-gray-900 border-r border-gray-700 overflow-y-auto">
          <div className="flex items-center justify-center border-b border-gray-800 py-4">
            <Image
              src="/images/suicide-kings-car-club-logo.png"
              alt="Suicide Kings Logo"
              width={150}
              height={75}
              className="h-auto w-32"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname === sub.href))
                
                return (
                  <div key={item.title} className="mb-1">
                    {item.subItems ? (
                      <>
                        <button
                          onClick={() => toggleItem(item.title)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive 
                              ? "bg-red-600 text-white"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          )}
                        >
                          <div className="flex items-center">
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.title}
                          </div>
                          {expandedItems[item.title] ? (
                            <ChevronRight className="h-4 w-4 rotate-90 transition-transform" />
                          ) : (
                            <ChevronRight className="h-4 w-4 transition-transform" />
                          )}
                        </button>
                        {expandedItems[item.title] && (
                          <div className="mt-1 ml-6 space-y-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.href}
                                className={cn(
                                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                  pathname === subItem.href
                                    ? "bg-red-600 text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-red-600 text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.title}
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    )}
  </>
  )
}
