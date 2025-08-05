"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Clock, MessageSquare, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function RemarketingPage() {
  const [isCreateRemarketingDialogOpen, setIsCreateRemarketingDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("ativos")

  // Sample remarketing campaigns
  const remarketingCampaigns = [
    {
      id: 1,
      name: "Recuperação de Carrinho Abandonado",
      status: "active",
      trigger: "carrinho_abandonado",
      delay: "1h",
      contacts: 156,
      conversions: 34,
      conversionRate: 21.8,
      lastRun: "22/05/2025",
    },
    {
      id: 2,
      name: "Reengajamento de Clientes Inativos",
      status: "active",
      trigger: "inatividade",
      delay: "30d",
      contacts: 423,
      conversions: 78,
      conversionRate: 18.4,
      lastRun: "20/05/2025",
    },
    {
      id: 3,
      name: "Follow-up após Compra",
      status: "paused",
      trigger: "compra_realizada",
      delay: "7d",
      contacts: 89,
      conversions: 0,
      conversionRate: 0,
      lastRun: "15/05/2025",
    },
  ]

  // Filter campaigns based on active tab
  const filteredCampaigns = remarketingCampaigns.filter((campaign) => {
    if (activeTab === "ativos") return campaign.status === "active"
    if (activeTab === "pausados") return campaign.status === "paused"
    return true // "todos" tab
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Remarketing</h1>
          <p className="text-sm text-gray-500">Gerencie suas campanhas de remarketing automatizadas</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/automacao/remarketing/relatorios">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Relatórios
            </Button>
          </Link>
          <Button onClick={() => setIsCreateRemarketingDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>
        </div>
      </div>

      <Tabs defaultValue="ativos" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="ativos">Ativos</TabsTrigger>
          <TabsTrigger value="pausados">Pausados</TabsTrigger>
          <TabsTrigger value="todos">Todos</TabsTrigger>
        </TabsList>

        <TabsContent value="ativos" className="space-y-4">
          {filteredCampaigns.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma campanha ativa</h3>
                <p className="text-gray-500 mb-4 text-center max-w-md">
                  Você ainda não tem campanhas de remarketing ativas. Crie uma nova campanha para começar.
                </p>
                <Button onClick={() => setIsCreateRemarketingDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Campanha
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredCampaigns.map((campaign) => <RemarketingCampaignCard key={campaign.id} campaign={campaign} />)
          )}
        </TabsContent>

        <TabsContent value="pausados" className="space-y-4">
          {filteredCampaigns.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma campanha pausada</h3>
                <p className="text-gray-500 mb-4 text-center max-w-md">
                  Você não tem campanhas de remarketing pausadas no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredCampaigns.map((campaign) => <RemarketingCampaignCard key={campaign.id} campaign={campaign} />)
          )}
        </TabsContent>

        <TabsContent value="todos" className="space-y-4">
          {remarketingCampaigns.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma campanha encontrada</h3>
                <p className="text-gray-500 mb-4 text-center max-w-md">
                  Você ainda não tem campanhas de remarketing. Crie uma nova campanha para começar.
                </p>
                <Button onClick={() => setIsCreateRemarketingDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Campanha
                </Button>
              </CardContent>
            </Card>
          ) : (
            remarketingCampaigns.map((campaign) => <RemarketingCampaignCard key={campaign.id} campaign={campaign} />)
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isCreateRemarketingDialogOpen} onOpenChange={setIsCreateRemarketingDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nova Campanha de Remarketing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Campanha*</label>
              <Input placeholder="Ex: Recuperação de Carrinho Abandonado" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gatilho*</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um gatilho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carrinho_abandonado">Carrinho Abandonado</SelectItem>
                  <SelectItem value="inatividade">Inatividade</SelectItem>
                  <SelectItem value="compra_realizada">Compra Realizada</SelectItem>
                  <SelectItem value="visita_produto">Visita a Produto</SelectItem>
                  <SelectItem value="personalizado">Gatilho Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Atraso após o gatilho*</label>
              <div className="flex gap-2">
                <Input type="number" placeholder="1" className="w-24" />
                <Select defaultValue="hours">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutos</SelectItem>
                    <SelectItem value="hours">Horas</SelectItem>
                    <SelectItem value="days">Dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tempo de espera após o gatilho antes de enviar a mensagem de remarketing
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mensagem*</label>
              <Textarea placeholder="Digite a mensagem que será enviada para os contatos" rows={4} />
              <p className="text-xs text-gray-500 mt-1">
                Você pode usar variáveis como {"{nome}"}, {"{produto}"} para personalizar a mensagem.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Segmentação</label>
              <Select defaultValue="todos">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os contatos que acionarem o gatilho</SelectItem>
                  <SelectItem value="tags">Filtrar por tags</SelectItem>
                  <SelectItem value="grupos">Filtrar por grupos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <h4 className="font-medium">Ativar campanha imediatamente</h4>
                <p className="text-sm text-gray-500">A campanha começará a funcionar assim que for criada</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateRemarketingDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsCreateRemarketingDialogOpen(false)}>Criar Campanha</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Component for displaying a remarketing campaign card
function RemarketingCampaignCard({ campaign }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">{campaign.name}</h3>
            <p className="text-sm text-gray-500">
              Gatilho: {campaign.trigger} • Atraso: {campaign.delay}
            </p>
          </div>
          <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
            {campaign.status === "active" ? "Ativo" : "Pausado"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Contatos</p>
            <p className="text-2xl font-bold text-blue-600">{campaign.contacts}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Conversões</p>
            <p className="text-2xl font-bold text-green-600">{campaign.conversions}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Taxa de Conversão</p>
            <p className="text-2xl font-bold text-purple-600">{campaign.conversionRate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Última execução</p>
            <p className="text-sm">{campaign.lastRun}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Link href={`/automacao/remarketing/${campaign.id}`}>
            <Button variant="outline" size="sm">
              Editar
            </Button>
          </Link>
          <Link href={`/automacao/remarketing/relatorios?id=${campaign.id}`}>
            <Button variant="outline" size="sm">
              Relatórios
            </Button>
          </Link>
          <Button variant={campaign.status === "active" ? "secondary" : "default"} size="sm">
            {campaign.status === "active" ? "Pausar" : "Ativar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
