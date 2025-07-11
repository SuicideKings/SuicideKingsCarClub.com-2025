"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingNotificationProps {
  type?: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number
  onClose?: () => void
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
  showProgress?: boolean
}

export function FloatingNotification({
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  position = "top-right",
  showProgress = true
}: FloatingNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)

    // Progress bar animation
    if (showProgress && duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100))
          return newProgress <= 0 ? 0 : newProgress
        })
      }, 100)

      // Auto close
      const closeTimer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => {
        clearTimeout(timer)
        clearInterval(interval)
        clearTimeout(closeTimer)
      }
    }

    return () => clearTimeout(timer)
  }, [duration, showProgress])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  }

  const colors = {
    success: "border-green-500/30 bg-green-950/80 shadow-green-500/10",
    error: "border-red-500/30 bg-red-950/80 shadow-red-500/10",
    warning: "border-yellow-500/30 bg-yellow-950/80 shadow-yellow-500/10",
    info: "border-blue-500/30 bg-blue-950/80 shadow-blue-500/10"
  }

  const progressColors = {
    success: "bg-green-400",
    error: "bg-red-400", 
    warning: "bg-yellow-400",
    info: "bg-blue-400"
  }

  const positionClasses = {
    "top-right": "top-4 right-4 animate-in slide-in-from-right",
    "top-left": "top-4 left-4 animate-in slide-in-from-left",
    "bottom-right": "bottom-4 right-4 animate-in slide-in-from-right",
    "bottom-left": "bottom-4 left-4 animate-in slide-in-from-left",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2 animate-in slide-in-from-top",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2 animate-in slide-in-from-bottom"
  }

  return (
    <div
      className={cn(
        "fixed z-50 max-w-sm w-full transition-all duration-300",
        positionClasses[position],
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border backdrop-blur-xl shadow-2xl",
          colors[type]
        )}
      >
        {/* Progress bar */}
        {showProgress && duration > 0 && (
          <div className="absolute top-0 left-0 h-1 w-full bg-black/20">
            <div
              className={cn(
                "h-full transition-all duration-100 ease-linear",
                progressColors[type]
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {icons[type]}
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white mb-1">
                {title}
              </h4>
              {message && (
                <p className="text-sm text-gray-300 leading-relaxed">
                  {message}
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-white/10 transition-colors duration-200 group"
            >
              <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: "success" | "error" | "warning" | "info"
    title: string
    message?: string
    duration?: number
  }>>([])

  const addNotification = (notification: Omit<typeof notifications[0], "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { ...notification, id }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    success: (title: string, message?: string) => 
      addNotification({ type: "success", title, message }),
    error: (title: string, message?: string) => 
      addNotification({ type: "error", title, message }),
    warning: (title: string, message?: string) => 
      addNotification({ type: "warning", title, message }),
    info: (title: string, message?: string) => 
      addNotification({ type: "info", title, message }),
  }
}