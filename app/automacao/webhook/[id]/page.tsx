"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Play, Trash2, BarChart3, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function WebhookDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the webhook data based on the ID
  const webhookId = params.id

  // Sample webhook data
  const [webhook, setWebhook] = useState({
    id: webhookId,
    name: "Integração CRM",
    url: "https://meucrm.com/webhook",
    method: "POST",
    description: "Webhook para integração com o CRM da empresa",
    events: ["message_received", "contact_created"],
    headers: [
      { name: "Authorization", value: "Bearer token123" },
      { name: "Content-Type", value: "application/json" },
    ],
    isActive: true,
    timeout: 30,
    retryAttempts: 3,
    createdAt: "2025-05-15T10:30:00",
    lastTriggered: "2025-05-22T14:32:45",
    successRate: 98.5,
    totalRequests: 1024,
    requestsThisMonth: 245,
  })

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

  // Toggle event selection
  const toggleEvent = (eventId: string) => {
    if (webhook.events.includes(eventId)) {
      setWebhook({
        ...webhook,
        events: webhook.events.filter((id) => id !== eventId),
      })
    } else {
      setWebhook({
        ...webhook,
        events: [...webhook.events, eventId],
      })
    }
  }

  // Update webhook field
  const updateWebhook = (field: string, value: any) => {
    setWebhook({
      ...webhook,
      [field]: value,
    })
  }

  // Update header field
  const updateHeader = (index: number, field: "name" | "value", value: string) => {
    const newHeaders = [...webhook.headers]
    newHeaders[index][field] = value
    setWebhook({
      ...webhook,
      headers: newHeaders,
    })
  }

  // Add a new header
  const addHeader = () => {
    setWebhook({
      ...webhook,
      headers: [...webhook.headers, { name: "", value: "" }],
    })
  }

  // Remove a header
  const removeHeader = (index: number) => {
    const newHeaders = [...webhook.headers]
    newHeaders.splice(index, 1)
    setWebhook({
      ...webhook,
      headers: newHeaders,
    })
  }

  // Save webhook changes
  const saveWebhook = () => {
    // In a real app, you would send the updated webhook data to your backend
    alert("Webhook atualizado com sucesso!")
  }

  // Test webhook
  const testWebhook = () => {
    // In a real app, you would send a test request to the webhook URL
    alert("Teste enviado para o webhook!")
  }

  // Delete webhook
  const deleteWebhook = () => {
    if (confirm("Tem certeza que deseja excluir este webhook?")) {
      // In a real app, you would send a delete request to your backend
      alert("Webhook excluído com sucesso!")
      // Redirect to the automation page
      window.location.href = "/automacao"
    }
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
          <h1 className="text-xl font-semibold">Detalhes do Webhook</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={testWebhook}>
            <Play className="h-4 w-4 mr-2" />
            Testar
          </Button>
          <Button variant="destructive" onClick={deleteWebhook}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
          <Button onClick={saveWebhook}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h4 className="font-medium">Status do Webhook</h4>
                  <p className="text-sm text-gray-500">Ativar ou desativar este webhook</p>
                </div>
                <Switch checked={webhook.isActive} onCheckedChange={(checked) => updateWebhook("isActive", checked)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nome do Webhook*</label>
                <Input value={webhook.name} onChange={(e) => updateWebhook("name", e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL de Destino*</label>
                <Input value={webhook.url} onChange={(e) => updateWebhook("url", e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Método HTTP</label>
                <Select value={webhook.method} onValueChange={(value) => updateWebhook("method", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea
                  value={webhook.description}
                  onChange={(e) => updateWebhook("description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Eventos</CardTitle>
              <CardDescription>Selecione quais eventos devem disparar este webhook</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {availableEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-center justify-between p-3 border rounded-md cursor-pointer transition-colors ${
                      webhook.events.includes(event.id)
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleEvent(event.id)}
                  >
                    <div>
                      <h4 className="font-medium">{event.name}</h4>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                    <Switch
                      checked={webhook.events.includes(event.id)}
                      onCheckedChange={() => toggleEvent(event.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ))}
              </div>

              {webhook.events.length > 0 && (
                <div className="pt-2">
                  <Badge variant="outline" className="bg-emerald-50">
                    {webhook.events.length} evento(s) selecionado(s)
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="headers">
          <Card>
            <CardHeader>
              <CardTitle>Headers Personalizados</CardTitle>
              <CardDescription>Adicione headers HTTP personalizados para o seu webhook</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {webhook.headers.map((header, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <Input
                      placeholder="Nome do Header"
                      value={header.name}
                      onChange={(e) => updateHeader(index, "name", e.target.value)}
                    />
                    <Input
                      placeholder="Valor"
                      value={header.value}
                      onChange={(e) => updateHeader(index, "value", e.target.value)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeHeader(index)}>
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addHeader}>
                + Adicionar Header
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Timeout (segundos)</label>
                <Input
                  type="number"
                  value={webhook.timeout}
                  onChange={(e) => updateWebhook("timeout", Number.parseInt(e.target.value))}
                  min="1"
                  max="60"
                />
                <p className="text-xs text-gray-500 mt-1">Tempo máximo de espera pela resposta do webhook</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tentativas de Retry</label>
                <Input
                  type="number"
                  value={webhook.retryAttempts}
                  onChange={(e) => updateWebhook("retryAttempts", Number.parseInt(e.target.value))}
                  min="0"
                  max="10"
                />
                <p className="text-xs text-gray-500 mt-1">Número de tentativas em caso de falha</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-medium mb-2">Payload de Exemplo</h4>
                <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto">
                  {JSON.stringify(
                    {
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
                    null,
                    2,
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold">{webhook.successRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-full">
                    <AlertCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total de Requisições</p>
                    <p className="text-2xl font-bold">{webhook.totalRequests}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-full">
                    <Clock className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Última Execução</p>
                    <p className="text-sm font-medium">{new Date(webhook.lastTriggered).toLocaleString("pt-BR")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Execuções</CardTitle>
              <CardDescription>
                <Link
                  href={`/automacao/webhook/logs?webhookId=${webhookId}`}
                  className="text-emerald-500 hover:underline"
                >
                  Ver todos os logs
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
                    <div className="flex items-center gap-3">
                      <Badge variant={i % 3 !== 0 ? "default" : "destructive"} className="text-xs">
                        {i % 3 !== 0 ? "Sucesso" : "Erro"}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{webhook.events[i % webhook.events.length]}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(new Date().getTime() - i * 1000 * 60 * 10).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-mono">{i % 3 !== 0 ? "200 OK" : "500 Internal Server Error"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
