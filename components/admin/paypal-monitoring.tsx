"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  BarChart
} from "lucide-react"
import { format } from "date-fns"

interface PayPalMonitoringProps {
  isAdmin?: boolean
  clubId?: number
}

interface HealthStatus {
  healthy: boolean
  message: string
  lastChecked: string
  details?: {
    apiConnection: boolean
    webhookActive: boolean
    recentActivity: boolean
  }
}

interface Metrics {
  totalRevenue: number
  transactionCount: number
  successRate: number
  averageTransaction: number
  revenueByPeriod: {
    daily: number
    weekly: number
    monthly: number
  }
  topClubs?: Array<{
    clubId: number
    clubName: string
    revenue: number
    transactions: number
  }>
}

interface Transaction {
  id: string
  clubId: number
  clubName?: string
  amount: number
  currency: string
  status: string
  type: string
  createdAt: string
  memberEmail?: string
}

interface WebhookLog {
  id: string
  eventType: string
  status: string
  processedAt: string
  clubId: number
  clubName?: string
  error?: string
}

export default function PayPalMonitoring({ isAdmin = false, clubId }: PayPalMonitoringProps) {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dateRange, setDateRange] = useState("7d")
  const [selectedClub, setSelectedClub] = useState<string>(clubId?.toString() || "all")
  
  // Data states
  const [healthStatus, setHealthStatus] = useState<Record<string, HealthStatus>>({})
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([])
  const [clubs, setClubs] = useState<Array<{ id: number; name: string }>>([])

  useEffect(() => {
    loadData()
  }, [dateRange, selectedClub])

  const loadData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadHealthStatus(),
        loadMetrics(),
        loadTransactions(),
        loadWebhookLogs(),
        isAdmin && loadClubs()
      ])
    } catch (error) {
      console.error("Failed to load monitoring data:", error)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const loadHealthStatus = async () => {
    const endpoint = isAdmin 
      ? "/api/admin/paypal-monitoring?type=health"
      : `/api/clubs/${clubId}/paypal-monitoring?type=health`
    
    const response = await fetch(endpoint)
    if (response.ok) {
      const data = await response.json()
      setHealthStatus(data)
    }
  }

  const loadMetrics = async () => {
    const params = new URLSearchParams({
      type: "metrics",
      dateRange,
      ...(selectedClub !== "all" && { clubId: selectedClub })
    })
    
    const endpoint = isAdmin 
      ? `/api/admin/paypal-monitoring?${params}`
      : `/api/clubs/${clubId}/paypal-monitoring?${params}`
    
    const response = await fetch(endpoint)
    if (response.ok) {
      const data = await response.json()
      setMetrics(data)
    }
  }

  const loadTransactions = async () => {
    const params = new URLSearchParams({
      type: "transactions",
      dateRange,
      ...(selectedClub !== "all" && { clubId: selectedClub })
    })
    
    const endpoint = isAdmin 
      ? `/api/admin/paypal-monitoring?${params}`
      : `/api/clubs/${clubId}/paypal-monitoring?${params}`
    
    const response = await fetch(endpoint)
    if (response.ok) {
      const data = await response.json()
      setTransactions(data.transactions || [])
    }
  }

  const loadWebhookLogs = async () => {
    const params = new URLSearchParams({
      type: "webhooks",
      dateRange,
      ...(selectedClub !== "all" && { clubId: selectedClub })
    })
    
    const endpoint = isAdmin 
      ? `/api/admin/paypal-monitoring?${params}`
      : `/api/clubs/${clubId}/paypal-monitoring?${params}`
    
    const response = await fetch(endpoint)
    if (response.ok) {
      const data = await response.json()
      setWebhookLogs(data.logs || [])
    }
  }

  const loadClubs = async () => {
    const response = await fetch("/api/clubs")
    if (response.ok) {
      const data = await response.json()
      setClubs(data)
    }
  }

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "failed":
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">PayPal Monitoring</h2>
          <p className="text-gray-600">
            {isAdmin ? "System-wide PayPal integration monitoring" : "Your PayPal integration status"}
          </p>
        </div>
        
        <div className="flex gap-4">
          {isAdmin && clubs.length > 0 && (
            <Select value={selectedClub} onValueChange={setSelectedClub}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select club" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clubs</SelectItem>
                {clubs.map(club => (
                  <SelectItem key={club.id} value={club.id.toString()}>
                    {club.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={refresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(healthStatus).map(([clubKey, status]) => (
          <Card key={clubKey}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {isAdmin && <span>Club #{clubKey}</span>}
                <Badge variant={status.healthy ? "default" : "destructive"}>
                  {status.healthy ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Healthy
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Issues
                    </>
                  )}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{status.message}</p>
              {status.details && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <Activity className={`h-3 w-3 ${status.details.apiConnection ? "text-green-500" : "text-red-500"}`} />
                    API Connection
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Activity className={`h-3 w-3 ${status.details.webhookActive ? "text-green-500" : "text-red-500"}`} />
                    Webhooks Active
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Activity className={`h-3 w-3 ${status.details.recentActivity ? "text-green-500" : "text-yellow-500"}`} />
                    Recent Activity
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Last checked: {format(new Date(status.lastChecked), "MMM d, h:mm a")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.revenueByPeriod.daily > 0 ? (
                  <>
                    <TrendingUp className="inline h-3 w-3 text-green-500" />
                    {formatCurrency(metrics.revenueByPeriod.daily)} today
                  </>
                ) : (
                  "No revenue today"
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.transactionCount}</div>
              <p className="text-xs text-muted-foreground">
                Avg: {formatCurrency(metrics.averageTransaction)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Payment success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.revenueByPeriod.monthly)}</div>
              <p className="text-xs text-muted-foreground">
                Current month total
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs for detailed data */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="webhooks">Webhook Events</TabsTrigger>
          {isAdmin && metrics?.topClubs && <TabsTrigger value="clubs">Top Clubs</TabsTrigger>}
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest payment activity</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No transactions found</p>
              ) : (
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        <div>
                          <p className="font-medium">{formatCurrency(transaction.amount, transaction.currency)}</p>
                          <p className="text-sm text-gray-600">
                            {transaction.memberEmail || "Unknown member"}
                            {isAdmin && transaction.clubName && ` • ${transaction.clubName}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{transaction.type}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(transaction.createdAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Events</CardTitle>
              <CardDescription>Recent webhook processing activity</CardDescription>
            </CardHeader>
            <CardContent>
              {webhookLogs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No webhook events found</p>
              ) : (
                <div className="space-y-2">
                  {webhookLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                        <div>
                          <p className="font-medium">{log.eventType}</p>
                          {isAdmin && log.clubName && (
                            <p className="text-sm text-gray-600">{log.clubName}</p>
                          )}
                          {log.error && (
                            <p className="text-sm text-red-600">Error: {log.error}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {format(new Date(log.processedAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && metrics?.topClubs && (
          <TabsContent value="clubs">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Clubs</CardTitle>
                <CardDescription>Revenue leaders for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics.topClubs.map((club, index) => (
                    <div key={club.clubId} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{club.clubName}</p>
                          <p className="text-sm text-gray-600">
                            {club.transactions} transactions
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">{formatCurrency(club.revenue)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Loading state */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <Card className="p-6">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading monitoring data...</p>
          </Card>
        </div>
      )}
    </div>
  )
}