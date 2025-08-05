import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  type MessageUpsertType,
  type WAMessage,
  type WASocket,
  type ConnectionState,
} from "@whiskeysockets/baileys"
import type { Boom } from "@hapi/boom"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"
import QRCode from "qrcode"
import { flowProcessor } from "@/lib/flows/processor"

interface WhatsAppConnection {
  id: string
  userId: string
  name: string
  status: "connecting" | "connected" | "disconnected" | "qr_required"
  socket?: WASocket
}

class BaileysWhatsAppManager {
  private connections: Map<string, WhatsAppConnection> = new Map()

  constructor() {
    this.createConnection = this.createConnection.bind(this)
    this.handleConnectionUpdate = this.handleConnectionUpdate.bind(this)
    this.handleIncomingMessage = this.handleIncomingMessage.bind(this)
    this.processIncomingMessage = this.processIncomingMessage.bind(this)
    this.startConversationFlow = this.startConversationFlow.bind(this)
    this.checkFlowTrigger = this.checkFlowTrigger.bind(this)
    this.sendDefaultWelcomeMessage = this.sendDefaultWelcomeMessage.bind(this)
    this.sendDefaultResponse = this.sendDefaultResponse.bind(this)
    this.extractMessageContent = this.extractMessageContent.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.disconnectConnection = this.disconnectConnection.bind(this)
    this.notifyConnectionUpdate = this.notifyConnectionUpdate.bind(this)
    this.getConnection = this.getConnection.bind(this)
    this.getAllConnections = this.getAllConnections.bind(this)
  }

  async createConnection(connectionId: string, userId: string, name: string): Promise<string> {
    try {
      // Configurar autenticação
      const { state, saveCreds } = await useMultiFileAuthState(`./auth_sessions/${connectionId}`)

      // Criar socket
      const socket = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: console,
        browser: ["Frontzap", "Chrome", "1.0.0"],
      })

      // Armazenar conexão
      const connection: WhatsAppConnection = {
        id: connectionId,
        userId,
        name,
        status: "connecting",
        socket,
      }

      this.connections.set(connectionId, connection)

      // Event listeners
      socket.ev.on("connection.update", async (update) => {
        await this.handleConnectionUpdate(connectionId, update)
      })

      socket.ev.on("creds.update", saveCreds)

      socket.ev.on("messages.upsert", async (messageUpdate) => {
        await this.handleIncomingMessage(connectionId, messageUpdate)
      })

      // Aguardar QR code ou conexão
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Timeout waiting for QR code"))
        }, 30000)

        const handleConnectionUpdate = async (update: Partial<ConnectionState>) => {
          if (update.qr) {
            clearTimeout(timeout)
            const qrCodeDataURL = await QRCode.toDataURL(update.qr)

            // Salvar QR code no banco
            await prisma.whatsappConnection.update({
              where: { id: connectionId },
              data: {
                qrCode: qrCodeDataURL,
                status: "qr_required",
              },
            })

            resolve(qrCodeDataURL)
          }

          if (update.connection === "open") {
            clearTimeout(timeout)
            resolve("connected")
          }
        }

        socket.ev.on("connection.update", handleConnectionUpdate)
      })
    } catch (error) {
      console.error("Error creating WhatsApp connection:", error)
      throw error
    }
  }

  private async handleConnectionUpdate(connectionId: string, update: Partial<ConnectionState>) {
    const connection = this.connections.get(connectionId)
    if (!connection) return

    const { connection: connectionState, lastDisconnect, qr } = update

    if (qr) {
      // Gerar QR code
      const qrCodeDataURL = await QRCode.toDataURL(qr)

      // Atualizar no banco
      await prisma.whatsappConnection.update({
        where: { id: connectionId },
        data: {
          qrCode: qrCodeDataURL,
          status: "qr_required",
        },
      })

      // Notificar via WebSocket se necessário
      await this.notifyConnectionUpdate(connectionId, {
        status: "qr_required",
        qrCode: qrCodeDataURL,
      })
    }

    if (connectionState === "close") {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut

      if (shouldReconnect) {
        console.log("Reconnecting WhatsApp connection:", connectionId)
        setTimeout(() => {
          this.createConnection(connectionId, connection.userId, connection.name)
        }, 3000)
      } else {
        // Usuário foi deslogado
        await prisma.whatsappConnection.update({
          where: { id: connectionId },
          data: {
            status: "disconnected",
            qrCode: null,
            sessionData: null,
          },
        })

        this.connections.delete(connectionId)
      }
    }

    if (connectionState === "open") {
      // Conexão estabelecida
      const socket = connection.socket!
      const user = socket.user

      connection.status = "connected"

      // Atualizar no banco
      await prisma.whatsappConnection.update({
        where: { id: connectionId },
        data: {
          status: "connected",
          phoneNumber: user?.id?.split(":")[0] || null,
          qrCode: null,
          lastActivityAt: new Date(),
        },
      })

      // Notificar conexão estabelecida
      await this.notifyConnectionUpdate(connectionId, {
        status: "connected",
        phoneNumber: user?.id?.split(":")[0] || null,
      })
    }
  }

  private async handleIncomingMessage(
    connectionId: string,
    messageUpdate: { messages: WAMessage[]; type: MessageUpsertType },
  ) {
    const { messages, type } = messageUpdate

    if (type !== "notify") return

    for (const message of messages) {
      if (message.key.fromMe) continue // Ignorar mensagens próprias

      try {
        await this.processIncomingMessage(connectionId, message)
      } catch (error) {
        console.error("Error processing incoming message:", error)
      }
    }
  }

  private async processIncomingMessage(connectionId: string, message: WAMessage) {
    const connection = this.connections.get(connectionId)
    if (!connection) return

    const from = message.key.remoteJid!
    const phoneNumber = from.split("@")[0]
    const messageContent = this.extractMessageContent(message)

    if (!messageContent) return

    console.log(`📱 Mensagem recebida de ${phoneNumber}: ${messageContent.content}`)

    // Buscar ou criar contato
    let contact = await prisma.contact.findFirst({
      where: {
        userId: connection.userId,
        phoneNumber: phoneNumber,
      },
    })

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          userId: connection.userId,
          phoneNumber: phoneNumber,
          name: message.pushName || phoneNumber,
          whatsappConnectionId: connectionId,
          status: "active",
        },
      })
      console.log(`👤 Novo contato criado: ${contact.name} (${contact.phoneNumber})`)
    }

    // Buscar ou criar conversa
    let conversation = await prisma.conversation.findFirst({
      where: {
        contactId: contact.id,
        whatsappConnectionId: connectionId,
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: connection.userId,
          contactId: contact.id,
          whatsappConnectionId: connectionId,
          status: "open",
        },
      })
      console.log(`💬 Nova conversa criada para ${contact.name}`)
    }

    // Salvar mensagem recebida
    const savedMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        type: messageContent.type,
        content: messageContent.content,
        direction: "inbound",
        whatsappMessageId: message.key.id,
        sentAt: new Date(message.messageTimestamp! * 1000),
      },
    })

    // Atualizar última atividade da conversa
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date(),
        unreadCount: { increment: 1 },
      },
    })

    // 🚀 INICIAR FLUXO AUTOMATICAMENTE
    console.log(`🔄 Iniciando processamento de fluxo para mensagem: "${messageContent.content}"`)

    try {
      await this.startConversationFlow(connectionId, conversation.id, contact.id, messageContent.content)
    } catch (error) {
      console.error("Erro ao processar fluxo:", error)

      // Enviar mensagem de erro padrão se o fluxo falhar
      await this.sendMessage(connectionId, from, "Desculpe, ocorreu um erro. Tente novamente em alguns instantes.")
    }
  }

  private async startConversationFlow(
    connectionId: string,
    conversationId: string,
    contactId: string,
    messageContent: string,
  ) {
    // Buscar fluxos ativos para este usuário
    const connection = this.connections.get(connectionId)
    if (!connection) return

    const activeFlows = await prisma.conversationFlow.findMany({
      where: {
        userId: connection.userId,
        isActive: true,
      },
      orderBy: {
        priority: "desc",
      },
    })

    console.log(`📋 Encontrados ${activeFlows.length} fluxos ativos`)

    if (activeFlows.length === 0) {
      // Se não há fluxos configurados, usar fluxo padrão de boas-vindas
      await this.sendDefaultWelcomeMessage(connectionId, contactId, messageContent)
      return
    }

    // Processar cada fluxo até encontrar um que corresponda
    for (const flow of activeFlows) {
      try {
        const flowData = flow.flowData as any
        const shouldTrigger = await this.checkFlowTrigger(flowData, messageContent, contactId)

        if (shouldTrigger) {
          console.log(`✅ Fluxo "${flow.name}" ativado para mensagem: "${messageContent}"`)

          // Executar o fluxo
          await flowProcessor.executeFlow(flow.id, conversationId, contactId, messageContent, connectionId)
          return // Parar após executar o primeiro fluxo correspondente
        }
      } catch (error) {
        console.error(`Erro ao processar fluxo ${flow.name}:`, error)
        continue
      }
    }

    // Se nenhum fluxo foi ativado, usar resposta padrão
    console.log(`⚠️ Nenhum fluxo correspondeu, enviando resposta padrão`)
    await this.sendDefaultResponse(connectionId, contactId, messageContent)
  }

  private async checkFlowTrigger(flowData: any, messageContent: string, contactId: string): Promise<boolean> {
    if (!flowData.nodes || !Array.isArray(flowData.nodes)) {
      return false
    }

    // Encontrar nó de gatilho (trigger)
    const triggerNode = flowData.nodes.find((node: any) => node.type === "trigger")
    if (!triggerNode) {
      return false
    }

    const config = triggerNode.data?.config || {}

    switch (config.type || "keyword") {
      case "keyword":
        if (config.keyword) {
          const keywords = config.keyword
            .toLowerCase()
            .split(",")
            .map((k: string) => k.trim())
          const message = messageContent.toLowerCase().trim()

          return keywords.some((keyword: string) => {
            if (config.matchType === "exact") {
              return message === keyword
            } else {
              return message.includes(keyword)
            }
          })
        }
        return true // Se não há palavra-chave específica, ativar para qualquer mensagem

      case "always":
        return true // Sempre ativar

      case "first_message":
        // Verificar se é a primeira mensagem do contato
        const messageCount = await prisma.message.count({
          where: {
            conversation: {
              contactId: contactId,
            },
            direction: "inbound",
          },
        })
        return messageCount === 1

      default:
        return true // Por padrão, ativar para qualquer mensagem
    }
  }

  private async sendDefaultWelcomeMessage(connectionId: string, contactId: string, messageContent: string) {
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    })

    if (!contact) return

    const welcomeMessage = `Olá ${contact.name || "amigo"}! 👋

Obrigado por entrar em contato conosco! 

Estou aqui para te ajudar. Como posso te auxiliar hoje?

Digite *menu* para ver nossas opções ou continue a conversa que eu te atenderei! 😊`

    await this.sendMessage(connectionId, `${contact.phoneNumber}@s.whatsapp.net`, welcomeMessage)
  }

  private async sendDefaultResponse(connectionId: string, contactId: string, messageContent: string) {
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    })

    if (!contact) return

    // Resposta inteligente baseada no conteúdo da mensagem
    let response = ""

    const message = messageContent.toLowerCase()

    if (message.includes("oi") || message.includes("olá") || message.includes("ola")) {
      response = `Oi ${contact.name || "amigo"}! 👋 Como posso te ajudar hoje?`
    } else if (message.includes("menu") || message.includes("opções") || message.includes("opcoes")) {
      response = `📋 *Menu de Opções:*

1️⃣ Informações sobre produtos
2️⃣ Suporte técnico  
3️⃣ Falar com atendente
4️⃣ Horário de funcionamento

Digite o número da opção desejada!`
    } else if (message.includes("preço") || message.includes("preco") || message.includes("valor")) {
      response = `💰 Para informações sobre preços e valores, por favor me informe qual produto ou serviço você tem interesse!`
    } else if (message.includes("horário") || message.includes("horario") || message.includes("funcionamento")) {
      response = `🕐 *Horário de Funcionamento:*

Segunda a Sexta: 8h às 18h
Sábado: 8h às 12h
Domingo: Fechado

Estamos sempre disponíveis via WhatsApp! 📱`
    } else {
      response = `Recebi sua mensagem: "${messageContent}"

Em breve um de nossos atendentes entrará em contato com você! 

Enquanto isso, digite *menu* para ver nossas opções rápidas. 😊`
    }

    await this.sendMessage(connectionId, `${contact.phoneNumber}@s.whatsapp.net`, response)
  }

  private extractMessageContent(message: WAMessage): { type: string; content: string } | null {
    const messageType = Object.keys(message.message || {})[0]

    switch (messageType) {
      case "conversation":
        return {
          type: "text",
          content: message.message?.conversation || "",
        }
      case "extendedTextMessage":
        return {
          type: "text",
          content: message.message?.extendedTextMessage?.text || "",
        }
      case "imageMessage":
        return {
          type: "image",
          content: message.message?.imageMessage?.caption || "[Imagem]",
        }
      case "audioMessage":
        return {
          type: "audio",
          content: "[Áudio]",
        }
      case "videoMessage":
        return {
          type: "video",
          content: message.message?.videoMessage?.caption || "[Vídeo]",
        }
      case "documentMessage":
        return {
          type: "document",
          content: `[Documento: ${message.message?.documentMessage?.fileName || "arquivo"}]`,
        }
      default:
        return {
          type: "text",
          content: "[Mensagem não suportada]",
        }
    }
  }

  async sendMessage(connectionId: string, to: string, content: string): Promise<void> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.socket) {
      throw new Error("Connection not found or not active")
    }

    const jid = to.includes("@") ? to : `${to}@s.whatsapp.net`

    console.log(`📤 Enviando mensagem para ${jid}: ${content}`)

    try {
      await connection.socket.sendMessage(jid, { text: content })

      // Salvar mensagem enviada no banco
      const phoneNumber = jid.split("@")[0]
      const contact = await prisma.contact.findFirst({
        where: {
          userId: connection.userId,
          phoneNumber: phoneNumber,
        },
      })

      if (contact) {
        const conversation = await prisma.conversation.findFirst({
          where: {
            contactId: contact.id,
            whatsappConnectionId: connectionId,
          },
        })

        if (conversation) {
          await prisma.message.create({
            data: {
              conversationId: conversation.id,
              type: "text",
              content: content,
              direction: "outbound",
              status: "sent",
            },
          })
        }
      }

      console.log(`✅ Mensagem enviada com sucesso`)
    } catch (error) {
      console.error(`❌ Erro ao enviar mensagem:`, error)
      throw error
    }
  }

  async disconnectConnection(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId)
    if (connection && connection.socket) {
      await connection.socket.logout()
      this.connections.delete(connectionId)
    }

    // Atualizar status no banco
    await prisma.whatsappConnection.update({
      where: { id: connectionId },
      data: {
        status: "disconnected",
        qrCode: null,
      },
    })
  }

  private async notifyConnectionUpdate(connectionId: string, data: any) {
    // Notificar via WebSocket ou Server-Sent Events
    await redis.publish(`whatsapp:${connectionId}`, JSON.stringify(data))
  }

  // Método para obter conexão ativa
  getConnection(connectionId: string): WhatsAppConnection | undefined {
    return this.connections.get(connectionId)
  }

  // Método para listar todas as conexões
  getAllConnections(): WhatsAppConnection[] {
    return Array.from(this.connections.values())
  }
}

export const whatsappManager = new BaileysWhatsAppManager()
