"use client"

import { useEffect, useState } from "react"
import { Loader2, Car, Zap } from "lucide-react"

interface AnimatedLoaderProps {
  size?: "sm" | "md" | "lg"
  variant?: "spin" | "pulse" | "wave" | "car"
  text?: string
  className?: string
}

export function AnimatedLoader({ 
  size = "md", 
  variant = "spin", 
  text,
  className = "" 
}: AnimatedLoaderProps) {
  const [dots, setDots] = useState("")

  // Animated dots for loading text
  useEffect(() => {
    if (!text) return
    
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".")
    }, 500)
    
    return () => clearInterval(interval)
  }, [text])

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  }

  const renderLoader = () => {
    switch (variant) {
      case "spin":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            <Loader2 className={`${sizeClasses[size]} animate-spin text-red-500 relative`} />
          </div>
        )
      
      case "pulse":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-red-500 rounded-full animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        )
      
      case "wave":
        return (
          <div className="flex space-x-1 items-end">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`${size === 'sm' ? 'w-1' : size === 'md' ? 'w-2' : 'w-3'} bg-gradient-to-t from-red-500 to-orange-500 rounded-full animate-pulse`}
                style={{ 
                  height: `${12 + Math.sin(i) * 8}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )
      
      case "car":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            <Car className={`${sizeClasses[size]} text-red-500 relative animate-bounce`} />
            <Zap className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-ping" />
          </div>
        )
      
      default:
        return <Loader2 className={`${sizeClasses[size]} animate-spin text-red-500`} />
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {renderLoader()}
      {text && (
        <p className="text-gray-400 font-medium">
          {text}{dots}
        </p>
      )}
    </div>
  )
}