import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { 
  setupClubPayPalProducts, 
  validateClubPayPalSetup, 
  getClubPayPalStatus 
} from "@/lib/paypal-setup"
import { 
  updateClubPayPalSettings, 
  testClubPayPalConnection 
} from "@/lib/paypal"
import { validatePayPalCredentials } from "@/lib/env-validation"
import { db } from "@/lib/db"
import { clubs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

interface PayPalWizardStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  required: boolean
  error?: string
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clubId = Number.parseInt(params.id)
    
    // Get club details
    const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
    if (club.length === 0) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    const clubData = club[0]
    const paypalSettings = clubData.paypalSettings as any

    // Build wizard steps with current status
    const steps: PayPalWizardStep[] = [
      {
        id: 'credentials',
        title: 'PayPal Credentials',
        description: 'Configure your PayPal API credentials',
        status: (paypalSettings?.clientId && paypalSettings?.clientSecret) ? 'completed' : 'pending',
        required: true
      },
      {
        id: 'test_connection',
        title: 'Test Connection',
        description: 'Verify PayPal API connection',
        status: 'pending',
        required: true
      },
      {
        id: 'pricing',
        title: 'Pricing Configuration',
        description: 'Set up membership pricing',
        status: 'pending',
        required: true
      },
      {
        id: 'products',
        title: 'PayPal Products & Plans',
        description: 'Create PayPal products and subscription plans',
        status: (clubData.paypalProductId && clubData.paypalMonthlyPlanId && clubData.paypalYearlyPlanId) ? 'completed' : 'pending',
        required: true
      },
      {
        id: 'webhooks',
        title: 'Webhook Configuration',
        description: 'Configure webhook for payment notifications',
        status: paypalSettings?.webhookId ? 'completed' : 'pending',
        required: false
      }
    ]

    // Test connection if credentials are available
    if (paypalSettings?.clientId && paypalSettings?.clientSecret) {
      try {
        const connectionTest = await testClubPayPalConnection(clubId)
        steps[1].status = connectionTest.success ? 'completed' : 'error'
        if (!connectionTest.success) {
          steps[1].error = connectionTest.error
        }
      } catch (error) {
        steps[1].status = 'error'
        steps[1].error = 'Connection test failed'
      }
    }

    // Check overall completion
    const validation = await validateClubPayPalSetup(clubId)
    const currentStep = steps.findIndex(step => step.status === 'pending' || step.status === 'error')

    return NextResponse.json({
      clubId,
      clubName: clubData.name,
      steps,
      currentStep: currentStep === -1 ? steps.length : currentStep,
      isComplete: validation.isValid,
      validation,
      webhookUrl: `${process.env.NEXTAUTH_URL}/api/clubs/${clubId}/paypal/webhooks`
    })

  } catch (error) {
    console.error("Error getting PayPal wizard status:", error)
    return NextResponse.json({ error: "Failed to get wizard status" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clubId = Number.parseInt(params.id)
    const { step, data } = await request.json()

    // Get club details
    const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
    if (club.length === 0) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    const clubData = club[0]

    switch (step) {
      case 'credentials':
        return await handleCredentialsStep(clubId, data)
      
      case 'test_connection':
        return await handleTestConnectionStep(clubId)
      
      case 'pricing':
        return await handlePricingStep(clubId, clubData, data)
      
      case 'products':
        return await handleProductsStep(clubId, clubData, data)
      
      case 'webhooks':
        return await handleWebhooksStep(clubId, data)
      
      default:
        return NextResponse.json({ error: "Invalid step" }, { status: 400 })
    }

  } catch (error) {
    console.error("Error processing PayPal wizard step:", error)
    return NextResponse.json({ error: "Failed to process wizard step" }, { status: 500 })
  }
}

async function handleCredentialsStep(clubId: number, data: any) {
  const { clientId, clientSecret, webhookId, isProduction } = data

  // Validate credentials format
  const validation = validatePayPalCredentials(clientId, clientSecret)
  if (!validation.valid) {
    return NextResponse.json({ 
      error: "Invalid credentials", 
      details: validation.errors 
    }, { status: 400 })
  }

  // Save credentials
  await updateClubPayPalSettings(clubId, {
    clientId,
    clientSecret,
    webhookId,
    isProduction: isProduction || false
  })

  return NextResponse.json({ 
    success: true, 
    message: "PayPal credentials saved successfully",
    nextStep: 'test_connection'
  })
}

async function handleTestConnectionStep(clubId: number) {
  const connectionTest = await testClubPayPalConnection(clubId)
  
  if (!connectionTest.success) {
    return NextResponse.json({ 
      error: "Connection test failed", 
      details: connectionTest.error 
    }, { status: 400 })
  }

  return NextResponse.json({ 
    success: true, 
    message: "PayPal connection test successful",
    connectionData: connectionTest.data,
    nextStep: 'pricing'
  })
}

async function handlePricingStep(clubId: number, clubData: any, data: any) {
  const { monthlyPrice, yearlyPrice, currency } = data

  if (!monthlyPrice || !yearlyPrice || !currency) {
    return NextResponse.json({ 
      error: "Monthly price, yearly price, and currency are required" 
    }, { status: 400 })
  }

  // Validate pricing
  if (isNaN(parseFloat(monthlyPrice)) || parseFloat(monthlyPrice) <= 0) {
    return NextResponse.json({ 
      error: "Monthly price must be a positive number" 
    }, { status: 400 })
  }

  if (isNaN(parseFloat(yearlyPrice)) || parseFloat(yearlyPrice) <= 0) {
    return NextResponse.json({ 
      error: "Yearly price must be a positive number" 
    }, { status: 400 })
  }

  // Store pricing for the products step
  return NextResponse.json({ 
    success: true, 
    message: "Pricing configuration saved",
    pricing: { monthlyPrice, yearlyPrice, currency },
    nextStep: 'products'
  })
}

async function handleProductsStep(clubId: number, clubData: any, data: any) {
  const { monthlyPrice, yearlyPrice, currency, description } = data

  // Setup PayPal products and plans
  const result = await setupClubPayPalProducts({
    clubId,
    clubName: clubData.name,
    monthlyPrice,
    yearlyPrice,
    currency,
    description
  })

  if (!result.success) {
    return NextResponse.json({ 
      error: "Failed to create PayPal products", 
      details: result.error 
    }, { status: 500 })
  }

  return NextResponse.json({ 
    success: true, 
    message: "PayPal products and plans created successfully",
    products: {
      productId: result.productId,
      monthlyPlanId: result.monthlyPlanId,
      yearlyPlanId: result.yearlyPlanId
    },
    nextStep: 'webhooks'
  })
}

async function handleWebhooksStep(clubId: number, data: any) {
  const { webhookId } = data

  if (!webhookId) {
    return NextResponse.json({ 
      error: "Webhook ID is required" 
    }, { status: 400 })
  }

  // Update webhook ID in PayPal settings
  const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
  if (club.length === 0) {
    return NextResponse.json({ error: "Club not found" }, { status: 404 })
  }

  const currentSettings = club[0].paypalSettings as any || {}
  
  await updateClubPayPalSettings(clubId, {
    ...currentSettings,
    webhookId
  })

  return NextResponse.json({ 
    success: true, 
    message: "Webhook configuration saved successfully",
    complete: true
  })
}