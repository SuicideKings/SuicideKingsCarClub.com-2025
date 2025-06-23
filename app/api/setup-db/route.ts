import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    // Check if we need to create a default admin user
    const data = await request.json().catch(() => ({}))

    if (data.createDefaultAdmin) {
      const adminEmail = data.adminEmail || "admin@suicidekingscc.com"
      const adminPassword = data.adminPassword || "admin123"
      const adminName = data.adminName || "Admin User"

      // Check if admin already exists
      const { data: existingAdmin, error: checkError } = await supabaseAdmin
        .from("admin_users")
        .select("id")
        .eq("email", adminEmail)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking for existing admin:", checkError)
        return NextResponse.json({ error: "Failed to check for existing admin" }, { status: 500 })
      }

      if (!existingAdmin) {
        // Hash password
        const passwordHash = await bcrypt.hash(adminPassword, 10)

        // Create default admin user
        const { error: insertError } = await supabaseAdmin.from("admin_users").insert({
          name: adminName,
          email: adminEmail,
          password_hash: passwordHash,
          role: "super_admin",
        })

        if (insertError) {
          console.error("Error creating admin user:", insertError)
          return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ success: true, message: "Database setup completed successfully" })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json({ success: false, error: "Failed to set up database" }, { status: 500 })
  }
}
