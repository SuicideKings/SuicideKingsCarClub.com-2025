"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function SetupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const [adminEmail, setAdminEmail] = useState("admin@suicidekingscc.com")
  const [adminPassword, setAdminPassword] = useState("")
  const [adminName, setAdminName] = useState("Admin User")

  async function setupDatabase() {
    if (!adminEmail || !adminPassword) {
      setStatus("error")
      setMessage("Please provide admin email and password")
      return
    }

    setIsLoading(true)
    setStatus("loading")
    setMessage("Setting up database tables...")

    try {
      const response = await fetch("/api/setup-db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          createDefaultAdmin: true,
          adminEmail,
          adminPassword,
          adminName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to set up database")
      }

      setStatus("success")
      setMessage("Database setup completed successfully!")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/login")
      }, 2000)
    } catch (error) {
      console.error("Setup error:", error)
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-black p-8 text-white">
        <h1 className="mb-6 text-2xl font-bold">Suicide Kings Admin Setup</h1>

        <div className="mb-6 rounded-lg border border-gray-800 bg-gray-900 p-4">
          <h2 className="mb-2 text-lg font-medium">Database Setup</h2>
          <p className="mb-4 text-sm text-gray-400">
            This will create the necessary database tables and admin user for the system.
          </p>

          <div className="mb-4 space-y-4">
            <div>
              <label htmlFor="adminName" className="mb-2 block text-sm font-medium">
                Admin Name
              </label>
              <Input
                id="adminName"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="border-gray-700 bg-gray-800 text-white"
                placeholder="Admin User"
                required
              />
            </div>

            <div>
              <label htmlFor="adminEmail" className="mb-2 block text-sm font-medium">
                Admin Email
              </label>
              <Input
                id="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="border-gray-700 bg-gray-800 text-white"
                placeholder="admin@suicidekingscc.com"
                required
              />
            </div>

            <div>
              <label htmlFor="adminPassword" className="mb-2 block text-sm font-medium">
                Admin Password
              </label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="border-gray-700 bg-gray-800 text-white"
                placeholder="Create a strong password"
                required
              />
            </div>
          </div>

          {status === "idle" ? (
            <Button
              onClick={setupDatabase}
              className="w-full bg-white text-black hover:bg-gray-200"
              disabled={isLoading}
            >
              Initialize Database
            </Button>
          ) : status === "loading" ? (
            <div className="flex items-center justify-center space-x-2 rounded-lg bg-gray-800 p-4">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
              <span>{message}</span>
            </div>
          ) : status === "success" ? (
            <div className="flex items-center space-x-2 rounded-lg bg-green-900/20 p-4 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span>{message}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 rounded-lg bg-red-900/20 p-4 text-red-400">
              <XCircle className="h-5 w-5" />
              <span>{message}</span>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>After setup is complete, you will be redirected to the admin login page.</p>
        </div>
      </div>
    </div>
  )
}
