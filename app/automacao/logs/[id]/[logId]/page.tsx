"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Clock, Server, FileJson } from "lucide-react"
import Link from "next/link"

export default function WebhookLogDetailPage({ params }: { params: { id: string; logId: string } }) {
  const webhookId = params.id
  const logId = params.logId

  // Sample log data
  const log = {
    id: logId,
    event: "message_received",
    status: "success",
    statusCode: 200,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    responseTime: 120,
    payload: {
      event: "message_received",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      data: {
        messageId: "msg_123456",
        from: "5511987654321",
        to: "5511123456789",
        content: "Olá, preciso de ajuda com meu pedido",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
    },
    response: {
      success: true,
      message: "Webhook received successfully",
      timestamp: new Date(Date.now() - 1000 * 60 * 5 + 120).toISOString(),
    },
    request: {
      url: "https://meucrm.com/webhook",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Source": "FrontZapp",
        "X-Webhook-Event": "message_received",
      },
    },
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR")
  }

  // Copy JSON to clipboard
  const copyToClipboard = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    alert("Copiado para a área de transferência!")
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href={`/automacao/logs/${webhookId}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Logs
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Detalhes do Log</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-full">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Data/Hora</p>
                <p className="font-medium">{formatDate(log.timestamp)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-full">
                <FileJson className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Evento</p>
                <Badge variant="outline" className="mt-1">
                  {log.event.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-full">
                <Server className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={log.status === "success" ? "default" : "destructive"}>
                    {log.status === "success" ? "Sucesso" : "Erro"}
                  </Badge>
                  <span className="font-mono text-sm">{log.statusCode}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Requisição</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(log.payload)}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Detalhes da Requisição</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-xs text-gray-500">URL</p>
                  <p className="text-xs font-mono col-span-2 break-all">{log.request.url}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-xs text-gray-500">Método</p>
                  <p className="text-xs font-mono">{log.request.method}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-xs text-gray-500">Headers</p>
                  <div className="text-xs font-mono col-span-2">
                    {Object.entries(log.request.headers).map(([key, value]) => (
                      <div key={key}>
                        {key}: {value}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-xs text-gray-500">Tempo</p>
                  <p className="text-xs font-mono">{log.responseTime}ms</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Payload</h3>
              <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto font-mono h-64">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Resposta</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(log.response)}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </CardHeader>
          <CardContent>
            <div>
              <h3 className="text-sm font-medium mb-2">Detalhes da Resposta</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-xs text-gray-500">Status</p>
                  <div className="col-span-2">
                    <Badge variant={log.status === "success" ? "default" : "destructive"} className="text-xs">
                      {log.statusCode} {log.status === "success" ? "OK" : "Error"}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-xs text-gray-500">Timestamp</p>
                  <p className="text-xs">{formatDate(log.response.timestamp)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Corpo da Resposta</h3>
              <pre
                className={`p-3 rounded-md text-xs overflow-auto font-mono h-64 ${
                  log.status === "success" ? "bg-emerald-50" : "bg-red-50"
                }`}
              >
                {JSON.stringify(log.response, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
