import { type NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados de entrada
    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const { email, password } = validationResult.data

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        planType: true,
        isActive: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Verificar se a conta está ativa
    if (!user.isActive) {
      return NextResponse.json({ error: "Conta inativa. Entre em contato com o suporte." }, { status: 401 })
    }

    // Verificar senha
    const isValidPassword = await compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        planType: user.planType,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    )

    // Criar resposta
    const response = NextResponse.json({
      success: true,
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        planType: user.planType,
      },
    })

    // Definir cookie seguro
    response.cookies.set("session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400 * 7, // 7 dias
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
