"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Database, Server, Mail, CreditCard, HardDrive } from "lucide-react"

interface SystemStatus {
  status: string
  timestamp: string
  database: {
    connected: boolean
    tables?: Record<string, number>
    error?: string
  }
  statistics: {
    activeClubs: number
    pendingJobs: number
    runningJobs: number
  }
  environment: {
    required: Record<string, boolean>
    optional: Record<string, boolean>
  }
  services: {
    email: { configured: boolean; status: string }
    paypal: { configured: boolean; status: string }
    storage: { configured: boolean; status: string }
  }
}

export default function SystemStatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/system/status")
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Failed to fetch system status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const getStatusBadge = (isHealthy: boolean, label: string) => (
    <Badge variant={isHealthy ? "default" : "destructive"} className={isHealthy ? "bg-green-500" : ""}>
      {isHealthy ? "✓" : "✗"} {label}
    </Badge>
  )

  if (loading && !status) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Status</h1>
          <p className="text-gray-600">Monitor the health of your AI website builder backend</p>
        </div>
        <Button onClick={fetchStatus} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {lastUpdated && <p className="text-sm text-gray-500">Last updated: {lastUpdated.toLocaleString()}</p>}

      {status && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Database Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database
              </CardTitle>
              <CardDescription>Database connectivity and table status</CardDescription>
            </CardHeader>
            <CardContent>
              {getStatusBadge(status.database.connected, "Connected")}
              {status.database.tables && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Table Counts:</p>
                  {Object.entries(status.database.tables).map(([table, count]) => (
                    <div key={table} className="flex justify-between text-sm">
                      <span>{table}:</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              )}
              {status.database.error && <p className="text-red-500 text-sm mt-2">{status.database.error}</p>}
            </CardContent>
          </Card>

          {/* System Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Statistics
              </CardTitle>
              <CardDescription>Current system metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Active Clubs:</span>
                <Badge variant="outline">{status.statistics.activeClubs}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Pending Jobs:</span>
                <Badge variant="outline">{status.statistics.pendingJobs}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Running Jobs:</span>
                <Badge variant="outline">{status.statistics.runningJobs}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Environment
              </CardTitle>
              <CardDescription>Required and optional environment variables</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Required:</p>
                <div className="space-y-1">
                  {Object.entries(status.environment.required).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span>{key}:</span>
                      {getStatusBadge(value, value ? "Set" : "Missing")}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Optional:</p>
                <div className="space-y-1">
                  {Object.entries(status.environment.optional).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span>{key}:</span>
                      {getStatusBadge(value, value ? "Set" : "Not Set")}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Service
              </CardTitle>
              <CardDescription>Email notification system status</CardDescription>
            </CardHeader>
            <CardContent>{getStatusBadge(status.services.email.configured, status.services.email.status)}</CardContent>
          </Card>

          {/* PayPal Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                PayPal Service
              </CardTitle>
              <CardDescription>PayPal integration status</CardDescription>
            </CardHeader>
            <CardContent>
              {getStatusBadge(status.services.paypal.configured, status.services.paypal.status)}
            </CardContent>
          </Card>

          {/* Storage Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Service
              </CardTitle>
              <CardDescription>File storage system status</CardDescription>
            </CardHeader>
            <CardContent>
              {getStatusBadge(status.services.storage.configured, status.services.storage.status)}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
