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

interface MembershipWelcomeEmailProps {
  memberName: string
  clubName: string
  subscriptionId: string
  planName: string
  amount: string
  currency: string
  nextBillingDate: string
  loginUrl: string
  supportEmail: string
}

export default function MembershipWelcomeEmail({
  memberName = "New Member",
  clubName = "Suicide Kings Car Club",
  subscriptionId = "I-XXXXXXXXXXXXXXXXX",
  planName = "Monthly Membership",
  amount = "99.99",
  currency = "USD",
  nextBillingDate = "February 1, 2025",
  loginUrl = "https://example.com/member/login",
  supportEmail = "support@example.com",
}: MembershipWelcomeEmailProps) {
  const previewText = `Welcome to ${clubName}! Your membership is now active.`

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
            <Heading style={h1}>Welcome to {clubName}!</Heading>
            
            <Text style={text}>Hi {memberName},</Text>
            
            <Text style={text}>
              🎉 Congratulations! Your membership subscription has been successfully activated. 
              You now have full access to all club benefits and events.
            </Text>

            <Section style={subscriptionBox}>
              <Heading style={h2}>Subscription Details</Heading>
              <Text style={subscriptionText}>
                <strong>Plan:</strong> {planName}<br />
                <strong>Amount:</strong> ${amount} {currency}<br />
                <strong>Subscription ID:</strong> {subscriptionId}<br />
                <strong>Next Billing:</strong> {nextBillingDate}
              </Text>
            </Section>

            <Text style={text}>
              <strong>What's included in your membership:</strong>
            </Text>
            
            <Section style={benefitsList}>
              <Text style={benefitItem}>✅ Access to all club events and meetups</Text>
              <Text style={benefitItem}>✅ Member directory and networking</Text>
              <Text style={benefitItem}>✅ Exclusive member discounts</Text>
              <Text style={benefitItem}>✅ Monthly newsletter and updates</Text>
              <Text style={benefitItem}>✅ Online member portal access</Text>
              <Text style={benefitItem}>✅ Community forum participation</Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={loginUrl}>
                Access Member Portal
              </Button>
            </Section>

            <Hr style={hr} />

            <Section style={nextSteps}>
              <Heading style={h3}>Next Steps</Heading>
              <Text style={text}>
                1. <Link href={loginUrl} style={link}>Log into your member portal</Link> to complete your profile<br />
                2. Add your car information to showcase your ride<br />
                3. Browse upcoming events and register<br />
                4. Connect with fellow members in our community
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Questions? Reply to this email or contact us at{" "}
              <Link href={`mailto:${supportEmail}`} style={link}>
                {supportEmail}
              </Link>
            </Text>

            <Text style={footer}>
              You can manage your subscription anytime from your member portal.
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
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "40px 0 20px",
  textAlign: "center" as const,
}

const h2 = {
  color: "#1a1a1a",
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

const subscriptionBox = {
  backgroundColor: "#f8f9fa",
  border: "1px solid #e9ecef",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
}

const subscriptionText = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "8px 0",
}

const benefitsList = {
  margin: "16px 0",
}

const benefitItem = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "8px 0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
}

const nextSteps = {
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