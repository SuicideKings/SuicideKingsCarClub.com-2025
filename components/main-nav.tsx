"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Car, Calendar, ImageIcon, MessageSquare, Menu, X, ShoppingBag, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Users },
    { name: "Cars", href: "/cars", icon: Car },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Gallery", href: "/gallery", icon: ImageIcon },
    { name: "Store", href: "/store", icon: ShoppingBag },
    { name: "Forum", href: "/forum", icon: MessageCircle },
    { name: "Contact", href: "/contact", icon: MessageSquare },
  ]

  return (
    <header className="fixed top-12 left-0 right-0 z-40 w-full bg-black border-t border-red-600/30 hidden md:block">
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
        <nav>
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
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-red-700/30" asChild>
            <Link href="/auth/signin">Log In</Link>
          </Button>
          <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" asChild>
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
