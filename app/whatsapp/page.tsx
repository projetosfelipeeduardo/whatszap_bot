"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Smartphone, Settings, Trash2, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Interface para conexões WhatsApp
interface WhatsAppConnection {
  id: string
  name: string
  phone_number: string | null
  status: string
  qr_code: string | null
  last_seen?: string
  messages_count?: number
}

export default function WhatsAppPage() {
  const router = useRouter()
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false)
  const [connectionName, setConnectionName] = useState("")
  const [connections, setConnections] = useState<WhatsAppConnection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  // Carrega as conexões do usuário
  useEffect(() => {
    async function loadConnections() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/login?redirectTo=/whatsapp")
          return
        }

        const { data, error } = await supabase
          .from("whatsapp_connections")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setConnections(data as WhatsAppConnection[])
      } catch (error: any) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadConnections()
  }, [])

  // Cria uma nova conexão WhatsApp
  const handleCreateConnection = async () => {
    try {
      if (!connectionName.trim()) {
        setError("O nome da conexão é obrigatório")
        return
      }

      setError(null)

      // Cria a conexão no banco de dados
      const { data, error } = await supabase
        .from("whatsapp_connections")
        .insert({
          name: connectionName,
          status: "pending",
        })
        .select()

      if (error) {
        throw error
      }

      // Inicia o processo de geração de QR code via n8n
      const response = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connectionId: data[0].id,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao iniciar conexão")
      }

      const { qrCode } = await response.json()

      // Atualiza a conexão com o QR code
      await supabase
        .from("whatsapp_connections")
        .update({
          qr_code: qrCode,
        })
        .eq("id", data[0].id)

      // Adiciona a nova conexão à lista
      setConnections([data[0], ...connections])

      // Fecha o diálogo
      setIsConnectDialogOpen(false)
      setConnectionName("")
    } catch (error: any) {
      setError(error.message)
    }
  }

  // Regenera o QR code
  const handleRegenerateQRCode = async (connectionId: string) => {
    try {
      setError(null)

      // Solicita novo QR code
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
        throw new Error("Falha ao regenerar QR code")
      }

      const { qrCode } = await response.json()

      // Atualiza a conexão com o novo QR code
      await supabase
        .from("whatsapp_connections")
        .update({
          qr_code: qrCode,
          status: "pending",
        })
        .eq("id", connectionId)

      // Atualiza a lista de conexões
      setConnections(
        connections.map((conn) => (conn.id === connectionId ? { ...conn, qr_code: qrCode, status: "pending" } : conn)),
      )
    } catch (error: any) {
      setError(error.message)
    }
  }

  // Desconecta uma conexão WhatsApp
  const handleDisconnect = async (connectionId: string) => {
    try {
      setError(null)

      // Solicita desconexão
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
        throw new Error("Falha ao desconectar")
      }

      // Atualiza a conexão no banco de dados
      await supabase
        .from("whatsapp_connections")
        .update({
          status: "disconnected",
          qr_code: null,
        })
        .eq("id", connectionId)

      // Atualiza a lista de conexões
      setConnections(
        connections.map((conn) =>
          conn.id === connectionId ? { ...conn, status: "disconnected", qr_code: null } : conn,
        ),
      )
    } catch (error: any) {
      setError(error.message)
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
                <Badge
                  variant={
                    connection.status === "connected"
                      ? "default"
                      : connection.status === "pending"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {connection.status === "connected"
                    ? "Conectado"
                    : connection.status === "pending"
                      ? "Pendente"
                      : "Desconectado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {connection.phone_number && (
                  <div>
                    <p className="text-sm text-gray-500">Número</p>
                    <p className="font-medium">{connection.phone_number}</p>
                  </div>
                )}

                {connection.status === "pending" && connection.qr_code && (
                  <div className="text-center py-4">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mb-4">
                      <img src={connection.qr_code || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Escaneie este QR Code com seu WhatsApp</p>
                    <p className="text-xs text-gray-500">WhatsApp → Dispositivos conectados → Conectar dispositivo</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => handleRegenerateQRCode(connection.id)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Gerar Novo QR
                    </Button>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/whatsapp/${connection.id}`)}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Configurar
                  </Button>

                  {connection.status === "connected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleDisconnect(connection.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Desconectar
                    </Button>
                  )}

                  {connection.status === "disconnected" && (
                    <Button size="sm" variant="outline" onClick={() => handleRegenerateQRCode(connection.id)}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reconectar
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
    </div>
  )
}
