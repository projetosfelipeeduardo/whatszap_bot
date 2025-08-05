import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Obter token do cookie
    const token = request.cookies.get("session-token")?.value

    if (token) {
      // Fazer logout
      await AuthService.logout(token)
    }

    // Criar resposta
    const response = NextResponse.json({
      message: "Logout realizado com sucesso",
    })

    // Remover cookie
    response.cookies.set("session-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Erro ao fazer logout" }, { status: 500 })
  }
}
