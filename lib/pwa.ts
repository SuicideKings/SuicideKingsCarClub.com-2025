// PWA utilities and service worker management
export class PWAManager {
  private static instance: PWAManager
  private registration: ServiceWorkerRegistration | null = null

  static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager()
    }
    return PWAManager.instance
  }

  async registerServiceWorker(): Promise<void> {
    if ("serviceWorker" in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register("/sw.js")
        if (process.env.NODE_ENV === 'development') {
          console.log("Service Worker registered successfully")
        }

        // Listen for updates
        this.registration.addEventListener("updatefound", () => {
          const newWorker = this.registration?.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                // New content available, show update notification
                this.showUpdateNotification()
              }
            })
          }
        })
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Service Worker registration failed:", error)
        }
      }
    }
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      return permission
    }
    return "denied"
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (this.registration && "Notification" in window && Notification.permission === "granted") {
      await this.registration.showNotification(title, {
        badge: "/images/icons/icon-72x72.png",
        icon: "/images/icons/icon-192x192.png",
        ...options,
      })
    }
  }

  private showUpdateNotification(): void {
    // Show a custom update notification to the user
    const event = new CustomEvent("pwa-update-available")
    window.dispatchEvent(event)
  }

  async checkForUpdates(): Promise<void> {
    if (this.registration) {
      await this.registration.update()
    }
  }

  isInstalled(): boolean {
    return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true
  }

  async getInstallPrompt(): Promise<BeforeInstallPromptEvent | null> {
    return new Promise((resolve) => {
      const handler = (e: Event) => {
        e.preventDefault()
        window.removeEventListener("beforeinstallprompt", handler)
        resolve(e as BeforeInstallPromptEvent)
      }
      window.addEventListener("beforeinstallprompt", handler)

      // Timeout after 5 seconds
      setTimeout(() => {
        window.removeEventListener("beforeinstallprompt", handler)
        resolve(null)
      }, 5000)
    })
  }
}

// Types for PWA events
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default PWAManager
