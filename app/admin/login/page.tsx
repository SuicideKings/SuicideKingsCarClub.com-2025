"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard"
  const error = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(
    error === "CredentialsSignin" ? "Invalid email or password" : 
    error === "Configuration" ? "Server configuration error. Please check server logs." :
    error ? `Authentication error: ${error}` : null,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        if (result.error === "Configuration") {
          setErrorMessage("Server configuration error. Please check environment variables.")
        } else {
          setErrorMessage("Invalid email or password")
        }
        setIsLoading(false)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.")
      console.error("Login error:", error)
      setIsLoading(false)
    }
  }

  // For development only - auto-fill credentials
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setEmail('alex@suicidekingscarclub.com')
      setPassword('admin12345')
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-black p-8 text-white">
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/suicide-kings-car-club-logo.png"
            alt="Suicide Kings Logo"
            width={200}
            height={100}
            className="h-auto w-48"
          />
        </div>

        <h1 className="mb-6 text-center text-2xl font-bold">Admin Login</h1>

        {errorMessage && (
          <div className="mb-4 flex items-center space-x-2 rounded-lg bg-red-900/20 p-4 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 rounded-lg bg-yellow-900/20 p-4 text-yellow-400 text-sm">
            <p>Development mode: Using auto-generated secret for authentication.</p>
            <p className="mt-1">For production, set NEXTAUTH_SECRET environment variable.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-700 bg-gray-800 text-white"
              placeholder="admin@suicidekingscc.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-700 bg-gray-800 text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
