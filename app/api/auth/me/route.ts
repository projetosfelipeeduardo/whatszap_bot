import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("session-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Token não encontrado" }, { status: 401 })
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      email: string
      planType: string
    }

    // Buscar usuário no banco para garantir que ainda existe e está ativo
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        planType: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Usuário não encontrado ou inativo" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        planType: user.planType,
      },
    })
  } catch (error: any) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }
}
