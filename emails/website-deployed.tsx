import type React from "react"

interface WebsiteDeployedEmailProps {
  clubName: string
  websiteName: string
  deploymentUrl: string
  deploymentDate: string
  recipientName: string
}

const WebsiteDeployedEmail: React.FC<WebsiteDeployedEmailProps> = ({
  clubName,
  websiteName,
  deploymentUrl,
  deploymentDate,
  recipientName,
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#f8f8f8", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "#2e7d32" }}>Website Deployed Successfully</h1>
      </div>

      <div style={{ padding: "20px" }}>
        <p>Dear {recipientName},</p>

        <p>
          Great news! Your website <strong>{websiteName}</strong> has been successfully deployed.
        </p>

        <div style={{ backgroundColor: "#f8f8f8", padding: "15px", borderRadius: "5px", margin: "20px 0" }}>
          <p>
            <strong>Club:</strong> {clubName}
          </p>
          <p>
            <strong>Deployment Date:</strong> {deploymentDate}
          </p>
          <p>
            <strong>Website URL:</strong> <a href={deploymentUrl}>{deploymentUrl}</a>
          </p>
        </div>

        <p>
          <a
            href={deploymentUrl}
            style={{
              backgroundColor: "#1976D2",
              color: "white",
              padding: "10px 15px",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            View Your Website
          </a>
        </p>

        <p>If you notice any issues with your website, please contact our support team for assistance.</p>

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

export default WebsiteDeployedEmail
