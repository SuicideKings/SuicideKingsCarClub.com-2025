import type React from "react"

interface PaymentSuccessEmailProps {
  clubName: string
  amount: string
  currency: string
  paymentDate: string
  paymentId: string
  customerName: string
}

const PaymentSuccessEmail: React.FC<PaymentSuccessEmailProps> = ({
  clubName,
  amount,
  currency,
  paymentDate,
  paymentId,
  customerName,
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#f8f8f8", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "#333" }}>Payment Successful</h1>
      </div>

      <div style={{ padding: "20px" }}>
        <p>Dear {customerName},</p>

        <p>Thank you for your payment to {clubName}. Your transaction has been successfully processed.</p>

        <div style={{ backgroundColor: "#f8f8f8", padding: "15px", borderRadius: "5px", margin: "20px 0" }}>
          <p>
            <strong>Amount:</strong> {amount} {currency}
          </p>
          <p>
            <strong>Date:</strong> {paymentDate}
          </p>
          <p>
            <strong>Transaction ID:</strong> {paymentId}
          </p>
        </div>

        <p>If you have any questions about this payment, please contact us.</p>

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

export default PaymentSuccessEmail
