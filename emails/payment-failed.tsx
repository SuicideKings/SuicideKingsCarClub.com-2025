import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface PaymentFailedEmailProps {
  memberName: string
  clubName: string
  subscriptionId: string
  planName: string
  amount: string
  currency: string
  failureReason: string
  retryDate: string
  updatePaymentUrl: string
  supportEmail: string
}

export default function PaymentFailedEmail({
  memberName = "Member",
  clubName = "Suicide Kings Car Club",
  subscriptionId = "I-XXXXXXXXXXXXXXXXX",
  planName = "Monthly Membership",
  amount = "99.99",
  currency = "USD",
  failureReason = "Insufficient funds",
  retryDate = "January 15, 2025",
  updatePaymentUrl = "https://example.com/member/billing",
  supportEmail = "support@example.com",
}: PaymentFailedEmailProps) {
  const previewText = `Payment failed for your ${clubName} membership`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://via.placeholder.com/150x75/000000/FFFFFF?text=LOGO"
              width="150"
              height="75"
              alt={clubName}
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Heading style={h1}>Payment Failed</Heading>
            
            <Text style={text}>Hi {memberName},</Text>
            
            <Text style={text}>
              We were unable to process your membership payment. Don't worry - your membership 
              is still active, but action is required to avoid any interruption to your benefits.
            </Text>

            <Section style={alertBox}>
              <Heading style={h2}>⚠️ Action Required</Heading>
              <Text style={alertText}>
                <strong>Payment Amount:</strong> ${amount} {currency}<br />
                <strong>Plan:</strong> {planName}<br />
                <strong>Reason:</strong> {failureReason}<br />
                <strong>Next Retry:</strong> {retryDate}
              </Text>
            </Section>

            <Text style={text}>
              <strong>What happens next?</strong>
            </Text>
            
            <Section style={timelineList}>
              <Text style={timelineItem}>
                📅 <strong>Today:</strong> Your membership remains active
              </Text>
              <Text style={timelineItem}>
                🔄 <strong>{retryDate}:</strong> We'll automatically retry the payment
              </Text>
              <Text style={timelineItem}>
                ⏰ <strong>If retry fails:</strong> Your membership may be suspended
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={updatePaymentUrl}>
                Update Payment Method
              </Button>
            </Section>

            <Hr style={hr} />

            <Section style={troubleshooting}>
              <Heading style={h3}>Common Solutions</Heading>
              <Text style={text}>
                • <strong>Insufficient funds:</strong> Add funds to your account or use a different payment method<br />
                • <strong>Expired card:</strong> Update your card information with current details<br />
                • <strong>Billing address:</strong> Ensure your billing address matches your payment method<br />
                • <strong>Bank restrictions:</strong> Contact your bank to authorize recurring payments
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              <strong>Need help?</strong> Contact us at{" "}
              <Link href={`mailto:${supportEmail}`} style={link}>
                {supportEmail}
              </Link>{" "}
              and we'll assist you right away.
            </Text>

            <Text style={footer}>
              Subscription ID: {subscriptionId}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif",
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const header = {
  padding: "20px 40px",
  textAlign: "center" as const,
}

const logo = {
  margin: "0 auto",
}

const content = {
  padding: "0 40px",
}

const h1 = {
  color: "#d32f2f",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "40px 0 20px",
  textAlign: "center" as const,
}

const h2 = {
  color: "#d32f2f",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "20px 0 10px",
}

const h3 = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "20px 0 10px",
}

const text = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
}

const alertBox = {
  backgroundColor: "#fff3cd",
  border: "1px solid #ffeaa7",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
}

const alertText = {
  color: "#856404",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "8px 0",
}

const timelineList = {
  margin: "16px 0",
}

const timelineItem = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "12px 0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#d32f2f",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
}

const troubleshooting = {
  margin: "32px 0",
}

const link = {
  color: "#007ee6",
  textDecoration: "underline",
}

const hr = {
  borderColor: "#e9ecef",
  margin: "32px 0",
}

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "16px 0",
  textAlign: "center" as const,
}