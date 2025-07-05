import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { validateRequest, adminLoginSchema } from "@/lib/validation"

// Environment validation
if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) {
  throw new Error("NEXTAUTH_SECRET must be at least 32 characters long")
}

if (!process.env.ADMIN_PASSWORD_HASH) {
  throw new Error("ADMIN_PASSWORD_HASH environment variable is required")
}

// Admin user configuration - in production, this should come from database
const getAdminUser = () => {
  return {
    id: "1",
    email: "admin@suicidekingscarclub.com",
    password: process.env.ADMIN_PASSWORD_HASH!,
    name: "Admin",
    role: "admin",
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Validate input format
          const validation = validateRequest(adminLoginSchema, credentials)
          if (!validation.success) {
            console.warn("Invalid login attempt format:", {
              email: credentials.email,
              timestamp: new Date().toISOString(),
            })
            return null
          }

          const { email, password } = validation.data
          const adminUser = getAdminUser()

          // Check if user exists (case-insensitive email comparison)
          if (adminUser.email.toLowerCase() !== email.toLowerCase()) {
            console.warn("Login attempt with non-existent email:", {
              email,
              timestamp: new Date().toISOString(),
            })
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, adminUser.password)
          if (!isPasswordValid) {
            console.warn("Failed login attempt:", {
              email,
              timestamp: new Date().toISOString(),
            })
            return null
          }

          // Log successful login
          console.log("Successful admin login:", {
            email,
            timestamp: new Date().toISOString(),
          })

          return {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours for admin sessions (more secure)
    updateAge: 60 * 60, // Update session every hour
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.loginTime = Date.now()
      }
      
      // Check if token is expired (additional security layer)
      if (token.loginTime && Date.now() - (token.loginTime as number) > 8 * 60 * 60 * 1000) {
        console.warn("Token expired, forcing logout:", {
          tokenId: token.id,
          timestamp: new Date().toISOString(),
        })
        return null
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.loginTime = token.loginTime as number
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Additional security checks can be added here
      if (user.role !== "admin") {
        console.warn("Non-admin user attempted to sign in:", {
          email: user.email,
          timestamp: new Date().toISOString(),
        })
        return false
      }
      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  events: {
    async signIn({ user, account, profile }) {
      console.log("Sign in event:", {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
        timestamp: new Date().toISOString(),
      })
    },
    async signOut({ session, token }) {
      console.log("Sign out event:", {
        userId: token?.id || session?.user?.id,
        timestamp: new Date().toISOString(),
      })
    },
  },
}
