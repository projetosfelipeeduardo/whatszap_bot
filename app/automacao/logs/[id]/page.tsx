"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Search, Filter, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

export default function WebhookLogsPage({ params }: { params: { id: string } }) {
  const webhookId = params.id
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Sample webhook data
  const webhook = {
    id: webhookId,
    name: "Integração CRM",
    url: "https://meucrm.com/webhook",
  }

  // Sample logs data
  const logs = [
    {
      id: "log_1",
      event: "message_received",
      status: "success",
      statusCode: 200,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      responseTime: 120,
      payload: {
        event: "message_received",
        data: {
          messageId: "msg_123456",
          from: "5511987654321",
          content: "Olá, preciso de ajuda",
        },
      },
      response: {
        success: true,
        message: "Webhook received",
      },
    },
    {
      id: "log_2",
      event: "contact_created",
      status: "success",
      statusCode: 201,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      responseTime: 95,
      payload: {
        event: "contact_created",
        data: {
          contactId: "contact_123456",
          phone: "5511987654321",
          name: "João Silva",
        },
      },
      response: {
        success: true,
        message: "Contact created",
      },
    },
    {
      id: "log_3",
      event: "message_sent",
      status: "error",
      statusCode: 500,
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      responseTime: 2100,
      payload: {
        event: "message_sent",
        data: {
          messageId: "msg_789012",
          to: "5511987654321",
          content: "Olá, como posso ajudar?",
        },
      },
      response: {
        success: false,
        error: "Internal server error",
      },
    },
    {
      id: "log_4",
      event: "message_received",
      status: "error",
      statusCode: 404,
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      responseTime: 320,
      payload: {
        event: "message_received",
        data: {
          messageId: "msg_345678",
          from: "5511987654321",
          content: "Quero fazer um pedido",
        },
      },
      response: {
        success: false,
        error: "Endpoint not found",
      },
    },
    {
      id: "log_5",
      event: "conversation_ended",
      status: "success",
      statusCode: 200,
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      responseTime: 110,
      payload: {
        event: "conversation_ended",
        data: {
          conversationId: "conv_123456",
          contactId: "contact_123456",
          duration: 3600,
        },
      },
      response: {
        success: true,
        message: "Conversation ended",
      },
    },
  ]

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    // Search term filter
    if (searchTerm && !JSON.stringify(log).toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && log.status !== statusFilter) {
      return false
    }

    // Event filter
    if (eventFilter !== "all" && log.event !== eventFilter) {
      return false
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const logDate = new Date(log.timestamp)
      const diffHours = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60)

      if (dateFilter === "today" && diffHours > 24) {
        return false
      } else if (dateFilter === "yesterday" && (diffHours < 24 || diffHours > 48)) {
        return false
      } else if (dateFilter === "week" && diffHours > 168) {
        return false
      }
    }

    return true
  })

  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime()
    const dateB = new Date(b.timestamp).getTime()
    return sortDirection === "desc" ? dateB - dateA : dateA - dateB
  })

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "desc" ? "asc" : "desc")
  }

  // Export logs
  const exportLogs = () => {
    const dataStr = JSON.stringify(sortedLogs, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `webhook-logs-${webhook.id}-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR")
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
          <h1 className="text-xl font-semibold">Logs do Webhook</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Logs
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações do Webhook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Nome</p>
              <p>{webhook.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">URL</p>
              <p className="font-mono text-sm break-all">{webhook.url}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logs de Execução</CardTitle>
          <CardDescription>Histórico de execuções deste webhook</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar logs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Status</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="success">Sucesso</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Evento</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="message_received">Mensagem Recebida</SelectItem>
                    <SelectItem value="message_sent">Mensagem Enviada</SelectItem>
                    <SelectItem value="contact_created">Contato Criado</SelectItem>
                    <SelectItem value="conversation_ended">Conversa Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Data</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="yesterday">Ontem</SelectItem>
                    <SelectItem value="week">Última semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm">
            <div className="grid grid-cols-12 px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-500">
              <div className="col-span-3 flex items-center gap-1 cursor-pointer" onClick={toggleSortDirection}>
                Data/Hora
                {sortDirection === "desc" ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </div>
              <div className="col-span-2">Evento</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Código</div>
              <div className="col-span-2">Tempo (ms)</div>
              <div className="col-span-1">Detalhes</div>
            </div>

            {sortedLogs.length > 0 ? (
              sortedLogs.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-12 px-4 py-3 border-b border-gray-100 items-center hover:bg-gray-50"
                >
                  <div className="col-span-3 text-sm">{formatDate(log.timestamp)}</div>
                  <div className="col-span-2">
                    <Badge variant="outline" className="text-xs">
                      {log.event.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <Badge variant={log.status === "success" ? "default" : "destructive"} className="text-xs">
                      {log.status === "success" ? "Sucesso" : "Erro"}
                    </Badge>
                  </div>
                  <div className="col-span-2 font-mono text-sm">{log.statusCode}</div>
                  <div className="col-span-2 text-sm">
                    <span className={log.responseTime > 1000 ? "text-amber-600" : ""}>{log.responseTime}ms</span>
                  </div>
                  <div className="col-span-1">
                    <Link href={`/automacao/logs/${webhookId}/${log.id}`}>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Nenhum log encontrado com os filtros selecionados.</p>
              </div>
            )}
          </div>

          {sortedLogs.length > 0 && (
            <div className="mt-4 text-sm text-gray-500 text-right">
              Exibindo {sortedLogs.length} de {logs.length} logs
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
