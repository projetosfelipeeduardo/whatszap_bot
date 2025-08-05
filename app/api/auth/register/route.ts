import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

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
    console.log("Dados recebidos:", body)

    // Validar dados de entrada
    const validationResult = registerSchema.safeParse(body)

    if (!validationResult.success) {
      console.log("Erro de validação:", validationResult.error.errors)
      return NextResponse.json({ error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const { email, password, fullName } = validationResult.data

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Este email já está em uso" }, { status: 409 })
    }

    // Hash da senha
    const passwordHash = await hash(password, 12)
    console.log("Hash da senha gerado:", passwordHash ? "✓" : "✗")

    // Criar usuário no banco
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: passwordHash,
        name: fullName.trim(),
        planType: "free",
        planStatus: "active",
        isActive: true,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        planType: true,
        createdAt: true,
      },
    })

    console.log("Usuário criado:", user)

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
      message: "Conta criada com sucesso",
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
    console.error("Erro no registro:", error)

    // Erro específico do Prisma
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Este email já está em uso" }, { status: 409 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
