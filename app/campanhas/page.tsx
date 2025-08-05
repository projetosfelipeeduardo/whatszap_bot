"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, BarChart3, Eye, Copy, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CampanhasPage() {
  const [isCreateCampaignDialogOpen, setIsCreateCampaignDialogOpen] = useState(false)

  const campaigns = [
    {
      id: 1,
      name: "Detox Premium - Lançamento",
      source: "Facebook Ads",
      utm: "utm_source=facebook&utm_campaign=detox_premium",
      leads: 245,
      conversions: 67,
      conversionRate: 27.3,
      status: "Ativa",
      created: "15/11/2024",
    },
    {
      id: 2,
      name: "Colágeno Hidrolisado - Promoção",
      source: "Google Ads",
      utm: "utm_source=google&utm_campaign=colageno_hidrolisado",
      leads: 156,
      conversions: 34,
      conversionRate: 21.8,
      status: "Ativa",
      created: "10/11/2024",
    },
    {
      id: 3,
      name: "Multivitamínico - Remarketing",
      source: "Email Marketing",
      utm: "utm_source=email&utm_campaign=multivitaminico",
      leads: 89,
      conversions: 23,
      conversionRate: 25.8,
      status: "Pausada",
      created: "05/11/2024",
    },
  ]

  const utmTemplates = [
    {
      name: "Facebook Ads",
      template: "utm_source=facebook&utm_medium=cpc&utm_campaign={{campaign_name}}",
    },
    {
      name: "Google Ads",
      template: "utm_source=google&utm_medium=cpc&utm_campaign={{campaign_name}}",
    },
    {
      name: "Instagram",
      template: "utm_source=instagram&utm_medium=social&utm_campaign={{campaign_name}}",
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Rastreamento de Campanhas</h1>
        <div className="flex items-center gap-2">
          <Link href="/campanhas/rastreamento">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Button onClick={() => setIsCreateCampaignDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>
        </div>
      </div>

      <Tabs defaultValue="campanhas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
          <TabsTrigger value="utm">Gerador UTM</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campanhas">
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{campaign.name}</h3>
                      <p className="text-sm text-gray-500">{campaign.source}</p>
                    </div>
                    <Badge variant={campaign.status === "Ativa" ? "default" : "secondary"}>{campaign.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Leads</p>
                      <p className="text-2xl font-bold text-blue-600">{campaign.leads}</p>
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
                      <p className="text-sm text-gray-500">Criada em</p>
                      <p className="text-sm">{campaign.created}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>UTM:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">{campaign.utm}</code>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/campanhas/rastreamento">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Link href="/campanhas/rastreamento">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Analytics
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="utm">
          <Card>
            <CardHeader>
              <CardTitle>Gerador de UTM</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">URL do Site</label>
                  <Input placeholder="https://seusite.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da Campanha</label>
                  <Input placeholder="detox_premium_lancamento" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fonte (Source)</label>
                  <Input placeholder="whatsapp" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Meio (Medium)</label>
                  <Input placeholder="message" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Termo (Term)</label>
                  <Input placeholder="detox+premium" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Conteúdo (Content)</label>
                  <Input placeholder="promocao_lancamento" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="block text-sm font-medium mb-2">URL Gerada</label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value="https://seusite.com?utm_source=whatsapp&utm_medium=message&utm_campaign=detox_premium_lancamento"
                    className="font-mono text-sm"
                  />
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Templates Rápidos</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {utmTemplates.map((template, index) => (
                    <Card key={index} className="cursor-pointer hover:bg-gray-50">
                      <CardContent className="p-3">
                        <h5 className="font-medium mb-1">{template.name}</h5>
                        <code className="text-xs text-gray-600">{template.template}</code>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total de Leads</p>
                    <p className="text-2xl font-bold">490</p>
                  </div>
                  <div className="text-green-500 text-sm">+12%</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Conversões</p>
                    <p className="text-2xl font-bold">124</p>
                  </div>
                  <div className="text-green-500 text-sm">+8%</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Taxa Média</p>
                    <p className="text-2xl font-bold">25.3%</p>
                  </div>
                  <div className="text-red-500 text-sm">-2%</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Campanhas Ativas</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <div className="text-gray-500 text-sm">--</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center p-8">
            <BarChart3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Dashboard Completo Disponível</h3>
            <p className="text-gray-500 mb-4">
              Acesse o dashboard completo para visualizar todas as métricas e análises
            </p>
            <Link href="/campanhas/rastreamento">
              <Button>
                Ver Dashboard Completo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isCreateCampaignDialogOpen} onOpenChange={setIsCreateCampaignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Campanha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Campanha</label>
              <Input placeholder="Ex: Detox Premium - Lançamento" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fonte</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a fonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="facebook">Facebook Ads</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="email">Email Marketing</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL de Destino</label>
              <Input placeholder="https://seusite.com/detox-premium" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateCampaignDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsCreateCampaignDialogOpen(false)}>Criar Campanha</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
