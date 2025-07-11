"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Save, TestTube, Settings, CheckCircle, XCircle } from "lucide-react"

interface PayPalSettingsProps {
  clubId: number
  initialSettings?: {
    hasCredentials?: boolean
    clientId?: string
    webhookId?: string
    isProduction?: boolean
    paypalProductId?: string
    paypalMonthlyPlanId?: string
    paypalYearlyPlanId?: string
    monthlyPrice?: string
    yearlyPrice?: string
    currency?: string
  }
}

export default function PayPalSettings({ clubId, initialSettings }: PayPalSettingsProps) {
  const [settings, setSettings] = useState({
    clientId: initialSettings?.clientId || "",
    clientSecret: "",
    webhookId: initialSettings?.webhookId || "",
    isProduction: initialSettings?.isProduction || false,
    paypalProductId: initialSettings?.paypalProductId || "",
    paypalMonthlyPlanId: initialSettings?.paypalMonthlyPlanId || "",
    paypalYearlyPlanId: initialSettings?.paypalYearlyPlanId || "",
    monthlyPrice: initialSettings?.monthlyPrice || "99.99",
    yearlyPrice: initialSettings?.yearlyPrice || "999.99",
    currency: initialSettings?.currency || "USD",
  })

  const [showSecret, setShowSecret] = useState(false)
  const [loading, setLoading] = useState(false)
  const [setupStep, setSetupStep] = useState(0)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const isConfigured = settings.clientId && settings.clientSecret
  const isFullySetup =
    isConfigured && settings.paypalProductId && settings.paypalMonthlyPlanId && settings.paypalYearlyPlanId

  const handleSave = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/clubs/${clubId}/paypal-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: settings.clientId,
          clientSecret: settings.clientSecret,
          webhookId: settings.webhookId,
          isProduction: settings.isProduction,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setMessage({ type: "success", text: result.message || "PayPal settings saved successfully!" })
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.error || "Failed to save settings" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving settings" })
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/clubs/${clubId}/test-paypal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: settings.clientId,
          clientSecret: settings.clientSecret,
        }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "PayPal connection test successful!" })
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.error || "Connection test failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred during connection test" })
    } finally {
      setLoading(false)
    }
  }

  const handleSetupPayPalProducts = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/clubs/${clubId}/setup-paypal-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monthlyPrice: settings.monthlyPrice,
          yearlyPrice: settings.yearlyPrice,
          currency: settings.currency,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSettings({
          ...settings,
          paypalProductId: result.productId,
          paypalMonthlyPlanId: result.monthlyPlanId,
          paypalYearlyPlanId: result.yearlyPlanId,
        })
        setMessage({ type: "success", text: "PayPal products and plans created successfully!" })
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.message || "Failed to setup PayPal products" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred during PayPal setup" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          PayPal Integration Settings
          {isFullySetup ? (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              Configured
            </Badge>
          ) : (
            <Badge variant="secondary">
              <XCircle className="h-3 w-3 mr-1" />
              Setup Required
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Configure your club's individual PayPal integration for payment processing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert className={message.type === "error" ? "border-red-500" : "border-green-500"}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Basic PayPal Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              1
            </span>
            PayPal API Credentials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isProduction">Environment</Label>
              <Select
                value={settings.isProduction ? "live" : "sandbox"}
                onValueChange={(value) => setSettings({ ...settings, isProduction: value === "live" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                  <SelectItem value="live">Live (Production)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => setSettings({ ...settings, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">PayPal Client ID</Label>
              <Input
                id="clientId"
                value={settings.clientId}
                onChange={(e) => setSettings({ ...settings, clientId: e.target.value })}
                placeholder="Enter your PayPal Client ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientSecret">PayPal Client Secret</Label>
              <div className="relative">
                <Input
                  id="clientSecret"
                  type={showSecret ? "text" : "password"}
                  value={settings.clientSecret}
                  onChange={(e) => setSettings({ ...settings, clientSecret: e.target.value })}
                  placeholder="Enter your PayPal Client Secret"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookId">PayPal Webhook ID</Label>
              <Input
                id="webhookId"
                value={settings.webhookId}
                onChange={(e) => setSettings({ ...settings, webhookId: e.target.value })}
                placeholder="Enter your PayPal Webhook ID"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleTestConnection}
              disabled={loading || !settings.clientId || !settings.clientSecret}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </div>

        {/* Step 2: Pricing Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              2
            </span>
            Pricing Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyPrice">Monthly Price</Label>
              <Input
                id="monthlyPrice"
                value={settings.monthlyPrice}
                onChange={(e) => setSettings({ ...settings, monthlyPrice: e.target.value })}
                placeholder="99.99"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearlyPrice">Yearly Price</Label>
              <Input
                id="yearlyPrice"
                value={settings.yearlyPrice}
                onChange={(e) => setSettings({ ...settings, yearlyPrice: e.target.value })}
                placeholder="999.99"
              />
            </div>
          </div>
        </div>

        {/* Step 3: PayPal Products Setup */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              3
            </span>
            PayPal Products & Plans
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paypalProductId">Product ID</Label>
              <Input
                id="paypalProductId"
                value={settings.paypalProductId}
                readOnly
                placeholder="Will be generated automatically"
                className="bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paypalMonthlyPlanId">Monthly Plan ID</Label>
                <Input
                  id="paypalMonthlyPlanId"
                  value={settings.paypalMonthlyPlanId}
                  readOnly
                  placeholder="Will be generated automatically"
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paypalYearlyPlanId">Yearly Plan ID</Label>
                <Input
                  id="paypalYearlyPlanId"
                  value={settings.paypalYearlyPlanId}
                  readOnly
                  placeholder="Will be generated automatically"
                  className="bg-gray-50"
                />
              </div>
            </div>

            <Button
              onClick={handleSetupPayPalProducts}
              disabled={loading || !isConfigured || isFullySetup}
              className="w-fit"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isFullySetup ? "Products Already Setup" : "Setup PayPal Products & Plans"}
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          <p className="font-medium mb-2">Setup Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Create a PayPal Developer account at developer.paypal.com</li>
            <li>Create a new application for your club to get Client ID and Secret</li>
            <li>Set up webhooks to receive payment notifications</li>
            <li>
              Configure your webhook URL: {process.env.NEXTAUTH_URL}/api/clubs/{clubId}/paypal/webhooks
            </li>
            <li>Copy the Webhook ID from your PayPal dashboard</li>
            <li>Test the connection and setup products/plans</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
