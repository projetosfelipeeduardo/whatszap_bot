"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Smartphone, Settings, RefreshCw, PhoneOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/useAuth"

// Interface para conexões WhatsApp
interface WhatsAppConnection {
  id: string
  name: string
  phoneNumber: string | null
  status: string
  qrCode: string | null
  lastActivityAt?: string
  messagesSent?: number
  messagesReceived?: number
}

export default function WhatsAppPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false)
  const [connectionName, setConnectionName] = useState("")
  const [connections, setConnections] = useState<WhatsAppConnection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showQRCode, setShowQRCode] = useState<string | null>(null)

  // Carrega as conexões do usuário
  useEffect(() => {
    if (user) {
      loadConnections()
    }
  }, [user])

  const loadConnections = async () => {
    try {
      const response = await fetch("/api/whatsapp/connections")

      if (!response.ok) {
        throw new Error("Erro ao carregar conexões")
      }

      const data = await response.json()
      setConnections(data.connections || [])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Cria uma nova conexão WhatsApp
  const handleCreateConnection = async () => {
    try {
      if (!connectionName.trim()) {
        setError("O nome da conexão é obrigatório")
        return
      }

      setError(null)

      const response = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: connectionName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha ao iniciar conexão")
      }

      const { connectionId, qrCode, status } = await response.json()

      // Adicionar a nova conexão à lista
      const newConnection: WhatsAppConnection = {
        id: connectionId,
        name: connectionName,
        phoneNumber: null,
        status,
        qrCode,
        messagesSent: 0,
        messagesReceived: 0,
      }

      setConnections([newConnection, ...connections])

      // Fechar o diálogo
      setIsConnectDialogOpen(false)
      setConnectionName("")

      // Mostrar QR code se necessário
      if (qrCode) {
        setShowQRCode(connectionId)
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  // Regenera o QR code
  const handleRegenerateQRCode = async (connectionId: string) => {
    try {
      setError(null)

      const response = await fetch("/api/whatsapp/regenerate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connectionId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha ao regenerar QR code")
      }

      const { qrCode } = await response.json()

      // Atualizar a lista de conexões
      setConnections(
        connections.map((conn) => (conn.id === connectionId ? { ...conn, qrCode, status: "qr_required" } : conn)),
      )

      setShowQRCode(connectionId)
    } catch (error: any) {
      setError(error.message)
    }
  }

  // Desconecta uma conexão WhatsApp
  const handleDisconnect = async (connectionId: string) => {
    try {
      setError(null)

      const response = await fetch("/api/whatsapp/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connectionId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha ao desconectar")
      }

      // Atualizar a lista de conexões
      setConnections(
        connections.map((conn) =>
          conn.id === connectionId ? { ...conn, status: "disconnected", qrCode: null } : conn,
        ),
      )
    } catch (error: any) {
      setError(error.message)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-green-600 bg-green-100"
      case "connecting":
        return "text-yellow-600 bg-yellow-100"
      case "qr_required":
        return "text-blue-600 bg-blue-100"
      case "disconnected":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Conectado"
      case "connecting":
        return "Conectando"
      case "qr_required":
        return "QR Code"
      case "disconnected":
        return "Desconectado"
      default:
        return "Desconhecido"
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando conexões...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Conexões WhatsApp</h1>
        <Button onClick={() => setIsConnectDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Conectar Número
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection) => (
          <Card key={connection.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-emerald-500" />
                  <CardTitle className="text-lg">{connection.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(connection.status)}>{getStatusText(connection.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {connection.phoneNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Número</p>
                    <p className="font-medium">{connection.phoneNumber}</p>
                  </div>
                )}

                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Enviadas</p>
                    <p className="text-lg font-semibold text-gray-900">{connection.messagesSent || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Recebidas</p>
                    <p className="text-lg font-semibold text-gray-900">{connection.messagesReceived || 0}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => router.push(`/whatsapp/${connection.id}`)}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Configurar
                  </Button>

                  {connection.status === "connected" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 bg-transparent"
                      onClick={() => handleDisconnect(connection.id)}
                    >
                      <PhoneOff className="h-3 w-3 mr-1" />
                      Desconectar
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleRegenerateQRCode(connection.id)}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      {connection.status === "qr_required" ? "Ver QR" : "Conectar"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-dashed border-2 border-gray-200 hover:border-emerald-300 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-full py-8">
            <Plus className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-4">Conectar novo número</p>
            <Button variant="outline" onClick={() => setIsConnectDialogOpen(true)}>
              Conectar WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para criar conexão */}
      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Conectar Novo Número</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Conexão</label>
              <Input
                placeholder="Ex: Atendimento Principal"
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)}
              />
            </div>

            <p className="text-sm text-gray-600">
              Após criar a conexão, você poderá escanear o QR Code para conectar seu WhatsApp.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateConnection}>Criar Conexão</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para mostrar QR Code */}
      {showQRCode && (
        <Dialog open={!!showQRCode} onOpenChange={() => setShowQRCode(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Conectar WhatsApp</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {(() => {
                const connection = connections.find((c) => c.id === showQRCode)
                if (!connection?.qrCode) {
                  return <p>QR Code não disponível</p>
                }

                return (
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mb-4">
                      <img src={connection.qrCode || "/placeholder.svg"} alt="QR Code" className="w-64 h-64" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Como conectar:</h3>
                      <ol className="text-sm text-gray-600 space-y-1 text-left">
                        <li>1. Abra o WhatsApp no seu celular</li>
                        <li>2. Toque em Menu (⋮) → Dispositivos conectados</li>
                        <li>3. Toque em "Conectar um dispositivo"</li>
                        <li>4. Aponte a câmera para este QR Code</li>
                      </ol>
                    </div>
                  </div>
                )
              })()}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowQRCode(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
