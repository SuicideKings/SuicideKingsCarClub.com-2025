"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShoppingBag,
  MessageSquare,
  Settings,
  BarChart,
  FileText,
  CreditCard,
  Map,
  ChevronDown,
  ChevronRight,
  Palette,
  Banknote,
} from "lucide-react"

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

export default function AdminSidebar() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleItem = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <div className="hidden lg:flex h-[calc(100vh-4rem)] w-64 flex-col bg-gray-900">
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
          {sidebarItems.map((item) => (
            <div key={item.title} className="mb-1">
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleItem(item.title)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.title}
                    </div>
                    {expandedItems[item.title] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedItems[item.title] && (
                    <div className="mt-1 ml-6 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="block rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white"
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
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-700">
            <Image src="/admin-user-avatar.png" alt="Admin Avatar" width={32} height={32} className="rounded-full" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
