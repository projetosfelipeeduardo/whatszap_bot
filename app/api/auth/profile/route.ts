import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
import { z } from "zod"

const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  avatarUrl: z.string().url("URL do avatar inválida").optional(),
  phone: z.string().optional(),
})

export async function PUT(request: NextRequest) {
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

    const body = await request.json()

    // Validar dados de entrada
    const updateData = updateProfileSchema.parse(body)

    // Atualizar perfil
    const updatedUser = await AuthService.updateUserProfile(user.id, updateData)

    return NextResponse.json({
      user: updatedUser,
      message: "Perfil atualizado com sucesso",
    })
  } catch (error: any) {
    console.error("Update profile error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

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
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
