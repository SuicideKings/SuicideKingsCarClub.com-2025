import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, ArrowRight, Home } from "lucide-react"

function SuccessContent() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Subscription Successful!</CardTitle>
          <CardDescription>
            Your membership subscription has been activated successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Thank you for joining our club! Your PayPal subscription is now active and you have full access to all member benefits.
            </p>
            <p className="text-sm text-gray-500">
              You will receive a confirmation email with your subscription details shortly.
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-green-50">
            <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Access your member dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Browse upcoming events
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Connect with other members
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Update your profile and car information
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/member/dashboard" className="flex-1">
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/events" className="flex-1">
              <Button variant="outline" className="w-full">
                View Events
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              Need help? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link> or 
              check your email for detailed subscription information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}