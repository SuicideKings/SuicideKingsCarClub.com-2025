"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react"

interface EnvStatus {
  name: string
  exists: boolean
  value: string
}

export default function EnvCheckPage() {
  const [envStatus, setEnvStatus] = useState<EnvStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableEnvVars, setAvailableEnvVars] = useState(0)
  const [similarVariables, setSimilarVariables] = useState<string[]>([])

  useEffect(() => {
    checkEnvironment()
  }, [])

  async function checkEnvironment() {
    try {
      setLoading(true)
      const response = await fetch("/api/check-env")
      const data = await response.json()

      setEnvStatus(data.all || [])
      setAvailableEnvVars(data.availableEnvVars || 0)
      setSimilarVariables(data.similarVariables || [])

      if (data.missing && data.missing.length > 0) {
        setError(`Missing: ${data.missing.join(", ")}`)
      } else {
        setError(null)
      }
    } catch (err) {
      setError("Failed to check environment variables")
      if (process.env.NODE_ENV === 'development') {
        console.error("Error checking environment:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Environment Variables Check</h1>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 rounded-lg border border-red-800 bg-red-900/20 p-4 text-red-400">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="mb-6 rounded-lg border border-yellow-800 bg-yellow-900/20 p-4 text-yellow-400">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium">Environment Information</p>
                  <p>Total environment variables available: {availableEnvVars}</p>
                  {similarVariables.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Similar variables found:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {similarVariables.map((v) => (
                          <li key={v} className="font-mono text-sm">
                            {v}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {envStatus.map((env) => (
                <div
                  key={env.name}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    env.exists ? "border-green-800 bg-green-900/20" : "border-red-800 bg-red-900/20"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {env.exists ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-mono text-white">{env.name}</span>
                  </div>
                  <span className={env.exists ? "text-green-400" : "text-red-400"}>{env.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-gray-800 bg-black p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Required Environment Variables</h2>
              <div className="space-y-4 text-sm text-gray-300">
                <div>
                  <strong className="text-white">SKINGS_DATABASE_URL:</strong>
                  <p>Your Neon database connection URL</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Fallbacks: DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL, SUPABASE_URL, NEON_DATABASE_URL
                  </p>
                </div>
                <div>
                  <strong className="text-white">SKINGS_STACK_SECRET_SERVER_KEY:</strong>
                  <p>Your Stack Auth secret key</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Fallbacks: NEXTAUTH_SECRET, AUTH_SECRET, JWT_SECRET, SUPABASE_JWT_SECRET
                  </p>
                </div>
                <div>
                  <strong className="text-white">BLOB_READ_WRITE_TOKEN:</strong>
                  <p>Your Vercel Blob storage token</p>
                  <p className="mt-1 text-xs text-gray-400">Fallbacks: VERCEL_BLOB_READ_WRITE_TOKEN</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-blue-800 bg-blue-900/20 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">How to Fix</h2>
              <ol className="list-decimal pl-5 space-y-3 text-blue-200">
                <li>
                  <strong>Check your .env file:</strong> Make sure you have a .env file with these variables.
                </li>
                <li>
                  <strong>Check Vercel environment variables:</strong> If deploying on Vercel, make sure these variables
                  are set in your project settings.
                </li>
                <li>
                  <strong>Restart your development server:</strong> After adding environment variables, restart your
                  server.
                </li>
                <li>
                  <strong>Check for typos:</strong> Ensure variable names are exactly as expected.
                </li>
                <li>
                  <strong>Create a .env.local file:</strong> For local development, use a .env.local file which takes
                  precedence.
                </li>
              </ol>
            </div>

            <div className="mt-6 flex space-x-4">
              <Button onClick={checkEnvironment} className="bg-white text-black hover:bg-gray-200">
                Refresh Check
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800"
                onClick={() => (window.location.href = "/")}
              >
                Back to Home
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
