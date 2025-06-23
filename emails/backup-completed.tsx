import type React from "react"

interface BackupCompletedEmailProps {
  clubName: string
  websiteName: string
  backupDate: string
  backupSize: string
  recipientName: string
  backupId: string
}

const BackupCompletedEmail: React.FC<BackupCompletedEmailProps> = ({
  clubName,
  websiteName,
  backupDate,
  backupSize,
  recipientName,
  backupId,
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#f8f8f8", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "#1565C0" }}>Backup Completed</h1>
      </div>

      <div style={{ padding: "20px" }}>
        <p>Dear {recipientName},</p>

        <p>
          A backup of your website <strong>{websiteName}</strong> has been successfully completed.
        </p>

        <div style={{ backgroundColor: "#f8f8f8", padding: "15px", borderRadius: "5px", margin: "20px 0" }}>
          <p>
            <strong>Club:</strong> {clubName}
          </p>
          <p>
            <strong>Backup Date:</strong> {backupDate}
          </p>
          <p>
            <strong>Backup Size:</strong> {backupSize}
          </p>
          <p>
            <strong>Backup ID:</strong> {backupId}
          </p>
        </div>

        <p>This backup is stored securely and can be used to restore your website if needed.</p>

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

export default BackupCompletedEmail
