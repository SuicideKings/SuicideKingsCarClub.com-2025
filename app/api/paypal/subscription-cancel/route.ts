import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get("clubId")

    // Redirect to cancel page
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/payment/cancelled?clubId=${clubId}`)
  } catch (error) {
    console.error("Error handling subscription cancel:", error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/payment/error?message=Processing error`)
  }
}
