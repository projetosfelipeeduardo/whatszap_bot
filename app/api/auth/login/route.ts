import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
import { CacheService } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Rate limiting
    const clientIP = request.ip || "unknown"
    const canProceed = await CacheService.checkRateLimit(
      `login:${clientIP}`,
      5, // 5 tentativas
      300, // em 5 minutos
    )

    if (!canProceed) {
      return NextResponse.json({ error: "Muitas tentativas de login. Tente novamente em 5 minutos." }, { status: 429 })
    }

    const { user, token } = await AuthService.login(email, password)

    const response = NextResponse.json({ user })

    // Definir cookie seguro
    response.cookies.set("session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400 * 7, // 7 dias
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
