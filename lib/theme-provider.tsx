"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Theme = "dark" | "light" | "system"
type ActualTheme = "dark" | "light"

interface ThemeProviderContextType {
  theme: Theme
  actualTheme: ActualTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = "dark", // Default to dark for the car club aesthetic
  storageKey = "suicide-kings-theme"
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [actualTheme, setActualTheme] = useState<ActualTheme>("dark")

  // Immediately apply dark theme on mount
  useEffect(() => {
    document.documentElement.classList.add("dark")
    document.body.classList.add("dark")
  }, [])

  useEffect(() => {
    // Load theme from localStorage
    const storedTheme = localStorage.getItem(storageKey) as Theme
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove existing theme classes
    root.classList.remove("light", "dark")
    
    let resolvedTheme: ActualTheme
    
    if (theme === "system") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    } else {
      resolvedTheme = theme
    }
    
    setActualTheme(resolvedTheme)
    root.classList.add(resolvedTheme)
    
    // Force dark theme styling by also adding it to body
    document.body.classList.remove("light", "dark")
    document.body.classList.add(resolvedTheme)
    
    // Store theme in localStorage
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  const value = {
    theme,
    actualTheme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme)
    },
    toggleTheme: () => {
      setTheme(actualTheme === "dark" ? "light" : "dark")
    }
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  
  return context
}