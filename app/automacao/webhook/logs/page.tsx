"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, Search, Filter, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function WebhookLogsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState("today")

  // Sample webhook logs data
  const webhookLogs = [
    {
      id: 1,
      webhookName: "Integração CRM",
      event: "message_received",
      status: "success",
      statusCode: 200,
      timestamp: "2025-05-22T14:32:45",
      requestPayload: { message: "Olá, preciso de ajuda", sender: "5511987654321" },
      responsePayload: { success: true, id: "msg_123" },
      duration: 245, // ms
    },
    {
      id: 2,
      webhookName: "Integração CRM",
      event: "contact_created",
      status: "success",
      statusCode: 201,
      timestamp: "2025-05-22T14:30:12",
      requestPayload: { name: "João Silva", phone: "5511987654321" },
      responsePayload: { success: true, id: "contact_456" },
      duration: 189, // ms
    },
    {
      id: 3,
      webhookName: "Notificação de Vendas",
      event: "conversation_ended",
      status: "error",
      statusCode: 500,
      timestamp: "2025-05-22T14:15:33",
      requestPayload: { conversationId: "conv_789", duration: 325 },
      responsePayload: { error: "Internal Server Error" },
      duration: 1245, // ms
    },
    {
      id: 4,
      webhookName: "Log de Mensagens",
      event: "message_sent",
      status: "success",
      statusCode: 200,
      timestamp: "2025-05-22T13:45:21",
      requestPayload: { message: "Obrigado pelo contato!", recipient: "5511987654321" },
      responsePayload: { success: true, id: "msg_456" },
      duration: 178, // ms
    },
    {
      id: 5,
      webhookName: "Integração CRM",
      event: "message_received",
      status: "error",
      statusCode: 404,
      timestamp: "2025-05-22T13:30:05",
      requestPayload: { message: "Qual o horário de funcionamento?", sender: "5511987654321" },
      responsePayload: { error: "Endpoint not found" },
      duration: 567, // ms
    },
  ]

  // Format timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Filter logs based on status filter
  const filteredLogs = webhookLogs.filter((log) => {
    if (statusFilter === "all") return true
    return log.status === statusFilter
  })

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/automacao">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Logs de Webhook</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar nos logs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="yesterday">Ontem</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Webhook</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Evento</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Código</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Data/Hora</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Duração</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      // Show log details in a modal or expand the row
                      alert(
                        `Detalhes do log ${log.id}:\n\nPayload: ${JSON.stringify(log.requestPayload)}\n\nResposta: ${JSON.stringify(log.responsePayload)}`,
                      )
                    }}
                  >
                    <td className="py-3 px-4 font-mono text-sm">{log.id}</td>
                    <td className="py-3 px-4 font-medium">{log.webhookName}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {log.event}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={log.status === "success" ? "default" : "destructive"} className="text-xs">
                        {log.status === "success" ? "Sucesso" : "Erro"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">{log.statusCode}</td>
                    <td className="py-3 px-4 text-sm">{formatTimestamp(log.timestamp)}</td>
                    <td className="py-3 px-4 text-right font-mono text-sm">{log.duration} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
