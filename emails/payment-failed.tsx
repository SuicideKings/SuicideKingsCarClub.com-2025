import type React from "react"

interface PaymentFailedEmailProps {
  clubName: string
  amount: string
  currency: string
  attemptDate: string
  customerName: string
  retryUrl?: string
}

const PaymentFailedEmail: React.FC<PaymentFailedEmailProps> = ({
  clubName,
  amount,
  currency,
  attemptDate,
  customerName,
  retryUrl,
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#f8f8f8", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "#d32f2f" }}>Payment Failed</h1>
      </div>

      <div style={{ padding: "20px" }}>
        <p>Dear {customerName},</p>

        <p>We were unable to process your payment to {clubName}.</p>

        <div style={{ backgroundColor: "#f8f8f8", padding: "15px", borderRadius: "5px", margin: "20px 0" }}>
          <p>
            <strong>Amount:</strong> {amount} {currency}
          </p>
          <p>
            <strong>Attempt Date:</strong> {attemptDate}
          </p>
        </div>

        <p>This could be due to insufficient funds, an expired card, or incorrect payment details.</p>

        {retryUrl && (
          <p>
            <a
              href={retryUrl}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 15px",
                textDecoration: "none",
                borderRadius: "4px",
                display: "inline-block",
              }}
            >
              Retry Payment
            </a>
          </p>
        )}

        <p>
          If you continue to experience issues, please contact your bank or reach out to our support team for
          assistance.
        </p>

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

export default PaymentFailedEmail
