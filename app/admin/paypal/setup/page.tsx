import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import PayPalWizard from "@/components/admin/paypal-wizard"

export default async function PayPalSetupPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  // For now, assuming the admin user has a default club ID of 1
  // In a real implementation, you'd get this from the session or database
  const clubId = 1

  return (
    <div className="container mx-auto py-8">
      <PayPalWizard 
        clubId={clubId} 
        onComplete={() => {
          // This will be handled client-side
          window.location.href = "/admin/paypal/monitoring"
        }}
      />
    </div>
  )
}