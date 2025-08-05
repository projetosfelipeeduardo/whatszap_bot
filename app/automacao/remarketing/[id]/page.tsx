"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Trash2, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function EditarRemarketingPage({ params }: { params: { id: string } }) {
  const remarketingId = params.id

  // Sample remarketing data
  const [remarketing, setRemarketing] = useState({
    id: remarketingId,
    name: "Recuperação de Carrinho Abandonado",
    description: "Envia uma mensagem para clientes que abandonaram o carrinho",
    trigger: "carrinho_abandonado",
    delay: "1",
    delayUnit: "hours",
    message:
      "Olá {{nome}}, notamos que você deixou alguns itens no carrinho. Que tal finalizar sua compra? Seu carrinho está esperando por você!",
    segmentation: "todos",
    active: true,
  })

  // Update remarketing field
  const updateRemarketing = (field: string, value: any) => {
    setRemarketing({
      ...remarketing,
      [field]: value,
    })
  }

  // Save remarketing
  const saveRemarketing = () => {
    // In a real app, you would send the updated remarketing data to your backend
    alert("Campanha de remarketing atualizada com sucesso!")
  }

  // Delete remarketing
  const deleteRemarketing = () => {
    if (confirm("Tem certeza que deseja excluir esta campanha de remarketing?")) {
      // In a real app, you would send a delete request to your backend
      alert("Campanha de remarketing excluída com sucesso!")
      // Redirect to the remarketing page
      window.location.href = "/automacao/remarketing"
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/automacao/remarketing">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Editar Campanha de Remarketing</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/automacao/remarketing/relatorios?id=${remarketingId}`}>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Relatórios
            </Button>
          </Link>
          <Button variant="destructive" onClick={deleteRemarketing}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
          <Button onClick={saveRemarketing}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="gatilho">Gatilho</TabsTrigger>
          <TabsTrigger value="mensagem">Mensagem</TabsTrigger>
          <TabsTrigger value="segmentacao">Segmentação</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h4 className="font-medium">Status da Campanha</h4>
                  <p className="text-sm text-gray-500">Ativar ou desativar esta campanha</p>
                </div>
                <Switch
                  checked={remarketing.active}
                  onCheckedChange={(checked) => updateRemarketing("active", checked)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nome da Campanha*</label>
                <Input value={remarketing.name} onChange={(e) => updateRemarketing("name", e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea
                  value={remarketing.description}
                  onChange={(e) => updateRemarketing("description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gatilho">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Gatilho</CardTitle>
              <CardDescription>Defina quando esta campanha de remarketing será acionada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Gatilho*</label>
                <Select value={remarketing.trigger} onValueChange={(value) => updateRemarketing("trigger", value)}>
                  <SelectTrigger>
                    <SelectValue />
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
                  <Input
                    type="number"
                    value={remarketing.delay}
                    onChange={(e) => updateRemarketing("delay", e.target.value)}
                    className="w-24"
                  />
                  <Select
                    value={remarketing.delayUnit}
                    onValueChange={(value) => updateRemarketing("delayUnit", value)}
                  >
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

              {remarketing.trigger === "inatividade" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Período de Inatividade</label>
                  <div className="flex gap-2">
                    <Input type="number" defaultValue="30" className="w-24" />
                    <Select defaultValue="days">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Dias</SelectItem>
                        <SelectItem value="weeks">Semanas</SelectItem>
                        <SelectItem value="months">Meses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Período sem interação para considerar um cliente inativo</p>
                </div>
              )}

              {remarketing.trigger === "visita_produto" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Produto ou Categoria</label>
                  <Input placeholder="ID do produto ou categoria" />
                  <p className="text-xs text-gray-500 mt-1">Deixe em branco para considerar qualquer produto</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mensagem">
          <Card>
            <CardHeader>
              <CardTitle>Mensagem</CardTitle>
              <CardDescription>Configure a mensagem que será enviada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mensagem*</label>
                <Textarea
                  value={remarketing.message}
                  onChange={(e) => updateRemarketing("message", e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Você pode usar variáveis como {"{nome}"}, {"{produto}"} para personalizar a mensagem.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-medium mb-3">Pré-visualização</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs ml-auto">
                    <p className="text-sm">{remarketing.message}</p>
                    <p className="text-xs text-gray-400 text-right mt-1">12:34 PM</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-medium mb-3">Mídia e Anexos</h4>
                <Button variant="outline">+ Adicionar Mídia</Button>
                <p className="text-xs text-gray-500 mt-2">
                  Você pode adicionar imagens, vídeos, áudios ou documentos à sua mensagem.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segmentacao">
          <Card>
            <CardHeader>
              <CardTitle>Segmentação</CardTitle>
              <CardDescription>Defina quais contatos receberão esta campanha</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Segmentação</label>
                <Select
                  value={remarketing.segmentation}
                  onValueChange={(value) => updateRemarketing("segmentation", value)}
                >
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

              {remarketing.segmentation === "tags" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Selecione as tags</label>
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
              )}

              {remarketing.segmentation === "grupos" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Selecione os grupos</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione os grupos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grupo1">Grupo 1</SelectItem>
                      <SelectItem value="grupo2">Grupo 2</SelectItem>
                      <SelectItem value="grupo3">Grupo 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-medium mb-3">Estimativa de Alcance</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm">
                    Com base nas configurações atuais, esta campanha poderá alcançar aproximadamente{" "}
                    <span className="font-bold">156 contatos</span> por mês.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
