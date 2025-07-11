import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { 
  getSystemPayPalHealth, 
  getClubPayPalMetrics, 
  getPayPalAuditLog 
} from "@/lib/paypal-monitoring"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const clubId = searchParams.get('clubId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    switch (action) {
      case 'health':
        const healthData = await getSystemPayPalHealth()
        return NextResponse.json(healthData)

      case 'metrics':
        if (!clubId) {
          return NextResponse.json({ error: "Club ID required for metrics" }, { status: 400 })
        }
        
        const metrics = await getClubPayPalMetrics(
          parseInt(clubId),
          startDate ? new Date(startDate) : undefined,
          endDate ? new Date(endDate) : undefined
        )
        return NextResponse.json(metrics)

      case 'audit':
        if (!clubId) {
          return NextResponse.json({ error: "Club ID required for audit log" }, { status: 400 })
        }
        
        const auditLog = await getPayPalAuditLog(parseInt(clubId))
        return NextResponse.json(auditLog)

      case 'summary':
        // Get overall system summary
        const health = await getSystemPayPalHealth()
        const summary = {
          totalClubs: health.length,
          healthyClubs: health.filter(c => c.connectionStatus === 'healthy').length,
          warningClubs: health.filter(c => c.connectionStatus === 'warning').length,
          errorClubs: health.filter(c => c.connectionStatus === 'error').length,
          totalRevenue: health.reduce((sum, c) => sum + c.revenue, 0),
          totalTransactions: health.reduce((sum, c) => sum + c.transactionCount, 0),
          clubsWithCredentials: health.filter(c => c.hasCredentials).length,
          clubsWithProducts: health.filter(c => c.hasProducts).length
        }
        return NextResponse.json(summary)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

  } catch (error) {
    console.error("Error in PayPal monitoring API:", error)
    return NextResponse.json(
      { error: "Failed to fetch monitoring data" }, 
      { status: 500 }
    )
  }
}