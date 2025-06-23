import { Body, Container, Head, Heading, Html, Link, Preview, Text } from "@react-email/components"

interface BillingReminderEmailProps {
  clubName: string
  daysUntilBilling: number
  billingDate: string
  amount: string
}

export default function BillingReminderEmail({
  clubName,
  daysUntilBilling,
  billingDate,
  amount,
}: BillingReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your subscription will renew in {daysUntilBilling} days</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Billing Reminder</Heading>
          <Text style={text}>Hello {clubName},</Text>
          <Text style={text}>
            This is a friendly reminder that your subscription will renew in <strong>{daysUntilBilling} days</strong> on{" "}
            <strong>{billingDate}</strong>. You will be charged <strong>{amount}</strong>.
          </Text>
          <Text style={text}>
            If you would like to make any changes to your subscription, please visit your account settings.
          </Text>
          <Link href="https://yourwebsite.com/account/billing" style={button}>
            Manage Subscription
          </Link>
          <Text style={text}>
            Thank you for using our service. If you have any questions, please don't hesitate to contact us.
          </Text>
          <Text style={footer}>© {new Date().getFullYear()} AI Website Builder. All rights reserved.</Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
  borderRadius: "4px",
  border: "1px solid #e0e0e0",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
}

const button = {
  backgroundColor: "#5469d4",
  borderRadius: "4px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  lineHeight: "50px",
  textAlign: "center" as const,
  textDecoration: "none",
  width: "100%",
  margin: "20px 0",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "50px 0 0 0",
  textAlign: "center" as const,
}
