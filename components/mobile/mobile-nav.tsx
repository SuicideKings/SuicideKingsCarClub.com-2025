"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Users, Car, MessageCircle, ShoppingBag, User, Menu, X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const mobileNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/chapters", label: "Chapters", icon: Users },
  { href: "/cars", label: "Cars", icon: Car },
  { href: "/forum", label: "Forum", icon: MessageCircle },
  { href: "/store", label: "Store", icon: ShoppingBag },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">SK</span>
            </div>
            <span className="text-white font-bold text-lg">SKCC</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative text-white hover:bg-gray-800">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-600 text-xs">{notifications}</Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden">
          <div className="fixed top-16 right-0 bottom-0 w-80 bg-black border-l border-gray-800 overflow-y-auto">
            <div className="p-4">
              <div className="space-y-2">
                {mobileNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-800">
                <Link
                  href="/member/dashboard"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">My Account</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-gray-800 md:hidden">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {mobileNavItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                  isActive ? "text-red-500" : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
