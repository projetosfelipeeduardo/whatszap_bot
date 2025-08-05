import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { whatsappManager } from "@/lib/whatsapp/baileys-client"
import { z } from "zod"

const disconnectSchema = z.object({
  connectionId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { connectionId } = disconnectSchema.parse(body)

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

    console.log(`🔌 Desconectando WhatsApp: ${connection.name} (${connectionId})`)

    // Desconectar via Baileys
    try {
      await whatsappManager.disconnectConnection(connectionId)
    } catch (baileyError) {
      console.error("Erro ao desconectar Baileys:", baileyError)
      // Continuar mesmo se houver erro no Baileys
    }

    // Atualizar status no banco
    await prisma.whatsappConnection.update({
      where: { id: connectionId },
      data: {
        status: "disconnected",
        qrCode: null,
        phoneNumber: null,
        lastActivityAt: new Date(),
      },
    })

    console.log(`✅ WhatsApp desconectado: ${connection.name}`)

    return NextResponse.json({
      success: true,
      message: "Conexão desconectada com sucesso",
    })
  } catch (error) {
    console.error("Disconnect WhatsApp error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: "Erro ao desconectar" }, { status: 500 })
  }
}
