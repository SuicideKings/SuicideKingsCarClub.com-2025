import { getClubPayPalAccessToken } from "./paypal"

export interface PayPalValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  details?: {
    apiConnection: boolean
    credentialsValid: boolean
    webhookReachable: boolean
    productsConfigured: boolean
    subscriptionsActive: boolean
  }
}

export interface PayPalTestResult {
  success: boolean
  message: string
  details?: any
}

/**
 * Comprehensive PayPal integration validation
 */
export async function validatePayPalIntegration(clubId: number): Promise<PayPalValidationResult> {
  const result: PayPalValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    details: {
      apiConnection: false,
      credentialsValid: false,
      webhookReachable: false,
      productsConfigured: false,
      subscriptionsActive: false
    }
  }

  try {
    // Test API connection and credentials
    const apiTest = await testPayPalApiConnection(clubId)
    result.details!.apiConnection = apiTest.success
    result.details!.credentialsValid = apiTest.success

    if (!apiTest.success) {
      result.errors.push("PayPal API connection failed: " + apiTest.message)
      result.isValid = false
    }

    // Test webhook configuration
    const webhookTest = await testPayPalWebhook(clubId)
    result.details!.webhookReachable = webhookTest.success

    if (!webhookTest.success) {
      result.warnings.push("PayPal webhook test failed: " + webhookTest.message)
    }

    // Test product configuration
    const productTest = await testPayPalProducts(clubId)
    result.details!.productsConfigured = productTest.success

    if (!productTest.success) {
      result.errors.push("PayPal products not configured: " + productTest.message)
      result.isValid = false
    }

    // Test subscription functionality
    const subscriptionTest = await testPayPalSubscriptions(clubId)
    result.details!.subscriptionsActive = subscriptionTest.success

    if (!subscriptionTest.success) {
      result.warnings.push("PayPal subscription test failed: " + subscriptionTest.message)
    }

  } catch (error) {
    result.errors.push("Validation failed: " + (error instanceof Error ? error.message : "Unknown error"))
    result.isValid = false
  }

  return result
}

/**
 * Test PayPal API connection using club credentials
 */
export async function testPayPalApiConnection(clubId: number): Promise<PayPalTestResult> {
  try {
    const accessToken = await getClubPayPalAccessToken(clubId)
    
    if (!accessToken) {
      return {
        success: false,
        message: "Failed to obtain PayPal access token"
      }
    }

    // Test API call to verify credentials
    const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/identity/generate-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      return {
        success: true,
        message: "PayPal API connection successful"
      }
    } else {
      return {
        success: false,
        message: `PayPal API test failed: ${response.status} ${response.statusText}`
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "PayPal API connection error: " + (error instanceof Error ? error.message : "Unknown error")
    }
  }
}

/**
 * Test PayPal webhook configuration
 */
export async function testPayPalWebhook(clubId: number): Promise<PayPalTestResult> {
  try {
    const accessToken = await getClubPayPalAccessToken(clubId)
    
    if (!accessToken) {
      return {
        success: false,
        message: "Failed to obtain PayPal access token"
      }
    }

    // List webhooks to verify configuration
    const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/notifications/webhooks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const webhooks = await response.json()
      const clubWebhookUrl = `${process.env.NEXTAUTH_URL}/api/clubs/${clubId}/paypal/webhooks`
      
      const hasWebhook = webhooks.webhooks?.some((webhook: any) => 
        webhook.url === clubWebhookUrl
      )

      return {
        success: hasWebhook,
        message: hasWebhook ? "Webhook found and configured" : "No webhook found for this club",
        details: { webhooks: webhooks.webhooks }
      }
    } else {
      return {
        success: false,
        message: `Failed to list webhooks: ${response.status} ${response.statusText}`
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Webhook test error: " + (error instanceof Error ? error.message : "Unknown error")
    }
  }
}

/**
 * Test PayPal product configuration
 */
export async function testPayPalProducts(clubId: number): Promise<PayPalTestResult> {
  try {
    const accessToken = await getClubPayPalAccessToken(clubId)
    
    if (!accessToken) {
      return {
        success: false,
        message: "Failed to obtain PayPal access token"
      }
    }

    // Get club's product ID from database
    const { db } = await import("@/lib/db")
    const { clubs } = await import("@/lib/db/schema")
    const { eq } = await import("drizzle-orm")

    const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
    
    if (!club[0]?.paypalProductId) {
      return {
        success: false,
        message: "No PayPal product configured for this club"
      }
    }

    // Test product existence
    const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/catalogs/products/${club[0].paypalProductId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const product = await response.json()
      return {
        success: true,
        message: "PayPal product found and active",
        details: product
      }
    } else {
      return {
        success: false,
        message: `PayPal product not found: ${response.status} ${response.statusText}`
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Product test error: " + (error instanceof Error ? error.message : "Unknown error")
    }
  }
}

/**
 * Test PayPal subscription plans
 */
export async function testPayPalSubscriptions(clubId: number): Promise<PayPalTestResult> {
  try {
    const accessToken = await getClubPayPalAccessToken(clubId)
    
    if (!accessToken) {
      return {
        success: false,
        message: "Failed to obtain PayPal access token"
      }
    }

    // Get club's plan IDs from database
    const { db } = await import("@/lib/db")
    const { clubs } = await import("@/lib/db/schema")
    const { eq } = await import("drizzle-orm")

    const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
    
    if (!club[0]?.paypalMonthlyPlanId && !club[0]?.paypalYearlyPlanId) {
      return {
        success: false,
        message: "No PayPal subscription plans configured"
      }
    }

    let monthlyPlanActive = false
    let yearlyPlanActive = false

    // Test monthly plan
    if (club[0]?.paypalMonthlyPlanId) {
      const monthlyResponse = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/billing/plans/${club[0].paypalMonthlyPlanId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (monthlyResponse.ok) {
        const monthlyPlan = await monthlyResponse.json()
        monthlyPlanActive = monthlyPlan.status === 'ACTIVE'
      }
    }

    // Test yearly plan
    if (club[0]?.paypalYearlyPlanId) {
      const yearlyResponse = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/billing/plans/${club[0].paypalYearlyPlanId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (yearlyResponse.ok) {
        const yearlyPlan = await yearlyResponse.json()
        yearlyPlanActive = yearlyPlan.status === 'ACTIVE'
      }
    }

    const hasActivePlans = monthlyPlanActive || yearlyPlanActive

    return {
      success: hasActivePlans,
      message: hasActivePlans ? "Subscription plans are active" : "No active subscription plans found",
      details: {
        monthlyPlanActive,
        yearlyPlanActive,
        monthlyPlanId: club[0]?.paypalMonthlyPlanId,
        yearlyPlanId: club[0]?.paypalYearlyPlanId
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Subscription test error: " + (error instanceof Error ? error.message : "Unknown error")
    }
  }
}

/**
 * Run a comprehensive PayPal health check
 */
export async function runPayPalHealthCheck(clubId: number): Promise<PayPalValidationResult> {
  const validation = await validatePayPalIntegration(clubId)
  
  // Add additional health checks
  try {
    // Check recent webhook activity
    const { db } = await import("@/lib/db")
    const { paypalWebhookLogs } = await import("@/lib/db/schema")
    const { eq, gt } = await import("drizzle-orm")

    const recentWebhooks = await db
      .select()
      .from(paypalWebhookLogs)
      .where(eq(paypalWebhookLogs.clubId, clubId))
      .limit(10)

    const recentActivity = recentWebhooks.length > 0
    
    if (!recentActivity) {
      validation.warnings.push("No recent webhook activity detected")
    }

    // Check for failed webhook processing
    const failedWebhooks = recentWebhooks.filter(w => !w.processed)
    if (failedWebhooks.length > 0) {
      validation.warnings.push(`${failedWebhooks.length} webhook(s) failed to process`)
    }

  } catch (error) {
    validation.warnings.push("Could not check webhook activity: " + (error instanceof Error ? error.message : "Unknown error"))
  }

  return validation
}