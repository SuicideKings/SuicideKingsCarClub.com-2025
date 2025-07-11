import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { getToken } from "next-auth/jwt"
import { getCategorySlug, isLegacyForumUrl, convertLegacyUrl } from "./lib/url-utils"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key")

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Handle SEO URL redirects for forum
  if (isLegacyForumUrl(path)) {
    const newUrl = convertLegacyUrl(path)
    if (newUrl) {
      const url = new URL(newUrl, request.url)
      // Copy search parameters to maintain functionality
      url.search = request.nextUrl.search
      return NextResponse.redirect(url, { status: 301 })
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
      request.cookies.get("memberToken")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

    if (!memberToken) {
      const url = new URL("/auth/signin", request.url)
      url.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(url)
    }

    try {
      await jwtVerify(memberToken, secret)
      return NextResponse.next()
    } catch (error) {
      console.error("Member token verification failed:", error)
      const url = new URL("/auth/signin", request.url)
      url.searchParams.set("callbackUrl", request.url)
      url.searchParams.set("error", "session_expired")
      return NextResponse.redirect(url)
    }
  }

  // Handle admin authentication (existing logic)
  if (isAdminRoute) {
    const publicPaths = ["/admin/login", "/admin/setup"]
    const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath))

    if (isPublicPath) {
      return NextResponse.next()
    }

    try {
      // Check for authentication token
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
      })

      // If no token and trying to access protected admin route, redirect to login
      if (!token) {
        const url = new URL("/admin/login", request.url)
        url.searchParams.set("callbackUrl", encodeURI(request.url))
        return NextResponse.redirect(url)
      }

      // Check if user has admin role
      if (token.role !== "admin") {
        const url = new URL("/admin/login", request.url)
        url.searchParams.set("error", "insufficient_permissions")
        return NextResponse.redirect(url)
      }

      // Continue for authenticated admin users
      return NextResponse.next()
    } catch (error) {
      console.error("Middleware error:", error)
      // On error, redirect to login
      const url = new URL("/admin/login", request.url)
      url.searchParams.set("error", "auth_error")
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/member/:path*", "/admin/:path*", "/forum/:path*"],
}
