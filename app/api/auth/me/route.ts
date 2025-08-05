import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("session-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Token não encontrado" }, { status: 401 })
    }

    // Verificar JWT
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      userId: string
      email: string
      planType: string
    }

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        planType: true,
        planStatus: true,
        isActive: true,
        createdAt: true,
      },
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Usuário não encontrado ou inativo" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        planType: user.planType,
        planStatus: user.planStatus,
        createdAt: user.createdAt,
      },
    })
  } catch (error: any) {
    console.error("Erro ao buscar usuário:", error)

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
