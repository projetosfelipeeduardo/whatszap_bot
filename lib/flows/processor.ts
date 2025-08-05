import { prisma } from "@/lib/prisma"
import { whatsappManager } from "@/lib/whatsapp/baileys-client"

interface FlowNode {
  id: string
  type: "trigger" | "condition" | "action" | "ai" | "delay" | "tag"
  data: {
    label: string
    config: any
  }
}

interface FlowEdge {
  id: string
  source: string
  target: string
  label?: string
}

interface FlowData {
  nodes: FlowNode[]
  edges: FlowEdge[]
}

class FlowProcessor {
  async executeFlow(
    flowId: string,
    conversationId: string,
    contactId: string,
    messageContent: string,
    connectionId: string,
  ): Promise<void> {
    console.log(`🔄 Executando fluxo ${flowId} para conversa ${conversationId}`)

    try {
      // Buscar dados do fluxo
      const flow = await prisma.conversationFlow.findUnique({
        where: { id: flowId },
      })

      if (!flow || !flow.isActive) {
        throw new Error("Fluxo não encontrado ou inativo")
      }

      const flowData = flow.flowData as FlowData
      if (!flowData.nodes || !flowData.edges) {
        throw new Error("Dados do fluxo inválidos")
      }

      // Encontrar nó inicial (trigger)
      const startNode = flowData.nodes.find((node) => node.type === "trigger")
      if (!startNode) {
        throw new Error("Nó de gatilho não encontrado")
      }

      // Criar contexto de execução
      const context = {
        flowId,
        conversationId,
        contactId,
        connectionId,
        messageContent,
        variables: new Map<string, any>(),
      }

      // Executar fluxo a partir do nó inicial
      await this.executeNode(startNode, flowData, context)
    } catch (error) {
      console.error(`❌ Erro ao executar fluxo ${flowId}:`, error)
      throw error
    }
  }

  private async executeNode(node: FlowNode, flowData: FlowData, context: any): Promise<void> {
    console.log(`🎯 Executando nó ${node.type}: ${node.data.label}`)

    try {
      switch (node.type) {
        case "trigger":
          // Nó de gatilho já foi processado, continuar para próximo
          break

        case "action":
          await this.executeActionNode(node, context)
          break

        case "condition":
          const conditionResult = await this.executeConditionNode(node, context)
          // Encontrar próximo nó baseado na condição
          const nextNodeId = this.findNextNodeByCondition(node.id, flowData, conditionResult)
          if (nextNodeId) {
            const nextNode = flowData.nodes.find((n) => n.id === nextNodeId)
            if (nextNode) {
              await this.executeNode(nextNode, flowData, context)
              return
            }
          }
          break

        case "ai":
          await this.executeAINode(node, context)
          break

        case "delay":
          await this.executeDelayNode(node, context)
          break

        case "tag":
          await this.executeTagNode(node, context)
          break

        default:
          console.warn(`⚠️ Tipo de nó não suportado: ${node.type}`)
      }

      // Encontrar e executar próximo nó
      const nextNode = this.findNextNode(node.id, flowData)
      if (nextNode) {
        await this.executeNode(nextNode, flowData, context)
      } else {
        console.log(`✅ Fluxo concluído`)
      }
    } catch (error) {
      console.error(`❌ Erro ao executar nó ${node.type}:`, error)
      throw error
    }
  }

  private async executeActionNode(node: FlowNode, context: any): Promise<void> {
    const config = node.data.config

    switch (config.type || "message") {
      case "message":
        if (config.message) {
          // Processar variáveis na mensagem
          const processedMessage = this.processMessageVariables(config.message, context)

          // Buscar contato para obter número
          const contact = await prisma.contact.findUnique({
            where: { id: context.contactId },
          })

          if (contact) {
            await whatsappManager.sendMessage(
              context.connectionId,
              `${contact.phoneNumber}@s.whatsapp.net`,
              processedMessage,
            )
          }
        }
        break

      case "webhook":
        if (config.webhookUrl) {
          await this.callWebhook(config.webhookUrl, context)
        }
        break

      default:
        console.warn(`⚠️ Tipo de ação não suportado: ${config.type}`)
    }
  }

  private async executeConditionNode(node: FlowNode, context: any): Promise<boolean> {
    const config = node.data.config
    const { field, operator, value } = config

    let fieldValue = ""

    switch (field) {
      case "message":
        fieldValue = context.messageContent.toLowerCase()
        break
      case "tag":
        // Verificar se contato tem tag específica
        const contactTags = await prisma.contactTag.findMany({
          where: { contactId: context.contactId },
          include: { tag: true },
        })
        fieldValue = contactTags
          .map((ct) => ct.tag.name)
          .join(",")
          .toLowerCase()
        break
      default:
        fieldValue = context.variables.get(field) || ""
    }

    const compareValue = value.toLowerCase()

    switch (operator) {
      case "contains":
        return fieldValue.includes(compareValue)
      case "equals":
        return fieldValue === compareValue
      case "not_equals":
        return fieldValue !== compareValue
      case "starts_with":
        return fieldValue.startsWith(compareValue)
      case "ends_with":
        return fieldValue.endsWith(compareValue)
      default:
        return false
    }
  }

  private async executeAINode(node: FlowNode, context: any): Promise<void> {
    const config = node.data.config

    // Implementar integração com IA
    console.log(`🤖 Processando com IA - Agente: ${config.agent}`)

    // Por enquanto, enviar resposta padrão
    const contact = await prisma.contact.findUnique({
      where: { id: context.contactId },
    })

    if (contact) {
      const aiResponse = `🤖 Olá ${contact.name}! Sou um assistente inteligente e estou processando sua mensagem: "${context.messageContent}". Em breve te darei uma resposta personalizada!`

      await whatsappManager.sendMessage(context.connectionId, `${contact.phoneNumber}@s.whatsapp.net`, aiResponse)
    }
  }

  private async executeDelayNode(node: FlowNode, context: any): Promise<void> {
    const config = node.data.config
    const { time, unit } = config

    let delayMs = 0

    switch (unit) {
      case "seconds":
        delayMs = Number.parseInt(time) * 1000
        break
      case "minutes":
        delayMs = Number.parseInt(time) * 60 * 1000
        break
      case "hours":
        delayMs = Number.parseInt(time) * 60 * 60 * 1000
        break
      case "days":
        delayMs = Number.parseInt(time) * 24 * 60 * 60 * 1000
        break
      default:
        delayMs = Number.parseInt(time) * 1000
    }

    console.log(`⏱️ Aguardando ${time} ${unit}...`)
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  private async executeTagNode(node: FlowNode, context: any): Promise<void> {
    const config = node.data.config
    const { action, tags, target } = config

    if (!tags || !Array.isArray(tags)) return

    for (const tagName of tags) {
      // Buscar ou criar tag
      let tag = await prisma.tag.findFirst({
        where: {
          name: tagName,
          userId: context.userId || null,
        },
      })

      if (!tag) {
        tag = await prisma.tag.create({
          data: {
            name: tagName,
            color: this.generateRandomColor(),
            userId: context.userId || null,
          },
        })
      }

      if (target === "contact") {
        if (action === "add") {
          // Adicionar tag ao contato
          await prisma.contactTag.upsert({
            where: {
              contactId_tagId: {
                contactId: context.contactId,
                tagId: tag.id,
              },
            },
            update: {},
            create: {
              contactId: context.contactId,
              tagId: tag.id,
            },
          })
          console.log(`🏷️ Tag "${tagName}" adicionada ao contato`)
        } else if (action === "remove") {
          // Remover tag do contato
          await prisma.contactTag.deleteMany({
            where: {
              contactId: context.contactId,
              tagId: tag.id,
            },
          })
          console.log(`🏷️ Tag "${tagName}" removida do contato`)
        }
      }
    }
  }

  private findNextNode(currentNodeId: string, flowData: FlowData): FlowNode | null {
    const edge = flowData.edges.find((e) => e.source === currentNodeId)
    if (!edge) return null

    return flowData.nodes.find((n) => n.id === edge.target) || null
  }

  private findNextNodeByCondition(currentNodeId: string, flowData: FlowData, conditionResult: boolean): string | null {
    // Encontrar edge baseado no resultado da condição
    const edges = flowData.edges.filter((e) => e.source === currentNodeId)

    // Por simplicidade, usar primeira edge se condição for verdadeira
    if (conditionResult && edges.length > 0) {
      return edges[0].target
    }

    // Se condição for falsa e há segunda edge, usar ela
    if (!conditionResult && edges.length > 1) {
      return edges[1].target
    }

    return null
  }

  private processMessageVariables(message: string, context: any): string {
    let processedMessage = message

    // Substituir variáveis básicas
    processedMessage = processedMessage.replace(/\{nome\}/g, context.contactName || "amigo")
    processedMessage = processedMessage.replace(/\{mensagem\}/g, context.messageContent)

    // Adicionar mais variáveis conforme necessário
    context.variables.forEach((value: any, key: string) => {
      const regex = new RegExp(`\\{${key}\\}`, "g")
      processedMessage = processedMessage.replace(regex, value)
    })

    return processedMessage
  }

  private async callWebhook(url: string, context: any): Promise<void> {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flowId: context.flowId,
          conversationId: context.conversationId,
          contactId: context.contactId,
          messageContent: context.messageContent,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`)
      }

      console.log(`🔗 Webhook chamado com sucesso: ${url}`)
    } catch (error) {
      console.error(`❌ Erro ao chamar webhook:`, error)
    }
  }

  private generateRandomColor(): string {
    const colors = [
      "#ef4444", // red
      "#f97316", // orange
      "#eab308", // yellow
      "#22c55e", // green
      "#06b6d4", // cyan
      "#3b82f6", // blue
      "#8b5cf6", // violet
      "#ec4899", // pink
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
}

export const flowProcessor = new FlowProcessor()
