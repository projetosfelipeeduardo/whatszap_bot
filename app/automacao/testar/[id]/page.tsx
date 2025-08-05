"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Play, Copy, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function TestarWebhookPage({ params }: { params: { id: string } }) {
  const webhookId = params.id
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<null | {
    success: boolean
    statusCode: number
    responseTime: number
    response: string
  }>(null)
  const [selectedEvent, setSelectedEvent] = useState("message_received")
  const [customPayload, setCustomPayload] = useState("")
  const [useCustomPayload, setUseCustomPayload] = useState(false)

  // Sample webhook data
  const webhook = {
    id: webhookId,
    name: "Integração CRM",
    url: "https://meucrm.com/webhook",
    method: "POST",
  }

  // Available events for webhook triggers
  const availableEvents = [
    {
      id: "message_received",
      name: "Mensagem Recebida",
      description: "Quando uma nova mensagem é recebida",
    },
    {
      id: "message_sent",
      name: "Mensagem Enviada",
      description: "Quando uma mensagem é enviada",
    },
    {
      id: "contact_created",
      name: "Contato Criado",
      description: "Quando um novo contato é criado",
    },
    {
      id: "contact_updated",
      name: "Contato Atualizado",
      description: "Quando um contato é atualizado",
    },
    {
      id: "conversation_started",
      name: "Conversa Iniciada",
      description: "Quando uma nova conversa é iniciada",
    },
    {
      id: "conversation_ended",
      name: "Conversa Finalizada",
      description: "Quando uma conversa é finalizada",
    },
  ]

  // Get default payload for selected event
  const getDefaultPayload = (eventId: string) => {
    const payloads: Record<string, any> = {
      message_received: {
        event: "message_received",
        timestamp: new Date().toISOString(),
        data: {
          messageId: "msg_123456",
          from: "5511987654321",
          to: "5511123456789",
          content: "Olá, preciso de ajuda com meu pedido",
          timestamp: new Date().toISOString(),
        },
      },
      message_sent: {
        event: "message_sent",
        timestamp: new Date().toISOString(),
        data: {
          messageId: "msg_789012",
          from: "5511123456789",
          to: "5511987654321",
          content: "Olá! Como posso ajudar com seu pedido?",
          timestamp: new Date().toISOString(),
        },
      },
      contact_created: {
        event: "contact_created",
        timestamp: new Date().toISOString(),
        data: {
          contactId: "contact_123456",
          phone: "5511987654321",
          name: "João Silva",
          createdAt: new Date().toISOString(),
        },
      },
      contact_updated: {
        event: "contact_updated",
        timestamp: new Date().toISOString(),
        data: {
          contactId: "contact_123456",
          phone: "5511987654321",
          name: "João Silva",
          updatedAt: new Date().toISOString(),
          changes: {
            name: {
              previous: "João",
              current: "João Silva",
            },
          },
        },
      },
      conversation_started: {
        event: "conversation_started",
        timestamp: new Date().toISOString(),
        data: {
          conversationId: "conv_123456",
          contactId: "contact_123456",
          phone: "5511987654321",
          startedAt: new Date().toISOString(),
        },
      },
      conversation_ended: {
        event: "conversation_ended",
        timestamp: new Date().toISOString(),
        data: {
          conversationId: "conv_123456",
          contactId: "contact_123456",
          phone: "5511987654321",
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          endedAt: new Date().toISOString(),
          duration: 3600,
        },
      },
    }

    return JSON.stringify(payloads[eventId] || {}, null, 2)
  }

  // Test webhook
  const testWebhook = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Simulate success or failure (80% success rate)
      const success = Math.random() > 0.2

      setTestResult({
        success,
        statusCode: success ? 200 : 500,
        responseTime: Math.floor(Math.random() * 500) + 100, // 100-600ms
        response: success
          ? JSON.stringify({ success: true, message: "Webhook received successfully" }, null, 2)
          : JSON.stringify({ success: false, error: "Internal server error" }, null, 2),
      })

      setIsLoading(false)
    }, 1500)
  }

  // Copy payload to clipboard
  const copyPayload = () => {
    navigator.clipboard.writeText(useCustomPayload ? customPayload : getDefaultPayload(selectedEvent))
    alert("Payload copiado para a área de transferência!")
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/automacao">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Testar Webhook</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Webhook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Nome</p>
                <p>{webhook.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">URL</p>
                <p className="font-mono text-sm break-all">{webhook.url}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Método</p>
                <p>{webhook.method}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Teste</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Evento</label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEvents.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="use-custom-payload"
                  checked={useCustomPayload}
                  onChange={(e) => setUseCustomPayload(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="use-custom-payload" className="text-sm">
                  Usar payload personalizado
                </label>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Payload</label>
                  <Button variant="ghost" size="sm" onClick={copyPayload} className="h-7 px-2">
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">Copiar</span>
                  </Button>
                </div>
                {useCustomPayload ? (
                  <Textarea
                    value={customPayload}
                    onChange={(e) => setCustomPayload(e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                    placeholder="Digite o payload JSON personalizado"
                  />
                ) : (
                  <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto font-mono h-64">
                    {getDefaultPayload(selectedEvent)}
                  </pre>
                )}
              </div>

              <Button onClick={testWebhook} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                    Testando...
                  </div>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Testar Webhook
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resultado do Teste</CardTitle>
            <CardDescription>
              {testResult
                ? `Última execução: ${new Date().toLocaleString("pt-BR")}`
                : "Execute um teste para ver os resultados"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {testResult.success ? (
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                  <div>
                    <h3 className="font-medium">{testResult.success ? "Sucesso" : "Falha"}</h3>
                    <p className="text-sm text-gray-500">
                      Status: {testResult.statusCode} | Tempo: {testResult.responseTime}ms
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Resposta</h4>
                  <pre
                    className={`p-3 rounded-md text-xs overflow-auto font-mono h-64 ${
                      testResult.success ? "bg-emerald-50" : "bg-red-50"
                    }`}
                  >
                    {testResult.response}
                  </pre>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium mb-2">Detalhes da Requisição</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <p className="text-xs text-gray-500">URL</p>
                      <p className="text-xs font-mono col-span-2 break-all">{webhook.url}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <p className="text-xs text-gray-500">Método</p>
                      <p className="text-xs font-mono">{webhook.method}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <p className="text-xs text-gray-500">Headers</p>
                      <p className="text-xs font-mono col-span-2">
                        Content-Type: application/json
                        <br />
                        X-Webhook-Source: FrontZapp
                        <br />
                        X-Webhook-Event: {selectedEvent}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Play className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-medium mb-1">Nenhum teste executado</h3>
                <p className="text-sm text-gray-500">
                  Configure as opções de teste e clique em "Testar Webhook" para ver os resultados
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
