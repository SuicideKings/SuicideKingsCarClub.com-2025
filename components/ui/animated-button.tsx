"use client"

import { forwardRef, ReactNode } from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface AnimatedButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  animation?: "glow" | "slide" | "scale" | "rotate" | "bounce" | "shimmer"
  glowColor?: "red" | "blue" | "green" | "purple" | "yellow"
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    loading = false, 
    loadingText,
    leftIcon,
    rightIcon,
    animation = "glow",
    glowColor = "red",
    className,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    const animationClasses = {
      glow: `relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-${glowColor}-500/25 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700`,
      slide: "relative overflow-hidden group transition-all duration-300 before:absolute before:inset-0 before:bg-white/10 before:translate-x-[-100%] hover:before:translate-x-0 before:transition-transform before:duration-300",
      scale: "transform transition-all duration-200 hover:scale-105 active:scale-95",
      rotate: "transform transition-all duration-300 hover:rotate-1 active:rotate-0",
      bounce: "transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0",
      shimmer: "relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%] animate-shimmer hover:animate-none transition-all duration-300"
    }

    const glowColors = {
      red: "hover:shadow-red-500/25 focus:ring-red-500/50",
      blue: "hover:shadow-blue-500/25 focus:ring-blue-500/50",
      green: "hover:shadow-green-500/25 focus:ring-green-500/50",
      purple: "hover:shadow-purple-500/25 focus:ring-purple-500/50",
      yellow: "hover:shadow-yellow-500/25 focus:ring-yellow-500/50"
    }

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "relative",
          animationClasses[animation],
          glowColors[glowColor],
          "focus:ring-2 focus:ring-offset-2 focus:ring-offset-black",
          isDisabled && "opacity-60 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {/* Background overlay for shimmer effect */}
        {animation === "shimmer" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        )}
        
        {/* Content wrapper */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {loadingText || children}
            </>
          ) : (
            <>
              {leftIcon && (
                <span className="transition-transform duration-200 group-hover:scale-110">
                  {leftIcon}
                </span>
              )}
              {children}
              {rightIcon && (
                <span className="transition-transform duration-200 group-hover:scale-110 group-hover:translate-x-1">
                  {rightIcon}
                </span>
              )}
            </>
          )}
        </span>
        
        {/* Ripple effect */}
        <span className="absolute inset-0 overflow-hidden rounded-inherit">
          <span className="absolute inset-0 rounded-inherit bg-white/5 transform scale-0 group-active:scale-100 transition-transform duration-200" />
        </span>
      </Button>
    )
  }
)

AnimatedButton.displayName = "AnimatedButton"