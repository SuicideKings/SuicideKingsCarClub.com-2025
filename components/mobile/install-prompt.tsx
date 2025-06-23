"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDeferredPrompt(null)
  }

  if (!showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <div className="rounded-lg border border-gray-700 bg-black p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-white">Install SKCC App</h3>
            <p className="mt-1 text-sm text-gray-400">
              Get the full app experience with offline access and notifications.
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={handleInstall}>
            <Download className="mr-2 h-4 w-4" />
            Install
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
            onClick={handleDismiss}
          >
            Not Now
          </Button>
        </div>
      </div>
    </div>
  )
}
