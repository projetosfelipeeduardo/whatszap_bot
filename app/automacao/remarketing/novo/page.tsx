"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Clock, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function NovoRemarketingPage() {
  const [remarketing, setRemarketing] = useState({
    nome: "",
    descricao: "",
    gatilho: "mensagem_nao_respondida",
    condicoes: {
      tempoEspera: 24,
      unidadeTempo: "horas",
    },
    mensagens: [
      {
        conteudo: "",
        atraso: 0,
      },
    ],
    configuracoes: {
      ativo: true,
      maxTentativas: 3,
    },
  })

  // Update remarketing field
  const updateRemarketing = (field: string, value: any) => {
    setRemarketing({
      ...remarketing,
      [field]: value,
    })
  }

  // Update nested field
  const updateNestedField = (parent: string, field: string, value: any) => {
    setRemarketing({
      ...remarketing,
      [parent]: {
        ...remarketing[parent as keyof typeof remarketing],
        [field]: value,
      },
    })
  }

  // Update message
  const updateMensagem = (index: number, field: string, value: any) => {
    const novasMensagens = [...remarketing.mensagens]
    novasMensagens[index] = {
      ...novasMensagens[index],
      [field]: value,
    }
    setRemarketing({
      ...remarketing,
      mensagens: novasMensagens,
    })
  }

  // Add message
  const adicionarMensagem = () => {
    setRemarketing({
      ...remarketing,
      mensagens: [
        ...remarketing.mensagens,
        {
          conteudo: "",
          atraso:
            remarketing.mensagens.length > 0 ? remarketing.mensagens[remarketing.mensagens.length - 1].atraso + 24 : 24,
        },
      ],
    })
  }

  // Remove message
  const removerMensagem = (index: number) => {
    const novasMensagens = [...remarketing.mensagens]
    novasMensagens.splice(index, 1)
    setRemarketing({
      ...remarketing,
      mensagens: novasMensagens,
    })
  }

  // Save remarketing
  const salvarRemarketing = () => {
    // In a real app, you would send the remarketing data to your backend
    alert("Remarketing criado com sucesso!")
    // Redirect to the remarketing page
    window.location.href = "/automacao?tab=remarketing"
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/automacao?tab=remarketing">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Novo Remarketing</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={salvarRemarketing}
            disabled={!remarketing.nome || remarketing.mensagens.some((m) => !m.conteudo)}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="gatilho">Gatilho</TabsTrigger>
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h4 className="font-medium">Status do Remarketing</h4>
                  <p className="text-sm text-gray-500">Ativar ou desativar este remarketing</p>
                </div>
                <Switch
                  checked={remarketing.configuracoes.ativo}
                  onCheckedChange={(checked) => updateNestedField("configuracoes", "ativo", checked)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nome*</label>
                <Input
                  value={remarketing.nome}
                  onChange={(e) => updateRemarketing("nome", e.target.value)}
                  placeholder="Ex: Recuperação de Carrinho Abandonado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea
                  value={remarketing.descricao}
                  onChange={(e) => updateRemarketing("descricao", e.target.value)}
                  rows={3}
                  placeholder="Descreva o propósito deste remarketing"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gatilho">
          <Card>
            <CardHeader>
              <CardTitle>Gatilho</CardTitle>
              <CardDescription>Defina quando este remarketing deve ser acionado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Gatilho</label>
                <Select value={remarketing.gatilho} onValueChange={(value) => updateRemarketing("gatilho", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensagem_nao_respondida">Mensagem Não Respondida</SelectItem>
                    <SelectItem value="carrinho_abandonado">Carrinho Abandonado</SelectItem>
                    <SelectItem value="visita_pagina">Visita à Página</SelectItem>
                    <SelectItem value="tag_adicionada">Tag Adicionada</SelectItem>
                    <SelectItem value="evento_personalizado">Evento Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Tempo de Espera</h3>
                    <p className="text-sm text-gray-500">
                      Quanto tempo esperar após o gatilho para iniciar o remarketing
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="number"
                        min="1"
                        className="w-24"
                        value={remarketing.condicoes.tempoEspera}
                        onChange={(e) => updateNestedField("condicoes", "tempoEspera", Number(e.target.value))}
                      />
                      <Select
                        value={remarketing.condicoes.unidadeTempo}
                        onValueChange={(value) => updateNestedField("condicoes", "unidadeTempo", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutos">Minutos</SelectItem>
                          <SelectItem value="horas">Horas</SelectItem>
                          <SelectItem value="dias">Dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {remarketing.gatilho === "mensagem_nao_respondida" && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Condições Específicas</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="all-messages" defaultChecked />
                      <label htmlFor="all-messages" className="text-sm">
                        Aplicar a todas as mensagens enviadas
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="campaign-only" />
                      <label htmlFor="campaign-only" className="text-sm">
                        Aplicar apenas a mensagens de campanha
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {remarketing.gatilho === "carrinho_abandonado" && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Condições Específicas</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Valor Mínimo do Carrinho</label>
                      <Input type="number" min="0" placeholder="Ex: 50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Produtos Específicos</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione os produtos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os Produtos</SelectItem>
                          <SelectItem value="categoria1">Categoria 1</SelectItem>
                          <SelectItem value="categoria2">Categoria 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mensagens">
          <Card>
            <CardHeader>
              <CardTitle>Mensagens de Remarketing</CardTitle>
              <CardDescription>Configure as mensagens que serão enviadas na sequência de remarketing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {remarketing.mensagens.map((mensagem, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Mensagem {index + 1}</h4>
                    {remarketing.mensagens.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removerMensagem(index)}>
                        Remover
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Conteúdo da Mensagem*</label>
                      <Textarea
                        value={mensagem.conteudo}
                        onChange={(e) => updateMensagem(index, "conteudo", e.target.value)}
                        rows={4}
                        placeholder="Digite a mensagem que será enviada"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Você pode usar variáveis como {"{nome}"}, {"{telefone}"} para personalizar a mensagem.
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-emerald-50 rounded-full">
                        <Clock className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Atraso</h3>
                        <p className="text-sm text-gray-500">
                          Tempo de espera após a mensagem anterior (ou após o gatilho, para a primeira mensagem)
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Input
                            type="number"
                            min="0"
                            className="w-24"
                            value={mensagem.atraso}
                            onChange={(e) => updateMensagem(index, "atraso", Number(e.target.value))}
                          />
                          <Select defaultValue="horas">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="horas">Horas</SelectItem>
                              <SelectItem value="dias">Dias</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Mídia (opcional)</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-md p-4 text-center">
                        <p className="text-sm text-gray-500">
                          Arraste e solte uma imagem ou vídeo aqui, ou clique para selecionar
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Selecionar Arquivo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={adicionarMensagem}>
                + Adicionar Mensagem
              </Button>

              <div className="bg-blue-50 p-4 rounded-md mt-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Sequência de Remarketing</h4>
                    <p className="text-sm text-gray-500">
                      Esta sequência será interrompida se o contato responder a qualquer uma das mensagens.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Número Máximo de Tentativas</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={remarketing.configuracoes.maxTentativas}
                  onChange={(e) => updateNestedField("configuracoes", "maxTentativas", Number(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Quantas vezes este remarketing pode ser acionado para o mesmo contato
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-medium mb-2">Opções Adicionais</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="add-tag" defaultChecked />
                    <label htmlFor="add-tag" className="text-sm">
                      Adicionar tag aos contatos que receberem o remarketing
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="track-responses" defaultChecked />
                    <label htmlFor="track-responses" className="text-sm">
                      Rastrear respostas e conversões
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-response" />
                    <label htmlFor="notify-response" className="text-sm">
                      Notificar quando houver resposta
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-medium mb-2">Exclusões</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="exclude-replied" defaultChecked />
                    <label htmlFor="exclude-replied" className="text-sm">
                      Excluir contatos que já responderam anteriormente
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="exclude-tag" />
                    <label htmlFor="exclude-tag" className="text-sm">
                      Excluir contatos com tag específica
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
