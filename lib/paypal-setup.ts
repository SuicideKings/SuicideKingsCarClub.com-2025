import { db } from "./db"
import { clubs } from "./db/schema"
import { eq } from "drizzle-orm"
import { 
  createClubProduct, 
  createClubSubscriptionPlan, 
  testClubPayPalConnection 
} from "./paypal"

export interface PayPalSetupConfig {
  clubId: number
  clubName: string
  monthlyPrice: string
  yearlyPrice: string
  currency: string
  description?: string
}

export interface PayPalSetupResult {
  success: boolean
  productId?: string
  monthlyPlanId?: string
  yearlyPlanId?: string
  error?: string
}

export async function setupClubPayPalProducts(config: PayPalSetupConfig): Promise<PayPalSetupResult> {
  const { clubId, clubName, monthlyPrice, yearlyPrice, currency, description } = config
  
  try {
    // First, test the connection to make sure credentials are valid
    const connectionTest = await testClubPayPalConnection(clubId)
    if (!connectionTest.success) {
      return {
        success: false,
        error: `PayPal connection test failed: ${connectionTest.error}`
      }
    }

    // Step 1: Create the product
    const product = await createClubProduct({
      name: clubName,
      description: description || `${clubName} membership and benefits`,
      category: "SOFTWARE",
      clubId
    })

    if (!product.id) {
      return {
        success: false,
        error: "Failed to create PayPal product"
      }
    }

    console.log(`✓ Created PayPal product for ${clubName}: ${product.id}`)

    // Step 2: Create monthly subscription plan
    const monthlyPlan = await createClubSubscriptionPlan({
      productId: product.id,
      name: `${clubName} Monthly Membership`,
      description: `Monthly membership for ${clubName}`,
      amount: monthlyPrice,
      currency,
      interval: "MONTH",
      clubId
    })

    if (!monthlyPlan.id) {
      return {
        success: false,
        error: "Failed to create monthly subscription plan"
      }
    }

    console.log(`✓ Created monthly plan for ${clubName}: ${monthlyPlan.id}`)

    // Step 3: Create yearly subscription plan
    const yearlyPlan = await createClubSubscriptionPlan({
      productId: product.id,
      name: `${clubName} Yearly Membership`,
      description: `Yearly membership for ${clubName}`,
      amount: yearlyPrice,
      currency,
      interval: "YEAR",
      clubId
    })

    if (!yearlyPlan.id) {
      return {
        success: false,
        error: "Failed to create yearly subscription plan"
      }
    }

    console.log(`✓ Created yearly plan for ${clubName}: ${yearlyPlan.id}`)

    // Step 4: Update club record with PayPal IDs
    await db.update(clubs)
      .set({
        paypalProductId: product.id,
        paypalMonthlyPlanId: monthlyPlan.id,
        paypalYearlyPlanId: yearlyPlan.id,
        updatedAt: new Date()
      })
      .where(eq(clubs.id, clubId))

    console.log(`✓ Updated club ${clubId} with PayPal product and plan IDs`)

    return {
      success: true,
      productId: product.id,
      monthlyPlanId: monthlyPlan.id,
      yearlyPlanId: yearlyPlan.id
    }

  } catch (error) {
    console.error(`❌ Error setting up PayPal products for club ${clubId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

export async function validateClubPayPalSetup(clubId: number): Promise<{
  isValid: boolean
  hasCredentials: boolean
  hasProducts: boolean
  hasPlans: boolean
  error?: string
}> {
  try {
    const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
    
    if (club.length === 0) {
      return {
        isValid: false,
        hasCredentials: false,
        hasProducts: false,
        hasPlans: false,
        error: "Club not found"
      }
    }

    const clubData = club[0]
    const hasCredentials = !!(clubData.paypalSettings && 
      (clubData.paypalSettings as any).clientId && 
      (clubData.paypalSettings as any).clientSecret)
    
    const hasProducts = !!clubData.paypalProductId
    const hasPlans = !!(clubData.paypalMonthlyPlanId && clubData.paypalYearlyPlanId)

    return {
      isValid: hasCredentials && hasProducts && hasPlans,
      hasCredentials,
      hasProducts,
      hasPlans
    }

  } catch (error) {
    return {
      isValid: false,
      hasCredentials: false,
      hasProducts: false,
      hasPlans: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

export async function getClubPayPalStatus(clubId: number) {
  try {
    const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
    
    if (club.length === 0) {
      throw new Error("Club not found")
    }

    const clubData = club[0]
    const paypalSettings = clubData.paypalSettings as any
    
    return {
      clubId: clubData.id,
      clubName: clubData.name,
      hasCredentials: !!(paypalSettings?.clientId && paypalSettings?.clientSecret),
      isProduction: paypalSettings?.isProduction || false,
      productId: clubData.paypalProductId,
      monthlyPlanId: clubData.paypalMonthlyPlanId,
      yearlyPlanId: clubData.paypalYearlyPlanId,
      webhookId: paypalSettings?.webhookId,
      setupComplete: !!(
        paypalSettings?.clientId && 
        paypalSettings?.clientSecret && 
        clubData.paypalProductId && 
        clubData.paypalMonthlyPlanId && 
        clubData.paypalYearlyPlanId
      )
    }

  } catch (error) {
    throw new Error(`Failed to get PayPal status: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Bulk setup for multiple clubs
export async function bulkSetupPayPalProducts(configs: PayPalSetupConfig[]): Promise<{
  results: (PayPalSetupResult & { clubId: number })[]
  summary: {
    total: number
    successful: number
    failed: number
  }
}> {
  const results: (PayPalSetupResult & { clubId: number })[] = []
  
  for (const config of configs) {
    console.log(`Setting up PayPal products for club ${config.clubId}...`)
    const result = await setupClubPayPalProducts(config)
    results.push({ ...result, clubId: config.clubId })
  }

  const summary = {
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  }

  return { results, summary }
}