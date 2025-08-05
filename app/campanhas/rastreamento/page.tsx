"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  BarChart3,
  LineChart,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  LinkIcon,
  Download,
  MessageSquare,
  CheckCheck,
  Eye,
  ShoppingCart,
} from "lucide-react"

export default function RastreamentoCampanhasPage() {
  const [dateRange, setDateRange] = useState("7d")
  const [campaignFilter, setCampaignFilter] = useState("all")

  // Dados de exemplo para as métricas
  const metrics = {
    enviadas: { value: 1248, change: 12, direction: "up" },
    entregues: { value: 1156, change: 8, direction: "up" },
    lidas: { value: 876, change: 15, direction: "up" },
    respondidas: { value: 324, change: 5, direction: "down" },
    cliques: { value: 156, change: 10, direction: "up" },
    conversoes: { value: 42, change: 7, direction: "up" },
  }

  // Dados de exemplo para as campanhas
  const campaigns = [
    {
      id: 1,
      name: "Detox Premium - Lançamento",
      sent: 450,
      delivered: 438,
      read: 356,
      replied: 124,
      clicks: 78,
      conversions: 18,
      conversionRate: "4.1%",
      revenue: "R$ 3.240,00",
    },
    {
      id: 2,
      name: "Colágeno Hidrolisado - Promoção",
      sent: 320,
      delivered: 312,
      read: 245,
      replied: 87,
      clicks: 42,
      conversions: 12,
      conversionRate: "3.8%",
      revenue: "R$ 1.680,00",
    },
    {
      id: 3,
      name: "Multivitamínico - Remarketing",
      sent: 180,
      delivered: 175,
      read: 132,
      replied: 45,
      clicks: 23,
      conversions: 8,
      conversionRate: "4.6%",
      revenue: "R$ 960,00",
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Rastreamento de Campanhas</h1>
          <p className="text-sm text-gray-500">Monitore o desempenho das suas campanhas de WhatsApp</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="conversions">Conversões</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="setup">Configuração</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mensagens Enviadas</p>
                      <p className="text-2xl font-bold">{metrics.enviadas.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center text-sm ${
                      metrics.enviadas.direction === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {metrics.enviadas.direction === "up" ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {metrics.enviadas.change}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-50 rounded-full">
                      <CheckCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mensagens Entregues</p>
                      <p className="text-2xl font-bold">{metrics.entregues.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center text-sm ${
                      metrics.entregues.direction === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {metrics.entregues.direction === "up" ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {metrics.entregues.change}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 rounded-full">
                      <Eye className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mensagens Lidas</p>
                      <p className="text-2xl font-bold">{metrics.lidas.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center text-sm ${
                      metrics.lidas.direction === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {metrics.lidas.direction === "up" ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {metrics.lidas.change}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-50 rounded-full">
                      <MessageSquare className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Respostas Recebidas</p>
                      <p className="text-2xl font-bold">{metrics.respondidas.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center text-sm ${
                      metrics.respondidas.direction === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {metrics.respondidas.direction === "up" ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {metrics.respondidas.change}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 rounded-full">
                      <LinkIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cliques em Links</p>
                      <p className="text-2xl font-bold">{metrics.cliques.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center text-sm ${
                      metrics.cliques.direction === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {metrics.cliques.direction === "up" ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {metrics.cliques.change}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 rounded-full">
                      <ShoppingCart className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Conversões</p>
                      <p className="text-2xl font-bold">{metrics.conversoes.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center text-sm ${
                      metrics.conversoes.direction === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {metrics.conversoes.direction === "up" ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {metrics.conversoes.change}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Campanha</CardTitle>
                <CardDescription>Comparativo de métricas entre campanhas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <BarChart3 className="h-16 w-16 text-gray-300" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendência de Conversões</CardTitle>
                <CardDescription>Evolução das conversões ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <LineChart className="h-16 w-16 text-gray-300" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Desempenho das Campanhas</CardTitle>
                <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Todas as campanhas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as campanhas</SelectItem>
                    <SelectItem value="active">Campanhas ativas</SelectItem>
                    <SelectItem value="completed">Campanhas concluídas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Campanha</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Enviadas</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Entregues</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Lidas</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Respondidas</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Cliques</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Conversões</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Taxa</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{campaign.name}</td>
                        <td className="py-3 px-4 text-center">{campaign.sent}</td>
                        <td className="py-3 px-4 text-center">{campaign.delivered}</td>
                        <td className="py-3 px-4 text-center">{campaign.read}</td>
                        <td className="py-3 px-4 text-center">{campaign.replied}</td>
                        <td className="py-3 px-4 text-center">{campaign.clicks}</td>
                        <td className="py-3 px-4 text-center">{campaign.conversions}</td>
                        <td className="py-3 px-4 text-center">{campaign.conversionRate}</td>
                        <td className="py-3 px-4 text-right font-medium">{campaign.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Funil de Conversão</CardTitle>
                <CardDescription>Visualize o caminho até a conversão</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <BarChart3 className="h-16 w-16 text-gray-300" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Conversões</CardTitle>
                <CardDescription>Por produto ou campanha</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <PieChart className="h-16 w-16 text-gray-300" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Últimas Conversões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          {i}
                        </div>
                        <div>
                          <p className="font-medium">Cliente {i}</p>
                          <p className="text-sm text-gray-500">
                            Comprou Detox Premium - R$ {(Math.floor(Math.random() * 5) + 1) * 120},00
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>Campanha: Detox Premium - Lançamento</p>
                        <p>Há {Math.floor(Math.random() * 24) + 1} horas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Rastreamento de Links</CardTitle>
              <CardDescription>Desempenho dos links nas suas campanhas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">URL</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Campanha</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Cliques</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Conversões</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Taxa</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        url: "https://loja.com/detox-premium",
                        campaign: "Detox Premium - Lançamento",
                        clicks: 78,
                        conversions: 18,
                        rate: "23.1%",
                        revenue: "R$ 3.240,00",
                      },
                      {
                        url: "https://loja.com/colageno",
                        campaign: "Colágeno Hidrolisado - Promoção",
                        clicks: 42,
                        conversions: 12,
                        rate: "28.6%",
                        revenue: "R$ 1.680,00",
                      },
                      {
                        url: "https://loja.com/multivitaminico",
                        campaign: "Multivitamínico - Remarketing",
                        clicks: 23,
                        conversions: 8,
                        rate: "34.8%",
                        revenue: "R$ 960,00",
                      },
                    ].map((link, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{link.url}</div>
                          <div className="text-xs text-gray-500">
                            {link.url}?utm_source=whatsapp&utm_campaign={link.campaign.toLowerCase().replace(/ /g, "_")}
                          </div>
                        </td>
                        <td className="py-3 px-4">{link.campaign}</td>
                        <td className="py-3 px-4 text-center">{link.clicks}</td>
                        <td className="py-3 px-4 text-center">{link.conversions}</td>
                        <td className="py-3 px-4 text-center">{link.rate}</td>
                        <td className="py-3 px-4 text-right font-medium">{link.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Rastreamento</CardTitle>
                <CardDescription>Configure como rastrear suas campanhas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Rastreamento de Mensagens</h3>
                      <p className="text-sm text-gray-500">Rastrear mensagens enviadas, entregues e lidas</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Rastreamento de Cliques</h3>
                      <p className="text-sm text-gray-500">Rastrear cliques em links nas mensagens</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Parâmetros UTM</h3>
                      <p className="text-sm text-gray-500">Adicionar parâmetros UTM aos links</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Integração com Google Analytics</h3>
                      <p className="text-sm text-gray-500">Enviar dados para o Google Analytics</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Salvar Configurações</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integração com Plataforma de E-commerce</CardTitle>
                <CardDescription>Configure a integração para rastrear conversões</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Plataforma</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="woocommerce">WooCommerce</SelectItem>
                      <SelectItem value="shopify">Shopify</SelectItem>
                      <SelectItem value="magento">Magento</SelectItem>
                      <SelectItem value="vtex">VTEX</SelectItem>
                      <SelectItem value="custom">API Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL da API</label>
                  <Input placeholder="https://sua-loja.com/api" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Chave da API</label>
                  <Input type="password" value="••••••••••••••••" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Rastreamento de Conversões</h3>
                      <p className="text-sm text-gray-500">Rastrear vendas e conversões</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Conectar Plataforma</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Código de Rastreamento</CardTitle>
                <CardDescription>Adicione este código ao seu site para rastrear conversões</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {`<script>
  // Código de rastreamento do AgentFlow
  (function(w,d,s,l,i){
    w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;j.src='https://cdn.agentflow.com/tracking.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','AF-12345');
  
  // Função para rastrear conversões
  window.trackConversion = function(orderId, value, products) {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'conversion',
        orderId: orderId,
        value: value,
        products: products
      });
    }
  }
</script>`}
                  </pre>
                </div>
                <div className="mt-4">
                  <Button variant="outline">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Copiar Código
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
