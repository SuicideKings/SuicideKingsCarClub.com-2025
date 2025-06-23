import type React from "react"

interface SubscriptionCreatedEmailProps {
  clubName: string
  planName: string
  amount: string
  currency: string
  billingCycle: string
  nextBillingDate: string
  customerName: string
  subscriptionId: string
}

const SubscriptionCreatedEmail: React.FC<SubscriptionCreatedEmailProps> = ({
  clubName,
  planName,
  amount,
  currency,
  billingCycle,
  nextBillingDate,
  customerName,
  subscriptionId,
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#f8f8f8", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "#333" }}>Subscription Activated</h1>
      </div>

      <div style={{ padding: "20px" }}>
        <p>Dear {customerName},</p>

        <p>Thank you for subscribing to {clubName}. Your subscription has been successfully activated.</p>

        <div style={{ backgroundColor: "#f8f8f8", padding: "15px", borderRadius: "5px", margin: "20px 0" }}>
          <p>
            <strong>Plan:</strong> {planName}
          </p>
          <p>
            <strong>Amount:</strong> {amount} {currency}
          </p>
          <p>
            <strong>Billing Cycle:</strong> {billingCycle}
          </p>
          <p>
            <strong>Next Billing Date:</strong> {nextBillingDate}
          </p>
          <p>
            <strong>Subscription ID:</strong> {subscriptionId}
          </p>
        </div>

        <p>You can manage your subscription at any time through your account dashboard.</p>

        <p>Thank you for your business!</p>

        <p>
          Best regards,
          <br />
          {clubName} Team
        </p>
      </div>

      <div
        style={{ backgroundColor: "#f8f8f8", padding: "10px", textAlign: "center", fontSize: "12px", color: "#666" }}
      >
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </div>
  )
}

export default SubscriptionCreatedEmail
