"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  XCircle,
  Loader2,
  AlertCircle,
  TestTube,
  DollarSign,
  Package,
  Webhook,
  CheckCircle2
} from "lucide-react"

interface PayPalWizardProps {
  clubId: number
  onComplete?: () => void
}

type WizardStep = "credentials" | "test" | "pricing" | "products" | "webhooks" | "complete"

const steps: { id: WizardStep; title: string; description: string; icon: any }[] = [
  { id: "credentials", title: "API Credentials", description: "Enter your PayPal API credentials", icon: Eye },
  { id: "test", title: "Test Connection", description: "Verify your PayPal connection", icon: TestTube },
  { id: "pricing", title: "Set Pricing", description: "Configure membership pricing", icon: DollarSign },
  { id: "products", title: "Create Products", description: "Set up PayPal products and plans", icon: Package },
  { id: "webhooks", title: "Configure Webhooks", description: "Set up payment notifications", icon: Webhook },
  { id: "complete", title: "Complete", description: "Setup complete!", icon: CheckCircle2 }
]

export default function PayPalWizard({ clubId, onComplete }: PayPalWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("credentials")
  const [loading, setLoading] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    clientId: "",
    clientSecret: "",
    webhookId: "",
    isProduction: false,
    currency: "USD",
    monthlyPrice: "99.99",
    yearlyPrice: "999.99",
    productId: "",
    monthlyPlanId: "",
    yearlyPlanId: ""
  })

  // Step status
  const [stepStatus, setStepStatus] = useState<Record<WizardStep, "pending" | "completed" | "error">>({
    credentials: "pending",
    test: "pending",
    pricing: "pending",
    products: "pending",
    webhooks: "pending",
    complete: "pending"
  })

  // Load existing progress
  useEffect(() => {
    loadProgress()
  }, [clubId])

  const loadProgress = async () => {
    try {
      const response = await fetch(`/api/clubs/${clubId}/paypal-wizard?step=progress`)
      if (response.ok) {
        const data = await response.json()
        if (data.progress) {
          setFormData(prev => ({ ...prev, ...data.progress }))
          // Update step status based on saved progress
          if (data.progress.clientId && data.progress.clientSecret) {
            setStepStatus(prev => ({ ...prev, credentials: "completed" }))
          }
          if (data.progress.connectionVerified) {
            setStepStatus(prev => ({ ...prev, test: "completed" }))
          }
          if (data.progress.monthlyPrice && data.progress.yearlyPrice) {
            setStepStatus(prev => ({ ...prev, pricing: "completed" }))
          }
          if (data.progress.productId && data.progress.monthlyPlanId && data.progress.yearlyPlanId) {
            setStepStatus(prev => ({ ...prev, products: "completed" }))
          }
          if (data.progress.webhookId) {
            setStepStatus(prev => ({ ...prev, webhooks: "completed" }))
          }
        }
      }
    } catch (error) {
      console.error("Failed to load progress:", error)
    }
  }

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep)
  const getProgressPercentage = () => {
    const completedSteps = Object.values(stepStatus).filter(status => status === "completed").length
    return (completedSteps / (steps.length - 1)) * 100
  }

  const handleNext = async () => {
    const success = await saveCurrentStep()
    if (success) {
      const currentIndex = getCurrentStepIndex()
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1].id)
      }
    }
  }

  const handlePrevious = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }

  const saveCurrentStep = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/clubs/${clubId}/paypal-wizard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: currentStep,
          data: formData
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setMessage({ type: "success", text: result.message || "Step completed successfully!" })
        setStepStatus(prev => ({ ...prev, [currentStep]: "completed" }))
        
        // Update form data with any returned values
        if (result.productId) setFormData(prev => ({ ...prev, productId: result.productId }))
        if (result.monthlyPlanId) setFormData(prev => ({ ...prev, monthlyPlanId: result.monthlyPlanId }))
        if (result.yearlyPlanId) setFormData(prev => ({ ...prev, yearlyPlanId: result.yearlyPlanId }))
        if (result.webhookUrl) setFormData(prev => ({ ...prev, webhookUrl: result.webhookUrl }))
        
        return true
      } else {
        setMessage({ type: "error", text: result.error || "Failed to complete step" })
        setStepStatus(prev => ({ ...prev, [currentStep]: "error" }))
        return false
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" })
      setStepStatus(prev => ({ ...prev, [currentStep]: "error" }))
      return false
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "credentials":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="isProduction">Environment</Label>
              <Select
                value={formData.isProduction ? "live" : "sandbox"}
                onValueChange={(value) => setFormData({ ...formData, isProduction: value === "live" })}
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
              <Label htmlFor="clientId">PayPal Client ID</Label>
              <Input
                id="clientId"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                placeholder="Enter your PayPal Client ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientSecret">PayPal Client Secret</Label>
              <div className="relative">
                <Input
                  id="clientSecret"
                  type={showSecret ? "text" : "password"}
                  value={formData.clientSecret}
                  onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
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

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You can get these credentials from your PayPal Developer Dashboard at developer.paypal.com
              </AlertDescription>
            </Alert>
          </div>
        )

      case "test":
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <TestTube className="h-16 w-16 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">Test PayPal Connection</h3>
              <p className="text-gray-600 mb-6">
                Click the button below to verify your PayPal credentials are working correctly.
              </p>
              <Button 
                onClick={saveCurrentStep} 
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
            </div>
          </div>
        )

      case "pricing":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyPrice">Monthly Membership Price</Label>
                <Input
                  id="monthlyPrice"
                  type="number"
                  step="0.01"
                  value={formData.monthlyPrice}
                  onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                  placeholder="99.99"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearlyPrice">Yearly Membership Price</Label>
                <Input
                  id="yearlyPrice"
                  type="number"
                  step="0.01"
                  value={formData.yearlyPrice}
                  onChange={(e) => setFormData({ ...formData, yearlyPrice: e.target.value })}
                  placeholder="999.99"
                />
              </div>
            </div>

            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                Set competitive prices for your membership plans. You can change these later if needed.
              </AlertDescription>
            </Alert>
          </div>
        )

      case "products":
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Package className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">Create PayPal Products</h3>
              <p className="text-gray-600 mb-6">
                This will create your membership product and subscription plans in PayPal.
              </p>
              
              {formData.productId ? (
                <div className="space-y-2 text-left max-w-md mx-auto">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Product Created:</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{formData.productId}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Monthly Plan:</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{formData.monthlyPlanId}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Yearly Plan:</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{formData.yearlyPlanId}</code>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={saveCurrentStep} 
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Products...
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4 mr-2" />
                      Create Products & Plans
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )

      case "webhooks":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhookId">PayPal Webhook ID</Label>
              <Input
                id="webhookId"
                value={formData.webhookId}
                onChange={(e) => setFormData({ ...formData, webhookId: e.target.value })}
                placeholder="Enter your PayPal Webhook ID"
              />
            </div>

            <Alert>
              <Webhook className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-2">To set up webhooks:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Go to your PayPal Developer Dashboard</li>
                  <li>Navigate to your app's webhook settings</li>
                  <li>Add this webhook URL:</li>
                </ol>
                <code className="block mt-2 p-2 bg-gray-100 rounded text-xs break-all">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/api/clubs/{clubId}/paypal/webhooks
                </code>
              </AlertDescription>
            </Alert>
          </div>
        )

      case "complete":
        return (
          <div className="text-center py-8">
            <CheckCircle2 className="h-20 w-20 mx-auto mb-4 text-green-500" />
            <h3 className="text-2xl font-bold mb-2">Setup Complete!</h3>
            <p className="text-gray-600 mb-6">
              Your PayPal integration is now configured and ready to accept payments.
            </p>
            <div className="space-y-2 text-left max-w-md mx-auto mb-6">
              {Object.entries(stepStatus).filter(([step]) => step !== "complete").map(([step, status]) => (
                <div key={step} className="flex items-center gap-2">
                  {status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="capitalize">{step}</span>
                </div>
              ))}
            </div>
            {onComplete && (
              <Button onClick={onComplete} size="lg">
                Continue to Dashboard
              </Button>
            )}
          </div>
        )
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case "credentials":
        return formData.clientId && formData.clientSecret
      case "test":
        return stepStatus.credentials === "completed"
      case "pricing":
        return formData.monthlyPrice && formData.yearlyPrice
      case "products":
        return stepStatus.pricing === "completed"
      case "webhooks":
        return true // Webhook ID is optional
      default:
        return true
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>PayPal Integration Setup Wizard</CardTitle>
        <CardDescription>
          Follow these steps to configure PayPal for your club
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <Progress value={getProgressPercentage()} />
        </div>

        {/* Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isCurrent = step.id === currentStep
            const isCompleted = stepStatus[step.id] === "completed"
            const hasError = stepStatus[step.id] === "error"
            
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center cursor-pointer ${
                  index < steps.length - 1 ? "flex-1" : ""
                }`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isCurrent
                      ? "bg-blue-500 text-white"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : hasError
                      ? "bg-red-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : hasError ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs mt-1 text-center hidden sm:block">
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute w-full h-0.5 top-5 -z-10 ${
                      stepStatus[step.id] === "completed"
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                    style={{
                      left: "50%",
                      width: "calc(100% - 40px)",
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Current Step Content */}
        <div className="min-h-[300px]">
          <h3 className="text-lg font-semibold mb-4">
            {steps.find(s => s.id === currentStep)?.title}
          </h3>
          
          {message && (
            <Alert className={`mb-4 ${message.type === "error" ? "border-red-500" : "border-green-500"}`}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {renderStepContent()}
        </div>

        {/* Navigation */}
        {currentStep !== "complete" && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={getCurrentStepIndex() === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={loading || !canProceed()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}