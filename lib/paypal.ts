import axios from "axios"
import { db } from "./db"
import { clubs } from "./db/schema"
import { eq } from "drizzle-orm"
import { paypalLogger, logPayPalError, logPayPalSuccess, logPayPalWarning } from "./paypal-logger"

// PayPal API configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

// PayPal access token cache
let accessTokenCache: { [key: string]: { token: string; expiresAt: number } } = {}

// Get PayPal access token for a specific club or global
async function getAccessToken(clubId?: number): Promise<string> {
  const currentTime = Date.now()
  const cacheKey = clubId ? `club_${clubId}` : "global"

  // Use cached token if still valid
  if (accessTokenCache[cacheKey] && accessTokenCache[cacheKey].expiresAt > currentTime) {
    return accessTokenCache[cacheKey].token
  }

  let clientId = PAYPAL_CLIENT_ID
  let clientSecret = PAYPAL_CLIENT_SECRET

  // If clubId is provided, try to get club-specific PayPal credentials
  if (clubId) {
    try {
      const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
      if (club.length > 0 && club[0].paypalSettings) {
        const paypalSettings = club[0].paypalSettings as any
        if (paypalSettings.clientId && paypalSettings.clientSecret) {
          clientId = paypalSettings.clientId
          clientSecret = paypalSettings.clientSecret
        }
      }
    } catch (error) {
      // Fall back to global credentials if club-specific ones fail
      console.warn(`Failed to get club-specific PayPal credentials for club ${clubId}, using global credentials`)
    }
  }

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured")
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  try {
    const response = await axios.post(`${PAYPAL_BASE_URL}/v1/oauth2/token`, "grant_type=client_credentials", {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    const { access_token, expires_in } = response.data

    // Cache the token
    accessTokenCache[cacheKey] = {
      token: access_token,
      expiresAt: currentTime + expires_in * 1000 - 60000, // Subtract 1 minute for safety
    }

    return access_token
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error getting PayPal access token:", error)
    }
    throw new Error("Failed to get PayPal access token")
  }
}

// Create PayPal subscription
export async function createSubscription(
  planId: string,
  subscriberData: {
    name: string
    email: string
  },
  returnUrl: string,
  cancelUrl: string,
  clubId?: number,
) {
  try {
    const accessToken = await getAccessToken(clubId)

    const subscriptionPayload = {
      plan_id: planId,
      start_time: new Date(Date.now() + 60000).toISOString(), // Start 1 minute from now
      subscriber: {
        name: {
          given_name: subscriberData.name.split(" ")[0],
          surname: subscriberData.name.split(" ").slice(1).join(" ") || "User",
        },
        email_address: subscriberData.email,
      },
      application_context: {
        brand_name: "Suicide Kings Car Club",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        payment_method: {
          payer_selected: "PAYPAL",
          payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
        },
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    }

    const response = await axios.post(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, subscriptionPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Prefer: "return=representation",
      },
    })

    return response.data
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error creating PayPal subscription:", error)
    }
    throw new Error("Failed to create PayPal subscription")
  }
}

// Get subscription details
export async function getSubscription(subscriptionId: string, clubId?: number) {
  try {
    const accessToken = await getAccessToken(clubId)

    const response = await axios.get(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    return response.data
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error getting PayPal subscription:", error)
    }
    throw new Error("Failed to get PayPal subscription")
  }
}

// Create one-time payment
export async function createPayment(paymentData: {
  amount: string
  currency: string
  description: string
  returnUrl: string
  cancelUrl: string
  clubId?: number
}) {
  try {
    const accessToken = await getAccessToken(paymentData.clubId)

    const paymentPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: paymentData.currency,
            value: paymentData.amount,
          },
          description: paymentData.description,
        },
      ],
      application_context: {
        return_url: paymentData.returnUrl,
        cancel_url: paymentData.cancelUrl,
        brand_name: "Suicide Kings Car Club",
        locale: "en-US",
        landing_page: "BILLING",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    }

    const response = await axios.post(`${PAYPAL_BASE_URL}/v2/checkout/orders`, paymentPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Prefer: "return=representation",
      },
    })

    return response.data
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error creating PayPal payment:", error)
    }
    throw new Error("Failed to create PayPal payment")
  }
}

// Create club-specific product
export async function createClubProduct(clubData: {
  name: string
  description: string
  category: string
  clubId?: number
}) {
  try {
    const accessToken = await getAccessToken(clubData.clubId)

    const productPayload = {
      name: `${clubData.name} Membership`,
      description: clubData.description,
      type: "SERVICE",
      category: clubData.category || "SOFTWARE",
      image_url: "https://example.com/club-logo.png",
      home_url: "https://suicidekingscarclub.com",
    }

    const response = await axios.post(`${PAYPAL_BASE_URL}/v1/catalogs/products`, productPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    return response.data
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error creating PayPal product:", error)
    }
    throw new Error("Failed to create PayPal product")
  }
}

// Create club subscription plan
export async function createClubSubscriptionPlan(planData: {
  productId: string
  name: string
  description: string
  amount: string
  currency: string
  interval: string
  clubId?: number
}) {
  try {
    const accessToken = await getAccessToken(planData.clubId)

    const planPayload = {
      product_id: planData.productId,
      name: planData.name,
      description: planData.description,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: {
            interval_unit: planData.interval.toUpperCase(),
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // Infinite
          pricing_scheme: {
            fixed_price: {
              value: planData.amount,
              currency_code: planData.currency,
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    }

    const response = await axios.post(`${PAYPAL_BASE_URL}/v1/billing/plans`, planPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    return response.data
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error creating PayPal subscription plan:", error)
    }
    throw new Error("Failed to create PayPal subscription plan")
  }
}

// Test club PayPal connection
export async function testClubPayPalConnection(clubId: number) {
  try {
    const accessToken = await getAccessToken(clubId)

    // Test by getting account info
    const response = await axios.get(`${PAYPAL_BASE_URL}/v1/identity/oauth2/userinfo?schema=paypalv1.1`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    })

    return {
      success: true,
      message: "PayPal connection successful",
      data: response.data,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error testing PayPal connection:", error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Create club payment
export async function createClubPayment(
  clubId: number,
  paymentData: {
    amount: string
    currency: string
    description: string
    returnUrl: string
    cancelUrl: string
  },
) {
  return createPayment({
    ...paymentData,
    description: `${paymentData.description} - Club ID: ${clubId}`,
    clubId,
  })
}

// Create club subscription
export async function createClubSubscription(
  clubId: number,
  planId: string,
  subscriberData: {
    name: string
    email: string
  },
  returnUrl: string,
  cancelUrl: string,
) {
  return createSubscription(planId, subscriberData, returnUrl, cancelUrl, clubId)
}

// Verify club webhook signature
export function verifyClubWebhookSignature(
  clubId: number,
  headers: Record<string, string>,
  body: string,
  webhookId: string,
): boolean {
  return verifyWebhookSignature(headers, body, webhookId)
}

// Verify webhook signature
export function verifyWebhookSignature(headers: Record<string, string>, body: string, webhookId: string): boolean {
  try {
    // PayPal webhook verification logic
    // This is a simplified version - in production, you should use PayPal's SDK
    const authAlgo = headers["paypal-auth-algo"]
    const transmission = headers["paypal-transmission-id"]
    const certId = headers["paypal-cert-id"]
    const signature = headers["paypal-transmission-sig"]
    const timestamp = headers["paypal-transmission-time"]

    // In a real implementation, you would verify the signature using PayPal's public key
    // For now, we'll just check if the required headers are present
    return !!(authAlgo && transmission && certId && signature && timestamp)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error verifying PayPal webhook signature:", error)
    }
    return false
  }
}

// Update club PayPal settings
export async function updateClubPayPalSettings(clubId: number, settings: {
  clientId: string
  clientSecret: string
  webhookId?: string
  isProduction?: boolean
}) {
  try {
    await db.update(clubs)
      .set({
        paypalSettings: settings,
        updatedAt: new Date()
      })
      .where(eq(clubs.id, clubId))
    
    // Clear the cached token for this club
    const cacheKey = `club_${clubId}`
    if (accessTokenCache[cacheKey]) {
      delete accessTokenCache[cacheKey]
    }
    
    return { success: true }
  } catch (error) {
    console.error("Error updating club PayPal settings:", error)
    throw new Error("Failed to update club PayPal settings")
  }
}

// Get club PayPal settings
export async function getClubPayPalSettings(clubId: number) {
  try {
    const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
    if (club.length === 0) {
      throw new Error("Club not found")
    }
    
    const settings = club[0].paypalSettings as any
    if (!settings) {
      return null
    }
    
    // Return settings without exposing sensitive data
    return {
      hasCredentials: !!(settings.clientId && settings.clientSecret),
      webhookId: settings.webhookId,
      isProduction: settings.isProduction || false,
      clientId: settings.clientId ? settings.clientId.substring(0, 8) + "..." : null
    }
  } catch (error) {
    console.error("Error getting club PayPal settings:", error)
    throw new Error("Failed to get club PayPal settings")
  }
}

// Get PayPal access token for a specific club (exported for external use)
export async function getClubPayPalAccessToken(clubId: number): Promise<string> {
  return await getAccessToken(clubId)
}

export default {
  createSubscription,
  getSubscription,
  createPayment,
  verifyWebhookSignature,
  createClubProduct,
  createClubSubscriptionPlan,
  testClubPayPalConnection,
  createClubPayment,
  createClubSubscription,
  verifyClubWebhookSignature,
  updateClubPayPalSettings,
  getClubPayPalSettings,
}
