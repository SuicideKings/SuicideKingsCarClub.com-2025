import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { getToken } from "next-auth/jwt"

// Environment validation
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long")
}

if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) {
  throw new Error("NEXTAUTH_SECRET must be at least 32 characters long")
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const userAgent = request.headers.get("user-agent") || ""
  const ip = request.headers.get("x-forwarded-for") || request.ip || "unknown"

  // Security headers for all responses
  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Block suspicious user agents
  const suspiciousUserAgents = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /php/i,
  ]

  if (suspiciousUserAgents.some(pattern => pattern.test(userAgent))) {
    console.warn("Suspicious user agent detected:", {
      userAgent,
      ip,
      path,
      timestamp: new Date().toISOString(),
    })
    
    // Don't block legitimate search engines, but log the access
    if (!/googlebot|bingbot|slurp|duckduckbot/i.test(userAgent)) {
      return new NextResponse("Forbidden", { status: 403 })
    }
  }

  // Define protected member routes
  const memberRoutes = ["/member"]
  const isProtectedMemberRoute = memberRoutes.some((route) => path.startsWith(route))

  // Define admin routes
  const adminRoutes = ["/admin"]
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))

  // Handle member authentication
  if (isProtectedMemberRoute) {
    const memberToken =
      request.cookies.get("memberToken")?.value || 
      request.headers.get("authorization")?.replace("Bearer ", "")

    if (!memberToken) {
      console.warn("Unauthenticated member route access attempt:", {
        path,
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
      })
      
      const url = new URL("/auth/signin", request.url)
      url.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(url)
    }

    try {
      const payload = await jwtVerify(memberToken, secret)
      
      // Additional token validation
      if (!payload.payload.exp || payload.payload.exp < Date.now() / 1000) {
        console.warn("Expired member token:", {
          path,
          ip,
          timestamp: new Date().toISOString(),
        })
        
        const url = new URL("/auth/signin", request.url)
        url.searchParams.set("callbackUrl", request.url)
        url.searchParams.set("error", "session_expired")
        return NextResponse.redirect(url)
      }

      // Log successful member access
      console.log("Member route access:", {
        memberId: payload.payload.sub,
        path,
        timestamp: new Date().toISOString(),
      })

      return response
    } catch (error) {
      console.error("Member token verification failed:", {
        error: error instanceof Error ? error.message : "Unknown error",
        path,
        ip,
        timestamp: new Date().toISOString(),
      })
      
      const url = new URL("/auth/signin", request.url)
      url.searchParams.set("callbackUrl", request.url)
      url.searchParams.set("error", "session_expired")
      return NextResponse.redirect(url)
    }
  }

  // Handle admin authentication
  if (isAdminRoute) {
    const publicPaths = ["/admin/login", "/admin/setup"]
    const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath))

    if (isPublicPath) {
      return response
    }

    try {
      // Check for authentication token
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      // If no token and trying to access protected admin route, redirect to login
      if (!token) {
        console.warn("Unauthenticated admin route access attempt:", {
          path,
          ip,
          userAgent,
          timestamp: new Date().toISOString(),
        })
        
        const url = new URL("/admin/login", request.url)
        url.searchParams.set("callbackUrl", encodeURI(request.url))
        return NextResponse.redirect(url)
      }

      // Check if user has admin role
      if (token.role !== "admin") {
        console.warn("Insufficient permissions for admin route:", {
          userId: token.id,
          email: token.email,
          role: token.role,
          path,
          ip,
          timestamp: new Date().toISOString(),
        })
        
        const url = new URL("/admin/login", request.url)
        url.searchParams.set("error", "insufficient_permissions")
        return NextResponse.redirect(url)
      }

      // Check token expiration
      if (token.loginTime && Date.now() - (token.loginTime as number) > 8 * 60 * 60 * 1000) {
        console.warn("Admin token expired:", {
          userId: token.id,
          path,
          timestamp: new Date().toISOString(),
        })
        
        const url = new URL("/admin/login", request.url)
        url.searchParams.set("error", "session_expired")
        return NextResponse.redirect(url)
      }

      // Log successful admin access
      console.log("Admin route access:", {
        userId: token.id,
        email: token.email,
        path,
        timestamp: new Date().toISOString(),
      })

      return response
    } catch (error) {
      console.error("Admin middleware error:", {
        error: error instanceof Error ? error.message : "Unknown error",
        path,
        ip,
        timestamp: new Date().toISOString(),
      })
      
      // On error, redirect to login
      const url = new URL("/admin/login", request.url)
      url.searchParams.set("error", "auth_error")
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    "/member/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/member/:path*",
  ],
}
