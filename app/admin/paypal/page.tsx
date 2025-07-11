import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { clubs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Activity, 
  Wand2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  TrendingUp,
  DollarSign,
  Users
} from "lucide-react"

export default async function PayPalOverviewPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  // For now, assuming the admin user has a default club ID of 1
  // In a real implementation, you'd get this from the session or database
  const clubId = 1

  // Fetch existing PayPal settings
  const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
  const paypalSettings = club[0]?.paypalSettings as any

  const isConfigured = !!(paypalSettings?.clientId && paypalSettings?.clientSecret)
  const isFullySetup = isConfigured && club[0]?.paypalProductId && club[0]?.paypalMonthlyPlanId && club[0]?.paypalYearlyPlanId

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">PayPal Integration</h1>
        <p className="text-gray-600">Manage your PayPal payment processing and monitoring</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integration Status</CardTitle>
            {isFullySetup ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isFullySetup ? (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Setup Required
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isFullySetup ? "PayPal is fully configured" : "Complete setup to start accepting payments"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Environment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paypalSettings?.isProduction ? (
                <Badge variant="default">Live</Badge>
              ) : (
                <Badge variant="secondary">Sandbox</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {paypalSettings?.isProduction ? "Production environment" : "Testing environment"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {club[0]?.paypalProductId ? "2" : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {club[0]?.paypalProductId ? "Monthly & Yearly plans" : "No products configured"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Setup Wizard
            </CardTitle>
            <CardDescription>
              {isFullySetup ? "Reconfigure your PayPal integration" : "Complete your PayPal setup step by step"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/paypal/setup">
              <Button className="w-full">
                {isFullySetup ? "Reconfigure" : "Start Setup"}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Monitoring
            </CardTitle>
            <CardDescription>
              View payment activity, transaction history, and system health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/paypal/monitoring">
              <Button variant="outline" className="w-full">
                View Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>
              Configure PayPal API credentials, pricing, and webhook settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/paypal/settings">
              <Button variant="outline" className="w-full">
                Configure
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Setup Status */}
      {!isFullySetup && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Setup Required
            </CardTitle>
            <CardDescription>
              Complete these steps to enable PayPal payments for your club
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {paypalSettings?.clientId && paypalSettings?.clientSecret ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={paypalSettings?.clientId && paypalSettings?.clientSecret ? "text-green-600" : "text-red-600"}>
                  Configure PayPal API credentials
                </span>
              </div>
              <div className="flex items-center gap-3">
                {club[0]?.paypalProductId ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={club[0]?.paypalProductId ? "text-green-600" : "text-red-600"}>
                  Create PayPal products and subscription plans
                </span>
              </div>
              <div className="flex items-center gap-3">
                {paypalSettings?.webhookId ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={paypalSettings?.webhookId ? "text-green-600" : "text-red-600"}>
                  Configure webhook notifications
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/admin/paypal/setup">
                <Button>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Complete Setup
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PayPal Developer Resources */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>PayPal Developer Resources</CardTitle>
          <CardDescription>
            Helpful links for managing your PayPal integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="https://developer.paypal.com/developer/applications/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>PayPal Developer Dashboard</span>
            </a>
            <a 
              href="https://developer.paypal.com/docs/api/webhooks/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Webhook Documentation</span>
            </a>
            <a 
              href="https://developer.paypal.com/docs/api/subscriptions/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Subscriptions API</span>
            </a>
            <a 
              href="https://developer.paypal.com/docs/api/payments/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Payments API</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}