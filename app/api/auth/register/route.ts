import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
import { z } from "zod"

const registerSchema = z
  .object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados de entrada
    const { email, password, fullName } = registerSchema.parse(body)

    // Rate limiting por IP
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    const canProceed = await AuthService.checkRateLimit(
      `register:${clientIP}`,
      3, // 3 tentativas
      3600, // em 1 hora
    )

    if (!canProceed) {
      return NextResponse.json({ error: "Muitas tentativas de registro. Tente novamente em 1 hora." }, { status: 429 })
    }

    // Registrar usuário
    const { user, token } = await AuthService.register(email, password, fullName)

    // Criar resposta com dados do usuário
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        planType: user.planType,
        avatarUrl: user.avatarUrl,
      },
      message: "Conta criada com sucesso",
    })

    // Definir cookie seguro com o token de sessão
    response.cookies.set("session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400 * 7, // 7 dias
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Register error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: error.message.includes("já existe") ? 409 : 500 },
    )
  }
}
