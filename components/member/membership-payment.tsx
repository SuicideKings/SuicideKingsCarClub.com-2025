"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  DollarSign,
  Users,
  Loader2
} from "lucide-react"
import { format } from "date-fns"

interface MembershipPaymentProps {
  clubId: number
  memberEmail: string
  currentSubscription?: {
    id: string
    status: string
    tier: string
    startDate: string
    endDate: string
    nextBillingDate?: string
  }
}

interface PricingPlan {
  id: string
  name: string
  price: string
  currency: string
  interval: string
  description: string
  features: string[]
}

export default function MembershipPayment({ 
  clubId, 
  memberEmail, 
  currentSubscription 
}: MembershipPaymentProps) {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadPricingPlans()
  }, [clubId])

  const loadPricingPlans = async () => {
    try {
      // Fetch club pricing information
      const response = await fetch(`/api/clubs/${clubId}/pricing`)
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans || [])
      }
    } catch (error) {
      console.error("Failed to load pricing plans:", error)
    }
  }

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setMessage({ type: "error", text: "Please select a membership plan" })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/clubs/${clubId}/paypal/create-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan,
          memberEmail,
          returnUrl: `${window.location.origin}/member/subscription/success`,
          cancelUrl: `${window.location.origin}/member/subscription/cancel`,
        }),
      })

      const result = await response.json()

      if (response.ok && result.approvalUrl) {
        // Redirect to PayPal for approval
        window.location.href = result.approvalUrl
      } else {
        setMessage({ 
          type: "error", 
          text: result.error || "Failed to create subscription" 
        })
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: "An error occurred while processing your request" 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!currentSubscription?.id) return

    if (!confirm("Are you sure you want to cancel your membership subscription?")) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/clubs/${clubId}/paypal/cancel-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: currentSubscription.id,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ 
          type: "success", 
          text: "Subscription cancelled successfully" 
        })
        // Refresh the page after a delay
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setMessage({ 
          type: "error", 
          text: result.error || "Failed to cancel subscription" 
        })
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: "An error occurred while cancelling subscription" 
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
      case "expired":
        return "bg-red-500"
      case "suspended":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "cancelled":
      case "expired":
        return <XCircle className="h-4 w-4" />
      case "suspended":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      {currentSubscription ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Current Membership
              <Badge className={getStatusColor(currentSubscription.status)}>
                {getStatusIcon(currentSubscription.status)}
                <span className="ml-1 capitalize">{currentSubscription.status}</span>
              </Badge>
            </CardTitle>
            <CardDescription>
              Your membership subscription details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Plan</label>
                <p className="font-semibold capitalize">{currentSubscription.tier}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="font-semibold capitalize">{currentSubscription.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Start Date</label>
                <p className="font-semibold">
                  {format(new Date(currentSubscription.startDate), "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">End Date</label>
                <p className="font-semibold">
                  {format(new Date(currentSubscription.endDate), "MMM d, yyyy")}
                </p>
              </div>
              {currentSubscription.nextBillingDate && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Next Billing Date</label>
                  <p className="font-semibold">
                    {format(new Date(currentSubscription.nextBillingDate), "MMM d, yyyy")}
                  </p>
                </div>
              )}
            </div>

            {currentSubscription.status === "active" && (
              <div className="pt-4 border-t">
                <Button 
                  variant="destructive" 
                  onClick={handleCancelSubscription}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Subscription
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <Users className="h-4 w-4" />
          <AlertDescription>
            You don't have an active membership subscription. Choose a plan below to get started.
          </AlertDescription>
        </Alert>
      )}

      {/* Available Plans */}
      {(!currentSubscription || currentSubscription.status !== "active") && (
        <Card>
          <CardHeader>
            <CardTitle>Membership Plans</CardTitle>
            <CardDescription>
              Choose a membership plan that works for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <Alert className={message.type === "error" ? "border-red-500" : "border-green-500"}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {plans.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No membership plans are currently available. Please contact the club administrator.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                        selectedPlan === plan.id 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            ${plan.price}
                          </div>
                          <div className="text-sm text-gray-600">
                            per {plan.interval}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button 
                    onClick={handleSubscribe}
                    disabled={loading || !selectedPlan}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Subscribe with PayPal
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Secure payment processing through PayPal
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Cancel anytime with one click
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Automatic renewal with email notifications
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Full refund within 30 days
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}