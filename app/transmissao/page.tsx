"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Send, Users, Calendar, ImageIcon, Clock, Smartphone } from "lucide-react"

export default function TransmissaoPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [messageType, setMessageType] = useState("text")
  const [intervalTime, setIntervalTime] = useState("60")
  const [intervalUnit, setIntervalUnit] = useState("seconds")

  const tags = [
    { id: "leads", name: "Leads", count: 45 },
    { id: "clientes", name: "Clientes", count: 120 },
    { id: "vip", name: "VIP", count: 15 },
    { id: "interessados", name: "Interessados", count: 67 },
  ]

  const campaigns = [
    {
      id: 1,
      name: "Promoção Black Friday",
      status: "Enviada",
      sent: 245,
      delivered: 238,
      opened: 156,
      date: "15/11/2024",
    },
    {
      id: 2,
      name: "Lançamento Produto X",
      status: "Agendada",
      sent: 0,
      delivered: 0,
      opened: 0,
      date: "20/11/2024",
    },
  ]

  // Lista de números WhatsApp disponíveis
  const whatsappNumbers = [
    { id: "1", number: "+55 11 99999-9999", name: "Atendimento Principal" },
    { id: "2", number: "+55 11 88888-8888", name: "Vendas" },
    { id: "3", number: "+55 11 77777-7777", name: "Suporte" },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Transmissão</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      <Tabs defaultValue="criar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="criar">Criar Transmissão</TabsTrigger>
          <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
          <TabsTrigger value="agendadas">Agendadas</TabsTrigger>
        </TabsList>

        <TabsContent value="criar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Criar Nova Transmissão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome da campanha</label>
                    <Input placeholder="Ex: Promoção de fim de ano" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">WhatsApp para envio</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um número de WhatsApp" />
                      </SelectTrigger>
                      <SelectContent>
                        {whatsappNumbers.map((whatsapp) => (
                          <SelectItem key={whatsapp.id} value={whatsapp.id}>
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4 text-blue-500" />
                              <span>
                                {whatsapp.number} ({whatsapp.name})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo de mensagem</label>
                    <Select value={messageType} onValueChange={setMessageType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="image">Imagem</SelectItem>
                        <SelectItem value="document">Documento</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {messageType === "text" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Mensagem</label>
                      <Textarea placeholder="Digite sua mensagem aqui..." className="min-h-[120px]" />
                    </div>
                  )}

                  {messageType === "image" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Imagem</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Clique para selecionar uma imagem</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Legenda</label>
                        <Textarea placeholder="Digite a legenda da imagem..." />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Intervalo entre mensagens</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={intervalTime}
                        onChange={(e) => setIntervalTime(e.target.value)}
                        className="w-24"
                      />
                      <Select value={intervalUnit} onValueChange={setIntervalUnit}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="seconds">Segundos</SelectItem>
                          <SelectItem value="minutes">Minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Recomendado: 60 segundos para evitar bloqueios
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Agendamento</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Enviar agora" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Enviar agora</SelectItem>
                        <SelectItem value="schedule">Agendar envio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Selecionar Audiência
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tags</label>
                    <div className="space-y-2">
                      {tags.map((tag) => (
                        <div
                          key={tag.id}
                          className={`flex items-center justify-between p-2 border rounded-md cursor-pointer ${
                            selectedTags.includes(tag.id) ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
                          }`}
                          onClick={() => {
                            if (selectedTags.includes(tag.id)) {
                              setSelectedTags(selectedTags.filter((id) => id !== tag.id))
                            } else {
                              setSelectedTags([...selectedTags, tag.id])
                            }
                          }}
                        >
                          <span className="text-sm">{tag.name}</span>
                          <Badge variant="outline">{tag.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <p>
                        Total selecionado:{" "}
                        <span className="font-medium">
                          {selectedTags.reduce((total, tagId) => {
                            const tag = tags.find((t) => t.id === tagId)
                            return total + (tag?.count || 0)
                          }, 0)}{" "}
                          contatos
                        </span>
                      </p>

                      {selectedTags.length > 0 && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-md text-xs">
                          <p className="flex items-center gap-1 text-blue-600">
                            <Clock className="h-3 w-3" />
                            Tempo estimado de envio:{" "}
                            <span className="font-medium">
                              {Math.ceil(
                                (selectedTags.reduce((total, tagId) => {
                                  const tag = tags.find((t) => t.id === tagId)
                                  return total + (tag?.count || 0)
                                }, 0) *
                                  Number.parseInt(intervalTime)) /
                                  (intervalUnit === "minutes" ? 60 : 1),
                              )}{" "}
                              {intervalUnit === "minutes" ? "minutos" : "segundos"}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button className="w-full" disabled={selectedTags.length === 0}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Transmissão
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="campanhas">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Campanhas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{campaign.name}</h3>
                      <Badge variant={campaign.status === "Enviada" ? "default" : "secondary"}>{campaign.status}</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Enviadas</p>
                        <p>{campaign.sent}</p>
                      </div>
                      <div>
                        <p className="font-medium">Entregues</p>
                        <p>{campaign.delivered}</p>
                      </div>
                      <div>
                        <p className="font-medium">Abertas</p>
                        <p>{campaign.opened}</p>
                      </div>
                      <div>
                        <p className="font-medium">Data</p>
                        <p>{campaign.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agendadas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Campanhas Agendadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma campanha agendada</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
