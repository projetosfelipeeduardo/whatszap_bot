"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Calendar, Clock, Users, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function NovaCampanhaPage() {
  const [campanha, setCampanha] = useState({
    nome: "",
    mensagem: "",
    agendamento: {
      tipo: "imediato",
      data: "",
      hora: "",
    },
    segmentacao: {
      tags: [] as string[],
      filtros: [] as any[],
    },
    configuracoes: {
      intervalo: 60,
      unidadeIntervalo: "segundos",
      ativo: true,
    },
  })

  // Update campaign field
  const updateCampanha = (field: string, value: any) => {
    setCampanha({
      ...campanha,
      [field]: value,
    })
  }

  // Update nested field
  const updateNestedField = (parent: string, field: string, value: any) => {
    setCampanha({
      ...campanha,
      [parent]: {
        ...campanha[parent as keyof typeof campanha],
        [field]: value,
      },
    })
  }

  // Save campaign
  const salvarCampanha = () => {
    // In a real app, you would send the campaign data to your backend
    alert("Campanha criada com sucesso!")
    // Redirect to the campaigns page
    window.location.href = "/automacao?tab=campanhas"
  }

  // Calculate estimated time
  const calcularTempoEstimado = () => {
    // Assuming we have 1000 contacts and the interval is in seconds
    const contatos = 1000
    const intervalo = campanha.configuracoes.intervalo
    const unidade = campanha.configuracoes.unidadeIntervalo

    const segundosTotais = contatos * (unidade === "segundos" ? intervalo : intervalo * 60)

    if (segundosTotais < 60) {
      return `${segundosTotais} segundos`
    } else if (segundosTotais < 3600) {
      return `${Math.floor(segundosTotais / 60)} minutos`
    } else if (segundosTotais < 86400) {
      return `${Math.floor(segundosTotais / 3600)} horas e ${Math.floor((segundosTotais % 3600) / 60)} minutos`
    } else {
      return `${Math.floor(segundosTotais / 86400)} dias e ${Math.floor((segundosTotais % 86400) / 3600)} horas`
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/automacao?tab=campanhas">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Nova Campanha</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={salvarCampanha} disabled={!campanha.nome || !campanha.mensagem}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Campanha
          </Button>
        </div>
      </div>

      <Tabs defaultValue="mensagem" className="space-y-6">
        <TabsList>
          <TabsTrigger value="mensagem">Mensagem</TabsTrigger>
          <TabsTrigger value="agendamento">Agendamento</TabsTrigger>
          <TabsTrigger value="segmentacao">Segmentação</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="mensagem">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Mensagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da Campanha*</label>
                  <Input
                    value={campanha.nome}
                    onChange={(e) => updateCampanha("nome", e.target.value)}
                    placeholder="Ex: Promoção de Verão"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mensagem*</label>
                  <Textarea
                    value={campanha.mensagem}
                    onChange={(e) => updateCampanha("mensagem", e.target.value)}
                    rows={8}
                    placeholder="Digite a mensagem que será enviada para os contatos"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Você pode usar variáveis como {"{nome}"}, {"{telefone}"} para personalizar a mensagem.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mídia (opcional)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center">
                    <p className="text-sm text-gray-500">
                      Arraste e solte uma imagem ou vídeo aqui, ou clique para selecionar
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pré-visualização</CardTitle>
                <CardDescription>Veja como sua mensagem será exibida</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-4 max-w-xs mx-auto">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-sm whitespace-pre-wrap">
                      {campanha.mensagem || "Sua mensagem aparecerá aqui..."}
                    </p>
                    <p className="text-xs text-gray-400 text-right mt-1">12:34 PM ✓✓</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agendamento">
          <Card>
            <CardHeader>
              <CardTitle>Agendamento da Campanha</CardTitle>
              <CardDescription>Defina quando sua campanha será enviada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Tipo de Agendamento</h3>
                    <Select
                      value={campanha.agendamento.tipo}
                      onValueChange={(value) => updateNestedField("agendamento", "tipo", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imediato">Imediato</SelectItem>
                        <SelectItem value="agendado">Agendado</SelectItem>
                        <SelectItem value="recorrente">Recorrente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {campanha.agendamento.tipo === "agendado" && (
                  <div className="ml-11 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Data</label>
                        <Input
                          type="date"
                          value={campanha.agendamento.data}
                          onChange={(e) => updateNestedField("agendamento", "data", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Hora</label>
                        <Input
                          type="time"
                          value={campanha.agendamento.hora}
                          onChange={(e) => updateNestedField("agendamento", "hora", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {campanha.agendamento.tipo === "recorrente" && (
                  <div className="ml-11 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Frequência</label>
                      <Select defaultValue="diario">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diario">Diário</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                          <SelectItem value="mensal">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Horário</label>
                      <Input type="time" defaultValue="09:00" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-50 rounded-full">
                    <Clock className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Intervalo entre Mensagens</h3>
                    <p className="text-sm text-gray-500">
                      Defina o intervalo entre o envio de cada mensagem para evitar bloqueios
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="number"
                        min="1"
                        className="w-24"
                        value={campanha.configuracoes.intervalo}
                        onChange={(e) => updateNestedField("configuracoes", "intervalo", Number(e.target.value))}
                      />
                      <Select
                        value={campanha.configuracoes.unidadeIntervalo}
                        onValueChange={(value) => updateNestedField("configuracoes", "unidadeIntervalo", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="segundos">Segundos</SelectItem>
                          <SelectItem value="minutos">Minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm">
                  <strong>Tempo estimado para envio:</strong> {calcularTempoEstimado()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Baseado em 1000 contatos e no intervalo configurado</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segmentacao">
          <Card>
            <CardHeader>
              <CardTitle>Segmentação de Contatos</CardTitle>
              <CardDescription>Defina quais contatos receberão esta campanha</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-50 rounded-full">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Segmentação por Tags</h3>
                    <p className="text-sm text-gray-500">
                      Selecione as tags para filtrar os contatos que receberão a campanha
                    </p>
                    <div className="mt-2">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione as tags" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cliente">Cliente</SelectItem>
                          <SelectItem value="lead">Lead</SelectItem>
                          <SelectItem value="interessado">Interessado</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-50 rounded-full">
                    <MessageSquare className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Filtros Avançados</h3>
                    <p className="text-sm text-gray-500">Crie filtros personalizados para segmentar seus contatos</p>
                    <div className="mt-2">
                      <Button variant="outline">+ Adicionar Filtro</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Resumo da Segmentação</h4>
                <p className="text-sm">
                  <strong>Contatos selecionados:</strong> 1000
                </p>
                <p className="text-xs text-gray-500 mt-1">Todos os contatos serão incluídos nesta campanha</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Campanha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h4 className="font-medium">Status da Campanha</h4>
                  <p className="text-sm text-gray-500">Ativar ou desativar esta campanha</p>
                </div>
                <Switch
                  checked={campanha.configuracoes.ativo}
                  onCheckedChange={(checked) => updateNestedField("configuracoes", "ativo", checked)}
                />
              </div>

              <div>
                <h4 className="font-medium mb-2">Rastreamento</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="track-clicks" />
                    <label htmlFor="track-clicks" className="text-sm">
                      Rastrear cliques em links
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="track-opens" />
                    <label htmlFor="track-opens" className="text-sm">
                      Rastrear abertura de mensagens
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Notificações</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-start" />
                    <label htmlFor="notify-start" className="text-sm">
                      Notificar quando a campanha iniciar
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-end" />
                    <label htmlFor="notify-end" className="text-sm">
                      Notificar quando a campanha terminar
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Opções Avançadas</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="stop-on-reply" defaultChecked />
                    <label htmlFor="stop-on-reply" className="text-sm">
                      Parar envio para contatos que responderem
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="add-tag" />
                    <label htmlFor="add-tag" className="text-sm">
                      Adicionar tag aos contatos que receberem a mensagem
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
