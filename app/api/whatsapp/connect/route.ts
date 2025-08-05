import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { whatsappManager } from "@/lib/whatsapp/baileys-client"
import { z } from "zod"

const connectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { name } = connectSchema.parse(body)

    // Verificar limite de conexões por usuário
    const existingConnections = await prisma.whatsappConnection.count({
      where: {
        userId: user.id,
        status: { in: ["connected", "connecting", "qr_required"] },
      },
    })

    // Limite de 3 conexões por usuário (pode ser configurável)
    if (existingConnections >= 3) {
      return NextResponse.json(
        { error: "Limite de conexões atingido. Desconecte uma conexão existente primeiro." },
        { status: 400 },
      )
    }

    // Criar conexão no banco de dados
    const connection = await prisma.whatsappConnection.create({
      data: {
        userId: user.id,
        name,
        status: "connecting",
      },
    })

    console.log(`🔄 Iniciando conexão WhatsApp: ${name} (${connection.id})`)

    // Iniciar processo de conexão com Baileys
    try {
      const result = await whatsappManager.createConnection(connection.id, user.id, name)

      if (result === "connected") {
        // Conexão estabelecida imediatamente (raro, mas possível)
        await prisma.whatsappConnection.update({
          where: { id: connection.id },
          data: { status: "connected" },
        })

        return NextResponse.json({
          connectionId: connection.id,
          status: "connected",
          message: "Conexão estabelecida com sucesso",
        })
      } else {
        // QR Code gerado
        return NextResponse.json({
          connectionId: connection.id,
          status: "qr_required",
          qrCode: result,
          message: "QR Code gerado. Escaneie com seu WhatsApp.",
        })
      }
    } catch (connectionError) {
      console.error("Erro ao criar conexão Baileys:", connectionError)

      // Atualizar status no banco
      await prisma.whatsappConnection.update({
        where: { id: connection.id },
        data: { status: "disconnected" },
      })

      return NextResponse.json({ error: "Falha ao estabelecer conexão WhatsApp" }, { status: 500 })
    }
  } catch (error) {
    console.error("Connect WhatsApp error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
