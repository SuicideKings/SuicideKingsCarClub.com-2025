import { NextResponse } from "next/server"
import { validatePayPalIntegration, runPayPalHealthCheck } from "@/lib/paypal-validation"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const clubId = Number.parseInt(params.id)
    
    if (isNaN(clubId)) {
      return NextResponse.json({ error: "Invalid club ID" }, { status: 400 })
    }

    const url = new URL(request.url)
    const type = url.searchParams.get("type") || "validation"

    let result

    if (type === "health") {
      result = await runPayPalHealthCheck(clubId)
    } else {
      result = await validatePayPalIntegration(clubId)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("PayPal validation error:", error)
    return NextResponse.json(
      { error: "Failed to validate PayPal integration" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const clubId = Number.parseInt(params.id)
    
    if (isNaN(clubId)) {
      return NextResponse.json({ error: "Invalid club ID" }, { status: 400 })
    }

    const body = await request.json()
    const { testType } = body

    // Run specific test based on type
    let result
    
    switch (testType) {
      case "api":
        const { testPayPalApiConnection } = await import("@/lib/paypal-validation")
        result = await testPayPalApiConnection(clubId)
        break
      case "webhook":
        const { testPayPalWebhook } = await import("@/lib/paypal-validation")
        result = await testPayPalWebhook(clubId)
        break
      case "products":
        const { testPayPalProducts } = await import("@/lib/paypal-validation")
        result = await testPayPalProducts(clubId)
        break
      case "subscriptions":
        const { testPayPalSubscriptions } = await import("@/lib/paypal-validation")
        result = await testPayPalSubscriptions(clubId)
        break
      default:
        return NextResponse.json({ error: "Invalid test type" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("PayPal test error:", error)
    return NextResponse.json(
      { error: "Failed to run PayPal test" },
      { status: 500 }
    )
  }
}