"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, Search, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function AdminNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsCount] = useState(3)
  const { user, signOut } = useAuth()

  return (
    <header className="bg-black">
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
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
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
  )
}
