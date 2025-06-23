import axios from "axios"

// PayPal API configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

// PayPal access token cache
let accessTokenCache: { token: string; expiresAt: number } | null = null

// Get PayPal access token
async function getAccessToken(): Promise<string> {
  const currentTime = Date.now()

  // Use cached token if still valid
  if (accessTokenCache && accessTokenCache.expiresAt > currentTime) {
    return accessTokenCache.token
  }

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials are not configured")
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")

  try {
    const response = await axios.post(`${PAYPAL_BASE_URL}/v1/oauth2/token`, "grant_type=client_credentials", {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    const { access_token, expires_in } = response.data

    // Cache the token
    accessTokenCache = {
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
) {
  try {
    const accessToken = await getAccessToken()

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
export async function getSubscription(subscriptionId: string) {
  try {
    const accessToken = await getAccessToken()

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
}) {
  try {
    const accessToken = await getAccessToken()

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
}) {
  try {
    const accessToken = await getAccessToken()

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
}) {
  try {
    const accessToken = await getAccessToken()

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
export async function testClubPayPalConnection(clubId: string) {
  try {
    const accessToken = await getAccessToken()

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
  clubId: string,
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
  })
}

// Create club subscription
export async function createClubSubscription(
  clubId: string,
  planId: string,
  subscriberData: {
    name: string
    email: string
  },
  returnUrl: string,
  cancelUrl: string,
) {
  return createSubscription(planId, subscriberData, returnUrl, cancelUrl)
}

// Verify club webhook signature
export function verifyClubWebhookSignature(
  clubId: string,
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
}
