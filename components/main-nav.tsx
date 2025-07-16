"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Car, Calendar, ImageIcon, MessageSquare, Menu, X, ShoppingBag, MessageCircle, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Users },
    { name: "Chapters", href: "/chapters", icon: MapPin },
    { name: "Cars", href: "/cars", icon: Car },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Gallery", href: "/gallery", icon: ImageIcon },
    { name: "Store", href: "/store", icon: ShoppingBag },
    { name: "Forum", href: "/forum", icon: MessageCircle },
    { name: "Contact", href: "/contact", icon: MessageSquare },
  ]

  return (
    <header className="fixed top-12 left-0 right-0 z-40 w-full bg-black border-t border-red-600/30">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/suicide-kings-car-club-logo.png"
              alt="Suicide Kings Logo"
              width={120}
              height={60}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || (pathname !== "/" && item.href !== "/" && pathname.startsWith(item.href))

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-1 text-sm transition-colors hover:text-white",
                      isActive ? "text-white" : "text-gray-300",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex md:items-center md:space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-red-700/30" asChild>
            <Link href="/auth/signin">Log In</Link>
          </Button>
          <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" asChild>
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-red-700/30">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || (pathname !== "/" && item.href !== "/" && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium hover:bg-red-700/30 hover:text-white",
                    isActive ? "bg-red-700/50 text-white" : "text-gray-300",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}

            {/* Auth Buttons - Mobile */}
            <div className="mt-4 flex flex-col space-y-2 px-3">
              <Button variant="outline" className="border-red-700 text-gray-300 hover:bg-red-700/30" asChild>
                <Link href="/auth/signin">Log In</Link>
              </Button>
              <Button className="bg-red-600 text-white hover:bg-red-700" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
