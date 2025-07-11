import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import PayPalMonitoring from "@/components/admin/paypal-monitoring"

export default async function PayPalMonitoringPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="container mx-auto py-8">
      <PayPalMonitoring isAdmin={true} />
    </div>
  )
}