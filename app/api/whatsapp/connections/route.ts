import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    // Buscar conexões do usuário
    const connections = await prisma.whatsappConnection.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        status: true,
        qrCode: true,
        lastActivityAt: true,
        createdAt: true,
        _count: {
          select: {
            conversations: true,
          },
        },
      },
    })

    // Buscar estatísticas de mensagens para cada conexão
    const connectionsWithStats = await Promise.all(
      connections.map(async (connection) => {
        const messageStats = await prisma.message.groupBy({
          by: ["direction"],
          where: {
            conversation: {
              whatsappConnectionId: connection.id,
            },
          },
          _count: {
            id: true,
          },
        })

        const messagesSent = messageStats.find((stat) => stat.direction === "outbound")?._count.id || 0
        const messagesReceived = messageStats.find((stat) => stat.direction === "inbound")?._count.id || 0

        return {
          ...connection,
          messagesSent,
          messagesReceived,
          conversationsCount: connection._count.conversations,
        }
      }),
    )

    return NextResponse.json({
      connections: connectionsWithStats,
    })
  } catch (error) {
    console.error("Get connections error:", error)
    return NextResponse.json({ error: "Erro ao carregar conexões" }, { status: 500 })
  }
}
