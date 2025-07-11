"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/lib/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  variant?: "icon" | "button" | "compact"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function ThemeToggle({ 
  variant = "icon", 
  size = "md",
  showLabel = false,
  className 
}: ThemeToggleProps) {
  const { theme, setTheme, actualTheme } = useTheme()

  if (variant === "compact") {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={() => setTheme(actualTheme === "dark" ? "light" : "dark")}
        className={cn(
          "relative overflow-hidden transition-all duration-300 border-gray-700 bg-black/20 text-white hover:bg-gray-800 backdrop-blur-sm group",
          className
        )}
      >
        <div className="relative flex items-center gap-2">
          <div className="relative w-5 h-5">
            <Sun 
              className={cn(
                "absolute w-5 h-5 transition-all duration-500 transform",
                actualTheme === "dark" 
                  ? "rotate-90 scale-0 opacity-0" 
                  : "rotate-0 scale-100 opacity-100"
              )}
            />
            <Moon 
              className={cn(
                "absolute w-5 h-5 transition-all duration-500 transform",
                actualTheme === "dark" 
                  ? "rotate-0 scale-100 opacity-100" 
                  : "-rotate-90 scale-0 opacity-0"
              )}
            />
          </div>
          {showLabel && (
            <span className="text-sm font-medium capitalize">
              {actualTheme}
            </span>
          )}
        </div>
        
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>
    )
  }

  if (variant === "button") {
    return (
      <div className={cn("flex items-center rounded-lg border border-gray-700 bg-black/20 backdrop-blur-sm p-1", className)}>
        {[
          { key: "light", icon: Sun, label: "Light" },
          { key: "dark", icon: Moon, label: "Dark" },
          { key: "system", icon: Monitor, label: "System" }
        ].map(({ key, icon: Icon, label }) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            onClick={() => setTheme(key as any)}
            className={cn(
              "relative h-8 px-3 text-xs font-medium transition-all duration-200",
              theme === key
                ? "bg-red-600 text-white shadow-lg" 
                : "text-gray-400 hover:text-white hover:bg-white/10"
            )}
          >
            <Icon className="w-4 h-4 mr-1" />
            {label}
            {theme === key && (
              <div className="absolute inset-0 bg-red-600 rounded-md -z-10 animate-in fade-in zoom-in-95 duration-200" />
            )}
          </Button>
        ))}
      </div>
    )
  }

  // Default icon variant with dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={cn(
            "relative overflow-hidden border-gray-700 bg-black/20 text-white hover:bg-gray-800 backdrop-blur-sm group",
            className
          )}
        >
          <div className="relative w-5 h-5">
            <Sun 
              className={cn(
                "absolute w-5 h-5 transition-all duration-500 transform",
                actualTheme === "dark" 
                  ? "rotate-90 scale-0 opacity-0" 
                  : "rotate-0 scale-100 opacity-100"
              )}
            />
            <Moon 
              className={cn(
                "absolute w-5 h-5 transition-all duration-500 transform",
                actualTheme === "dark" 
                  ? "rotate-0 scale-100 opacity-100" 
                  : "-rotate-90 scale-0 opacity-0"
              )}
            />
          </div>
          <span className="sr-only">Toggle theme</span>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="bg-black/90 border-gray-700 backdrop-blur-xl"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-2 text-white hover:bg-white/10 focus:bg-white/10",
            theme === "light" && "bg-red-600/20 text-red-400"
          )}
        >
          <Sun className="w-4 h-4" />
          <span>Light</span>
          {theme === "light" && (
            <div className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-2 text-white hover:bg-white/10 focus:bg-white/10",
            theme === "dark" && "bg-red-600/20 text-red-400"
          )}
        >
          <Moon className="w-4 h-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <div className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-2 text-white hover:bg-white/10 focus:bg-white/10",
            theme === "system" && "bg-red-600/20 text-red-400"
          )}
        >
          <Monitor className="w-4 h-4" />
          <span>System</span>
          {theme === "system" && (
            <div className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}