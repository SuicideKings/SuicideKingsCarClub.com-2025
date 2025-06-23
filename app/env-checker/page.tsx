"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function EnvCheckerPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const checkEnvironment = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/test-env")

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkEnvironment()
  }, [])

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Environment Configuration Checker</CardTitle>
          <CardDescription>Verify that all required environment variables are properly configured</CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error checking environment</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          ) : data ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Stack Auth Configuration</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-medium">Project ID</span>
                    <div className="flex items-center">
                      <StatusIcon status={data.environment.stack.projectId} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-medium">Publishable Key</span>
                    <div className="flex items-center">
                      <StatusIcon status={data.environment.stack.publishableKey} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-medium">Secret Key</span>
                    <div className="flex items-center">
                      <StatusIcon status={data.environment.stack.secretKey} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">NextAuth Configuration</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-medium">Secret</span>
                    <div className="flex items-center">
                      <StatusIcon status={data.environment.nextAuth.secret} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-medium">URL</span>
                    <div className="flex items-center">
                      <StatusIcon status={data.environment.nextAuth.url} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Database Configuration</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-medium">Database URL</span>
                    <div className="flex items-center">
                      <StatusIcon status={data.environment.database.url} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-medium">Connection Test</span>
                    <div className="flex items-center">
                      <StatusIcon status={data.database.success} />
                    </div>
                  </div>
                  {data.database.success && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <p className="text-sm text-green-800">
                        Database connection successful! Server time:{" "}
                        {new Date(data.database.timestamp).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {!data.database.success && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-800">
                        Database connection failed: {JSON.stringify(data.database.error)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>

        <CardFooter>
          <Button onClick={checkEnvironment} disabled={loading} className="w-full">
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Check
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
