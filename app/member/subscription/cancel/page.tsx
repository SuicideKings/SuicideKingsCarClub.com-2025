import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"

export default function SubscriptionCancelPage() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Subscription Cancelled</CardTitle>
          <CardDescription>
            Your subscription process was cancelled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              No worries! Your subscription was not processed and no payment was made.
            </p>
            <p className="text-sm text-gray-500">
              You can try again anytime or contact us if you need assistance.
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold text-blue-800 mb-2">Why Join Our Club?</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Access to exclusive member events</li>
              <li>• Connect with fellow car enthusiasts</li>
              <li>• Member discounts and special offers</li>
              <li>• Monthly newsletter and updates</li>
              <li>• Online member directory</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/membership" className="flex-1">
              <Button className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              Have questions? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link> and 
              we'll be happy to help you get started.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}