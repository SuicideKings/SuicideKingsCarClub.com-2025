"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Menu,
  X,
  Home,
  Car,
  Calendar,
  ShoppingBag,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Bell,
  CreditCard,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MemberData {
  firstName: string
  lastName: string
  memberNumber: string
  profileImageUrl?: string
  unreadNotifications: number
}

export default function MemberNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [memberData, setMemberData] = useState<MemberData | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetchMemberData()
  }, [])

  const fetchMemberData = async () => {
    try {
      const token = localStorage.getItem("memberToken")
      if (!token) return

      const response = await fetch("/api/member/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMemberData(data.member)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error fetching member data:", error)
      }
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("memberToken")
    router.push("/")
  }

  const navItems = [
    { href: "/member/dashboard", label: "Dashboard", icon: Home },
    { href: "/member/cars", label: "My Cars", icon: Car },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/store", label: "Store", icon: ShoppingBag },
    { href: "/member/messages", label: "Messages", icon: MessageSquare },
    { href: "/member/membership", label: "Membership", icon: CreditCard },
  ]

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/member/dashboard" className="flex items-center space-x-2">
            <Image
              src="/images/suicide-kings-car-club-logo.png"
              alt="Suicide Kings Car Club"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="text-xl font-bold text-white">SKCC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-red-700 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-gray-300 hover:text-white hover:bg-gray-800"
              asChild
            >
              <Link href="/member/notifications">
                <Bell className="h-5 w-5" />
                {memberData?.unreadNotifications && memberData.unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-600 text-xs">
                    {memberData.unreadNotifications > 9 ? "9+" : memberData.unreadNotifications}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Profile Dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                {memberData?.profileImageUrl ? (
                  <Image
                    src={memberData.profileImageUrl || "/placeholder.svg"}
                    alt="Profile"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="text-sm">
                  {memberData ? `${memberData.firstName} ${memberData.lastName}` : "Member"}
                </span>
              </Button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">
                      {memberData ? `${memberData.firstName} ${memberData.lastName}` : "Member"}
                    </p>
                    <p className="text-xs text-gray-400">{memberData ? `#${memberData.memberNumber}` : ""}</p>
                  </div>
                  <Link
                    href="/member/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    href="/member/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? "bg-red-700 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              <div className="border-t border-gray-700 pt-4 mt-4">
                <Link
                  href="/member/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/member/settings"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
