import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { whatsappManager } from "@/lib/whatsapp/baileys-client"
import { z } from "zod"

const regenerateSchema = z.object({
  connectionId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { connectionId } = regenerateSchema.parse(body)

    // Verificar se a conexão pertence ao usuário
    const connection = await prisma.whatsappConnection.findFirst({
      where: {
        id: connectionId,
        userId: user.id,
      },
    })

    if (!connection) {
      return NextResponse.json({ error: "Conexão não encontrada" }, { status: 404 })
    }

    console.log(`🔄 Regenerando QR Code: ${connection.name} (${connectionId})`)

    // Desconectar conexão existente se houver
    try {
      await whatsappManager.disconnectConnection(connectionId)
    } catch (error) {
      console.log("Conexão não estava ativa, continuando...")
    }

    // Criar nova conexão
    try {
      const result = await whatsappManager.createConnection(connectionId, user.id, connection.name)

      if (result === "connected") {
        // Conexão estabelecida imediatamente
        await prisma.whatsappConnection.update({
          where: { id: connectionId },
          data: { status: "connected", qrCode: null },
        })

        return NextResponse.json({
          status: "connected",
          message: "Conexão estabelecida com sucesso",
        })
      } else {
        // QR Code gerado
        await prisma.whatsappConnection.update({
          where: { id: connectionId },
          data: { status: "qr_required", qrCode: result },
        })

        return NextResponse.json({
          status: "qr_required",
          qrCode: result,
          message: "Novo QR Code gerado",
        })
      }
    } catch (connectionError) {
      console.error("Erro ao regenerar conexão:", connectionError)

      await prisma.whatsappConnection.update({
        where: { id: connectionId },
        data: { status: "disconnected" },
      })

      return NextResponse.json({ error: "Falha ao regenerar conexão" }, { status: 500 })
    }
  } catch (error) {
    console.error("Regenerate QR error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
