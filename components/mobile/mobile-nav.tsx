"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Calendar, 
  Users, 
  Car, 
  MessageCircle, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Bell,
  Sparkles,
  Settings,
  LogOut,
  ChevronRight,
  Camera
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

const mobileNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/chapters", label: "Chapters", icon: Users },
  { href: "/cars", label: "Cars", icon: Car },
  { href: "/gallery", label: "Gallery", icon: Camera },
  { href: "/forum", label: "Forum", icon: MessageCircle },
  { href: "/store", label: "Store", icon: ShoppingBag },
]

const memberNavItems = [
  { href: "/member/dashboard", label: "Dashboard", icon: Home },
  { href: "/member/cars", label: "My Cars", icon: Car },
  { href: "/member/events", label: "My Events", icon: Calendar },
  { href: "/member/profile", label: "Profile", icon: User },
]

const adminNavItems = [
  { href: "/admin/dashboard", label: "Admin Dashboard", icon: Settings },
  { href: "/admin/members", label: "Manage Members", icon: Users },
  { href: "/admin/events", label: "Manage Events", icon: Calendar },
  { href: "/admin/gallery", label: "Manage Gallery", icon: Camera },
]

interface MobileNavProps {
  user?: {
    name: string
    email: string
    avatar?: string
    role: "admin" | "member"
  }
}

export default function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      {/* Enhanced Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 backdrop-blur-xl border-b border-gray-700 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-tight">SK</span>
              <div className="text-xs text-gray-400 font-medium -mt-1">Car Club</div>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle variant="compact" size="sm" />
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10 transition-all duration-200">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-gradient-to-r from-red-500 to-red-600 text-xs animate-pulse border-2 border-black">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 transition-all duration-200 relative overflow-hidden group"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="relative">
                <Menu className={cn(
                  "h-5 w-5 transition-all duration-300 transform",
                  isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                )} />
                <X className={cn(
                  "absolute inset-0 h-5 w-5 transition-all duration-300 transform",
                  isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                )} />
              </div>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-300">
          <div className={cn(
            "fixed top-16 right-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-b from-gray-900 via-black to-gray-900 border-l border-gray-700 overflow-y-auto transition-transform duration-300 ease-out",
            "animate-in slide-in-from-right"
          )}>
            {/* User Section */}
            {user && (
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12 border-2 border-red-500/50">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user.name}</p>
                    <p className="text-gray-400 text-sm truncate">{user.email}</p>
                  </div>
                  <Badge 
                    className={cn(
                      "text-xs",
                      user.role === "admin" 
                        ? "bg-purple-600 text-white" 
                        : "bg-blue-600 text-white"
                    )}
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>
            )}

            {/* Navigation Content */}
            <div className="flex-1">
              {/* Main Navigation */}
              <div className="p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Main Navigation
                </h3>
                <nav className="space-y-1">
                  {mobileNavItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                          isActive
                            ? "bg-red-600 text-white shadow-lg"
                            : "text-gray-300 hover:text-white hover:bg-white/10"
                        )}
                      >
                        <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight className={cn(
                          "w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200",
                          isActive && "opacity-100"
                        )} />
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Member Navigation */}
              {user && user.role === "member" && (
                <div className="p-4 border-t border-gray-700">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Member Area
                  </h3>
                  <nav className="space-y-1">
                    {memberNavItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                            isActive
                              ? "bg-red-600 text-white shadow-lg"
                              : "text-gray-300 hover:text-white hover:bg-white/10"
                          )}
                        >
                          <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                          <span className="flex-1">{item.label}</span>
                          <ChevronRight className={cn(
                            "w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200",
                            isActive && "opacity-100"
                          )} />
                        </Link>
                      )
                    })}
                  </nav>
                </div>
              )}

              {/* Admin Navigation */}
              {user && user.role === "admin" && (
                <div className="p-4 border-t border-gray-700">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Admin Area
                  </h3>
                  <nav className="space-y-1">
                    {adminNavItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                            isActive
                              ? "bg-red-600 text-white shadow-lg"
                              : "text-gray-300 hover:text-white hover:bg-white/10"
                          )}
                        >
                          <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                          <span className="flex-1">{item.label}</span>
                          <ChevronRight className={cn(
                            "w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200",
                            isActive && "opacity-100"
                          )} />
                        </Link>
                      )
                    })}
                  </nav>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
              {user ? (
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-red-800 hover:text-white hover:border-red-600 group"
                  onClick={() => {
                    // Handle logout
                    console.log("Logout")
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Sign Out
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                  >
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <Link href="/membership">Join Club</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/95 via-gray-900/95 to-black/95 backdrop-blur-xl border-t border-gray-700 md:hidden">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {mobileNavItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "text-red-500" 
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-in slide-in-from-top duration-300" />
                )}
                
                <Icon className={cn(
                  "h-5 w-5 mb-1 transition-all duration-200",
                  "group-hover:scale-110",
                  isActive && "animate-pulse"
                )} />
                <span className="text-xs font-medium truncate max-w-full">{item.label}</span>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
