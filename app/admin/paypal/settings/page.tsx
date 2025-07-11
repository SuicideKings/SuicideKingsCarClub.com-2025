import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { clubs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import PayPalSettings from "@/components/admin/paypal-settings"

export default async function PayPalSettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  // For now, assuming the admin user has a default club ID of 1
  // In a real implementation, you'd get this from the session or database
  const clubId = 1

  // Fetch existing PayPal settings
  const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
  const paypalSettings = club[0]?.paypalSettings as any

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">PayPal Settings</h1>
        <p className="text-gray-600">Configure your PayPal integration settings</p>
      </div>

      <PayPalSettings 
        clubId={clubId} 
        initialSettings={{
          hasCredentials: !!(paypalSettings?.clientId && paypalSettings?.clientSecret),
          clientId: paypalSettings?.clientId,
          webhookId: paypalSettings?.webhookId,
          isProduction: paypalSettings?.isProduction || false,
          paypalProductId: club[0]?.paypalProductId,
          paypalMonthlyPlanId: club[0]?.paypalMonthlyPlanId,
          paypalYearlyPlanId: club[0]?.paypalYearlyPlanId,
          monthlyPrice: paypalSettings?.monthlyPrice || "99.99",
          yearlyPrice: paypalSettings?.yearlyPrice || "999.99",
          currency: paypalSettings?.currency || "USD",
        }}
      />
    </div>
  )
}