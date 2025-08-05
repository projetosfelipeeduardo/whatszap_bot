import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Obter token do cookie
    const token = request.cookies.get("session-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Token não encontrado" }, { status: 401 })
    }

    // Validar sessão
    const user = await AuthService.validateSession(token)

    if (!user) {
      return NextResponse.json({ error: "Sessão inválida" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Get current user error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
