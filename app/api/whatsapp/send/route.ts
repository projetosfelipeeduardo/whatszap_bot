import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { whatsappManager } from "@/lib/whatsapp/baileys-client"
import { z } from "zod"

const sendMessageSchema = z.object({
  connectionId: z.string().uuid(),
  to: z.string().min(1),
  message: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { connectionId, to, message } = sendMessageSchema.parse(body)

    // Verificar se a conexão pertence ao usuário
    const connection = await prisma.whatsappConnection.findFirst({
      where: {
        id: connectionId,
        userId: user.id,
        status: "connected",
      },
    })

    if (!connection) {
      return NextResponse.json({ error: "Conexão não encontrada ou não ativa" }, { status: 404 })
    }

    // Enviar mensagem
    await whatsappManager.sendMessage(connectionId, to, message)

    // Buscar ou criar contato e conversa para salvar a mensagem enviada
    let contact = await prisma.contact.findFirst({
      where: {
        userId: user.id,
        phoneNumber: to.replace(/\D/g, ""),
      },
    })

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          userId: user.id,
          phoneNumber: to.replace(/\D/g, ""),
          name: to,
          whatsappConnectionId: connectionId,
          status: "active",
        },
      })
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        contactId: contact.id,
        whatsappConnectionId: connectionId,
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          contactId: contact.id,
          whatsappConnectionId: connectionId,
          status: "open",
        },
      })
    }

    // Salvar mensagem enviada
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        type: "text",
        content: message,
        direction: "outbound",
        status: "sent",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Send message error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 })
  }
}
