"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Play, Trash2 } from "lucide-react"
import Link from "next/link"

export default function EditarAutomacaoPage({ params }: { params: { id: string } }) {
  const automacaoId = params.id

  // Sample automation data
  const [automacao, setAutomacao] = useState({
    id: automacaoId,
    nome: "Automação de Boas-vindas",
    descricao: "Envia uma mensagem de boas-vindas para novos contatos",
    tipo: "mensagem",
    ativo: true,
    gatilho: "novo_contato",
    condicoes: [
      {
        campo: "tag",
        operador: "contem",
        valor: "novo-cliente",
      },
    ],
    acoes: [
      {
        tipo: "enviar_mensagem",
        valor: "Olá, seja bem-vindo(a)! Estamos felizes em ter você conosco. Como podemos ajudar?",
        atraso: 0,
      },
      {
        tipo: "adicionar_tag",
        valor: "boas-vindas-enviado",
        atraso: 60,
      },
    ],
  })

  // Update automation field
  const updateAutomacao = (field: string, value: any) => {
    setAutomacao({
      ...automacao,
      [field]: value,
    })
  }

  // Update condition field
  const updateCondicao = (index: number, field: string, value: string) => {
    const novasCondicoes = [...automacao.condicoes]
    novasCondicoes[index] = {
      ...novasCondicoes[index],
      [field]: value,
    }
    setAutomacao({
      ...automacao,
      condicoes: novasCondicoes,
    })
  }

  // Add a new condition
  const adicionarCondicao = () => {
    setAutomacao({
      ...automacao,
      condicoes: [
        ...automacao.condicoes,
        {
          campo: "tag",
          operador: "contem",
          valor: "",
        },
      ],
    })
  }

  // Remove a condition
  const removerCondicao = (index: number) => {
    const novasCondicoes = [...automacao.condicoes]
    novasCondicoes.splice(index, 1)
    setAutomacao({
      ...automacao,
      condicoes: novasCondicoes,
    })
  }

  // Update action field
  const updateAcao = (index: number, field: string, value: any) => {
    const novasAcoes = [...automacao.acoes]
    novasAcoes[index] = {
      ...novasAcoes[index],
      [field]: value,
    }
    setAutomacao({
      ...automacao,
      acoes: novasAcoes,
    })
  }

  // Add a new action
  const adicionarAcao = () => {
    setAutomacao({
      ...automacao,
      acoes: [
        ...automacao.acoes,
        {
          tipo: "enviar_mensagem",
          valor: "",
          atraso: 0,
        },
      ],
    })
  }

  // Remove an action
  const removerAcao = (index: number) => {
    const novasAcoes = [...automacao.acoes]
    novasAcoes.splice(index, 1)
    setAutomacao({
      ...automacao,
      acoes: novasAcoes,
    })
  }

  // Save automation
  const salvarAutomacao = () => {
    // In a real app, you would send the updated automation data to your backend
    alert("Automação salva com sucesso!")
  }

  // Test automation
  const testarAutomacao = () => {
    // In a real app, you would send a test request to your backend
    alert("Teste de automação iniciado!")
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/automacao">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Editar Automação</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={testarAutomacao}>
            <Play className="h-4 w-4 mr-2" />
            Testar
          </Button>
          <Button onClick={salvarAutomacao}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="gatilho">Gatilho</TabsTrigger>
          <TabsTrigger value="condicoes">Condições</TabsTrigger>
          <TabsTrigger value="acoes">Ações</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h4 className="font-medium">Status da Automação</h4>
                  <p className="text-sm text-gray-500">Ativar ou desativar esta automação</p>
                </div>
                <Switch checked={automacao.ativo} onCheckedChange={(checked) => updateAutomacao("ativo", checked)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nome da Automação*</label>
                <Input value={automacao.nome} onChange={(e) => updateAutomacao("nome", e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea
                  value={automacao.descricao}
                  onChange={(e) => updateAutomacao("descricao", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Automação</label>
                <Select value={automacao.tipo} onValueChange={(value) => updateAutomacao("tipo", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensagem">Mensagem</SelectItem>
                    <SelectItem value="tag">Tag</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="fluxo">Fluxo de Conversa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gatilho">
          <Card>
            <CardHeader>
              <CardTitle>Gatilho</CardTitle>
              <CardDescription>Defina quando esta automação deve ser executada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Gatilho</label>
                <Select value={automacao.gatilho} onValueChange={(value) => updateAutomacao("gatilho", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo_contato">Novo Contato</SelectItem>
                    <SelectItem value="mensagem_recebida">Mensagem Recebida</SelectItem>
                    <SelectItem value="tag_adicionada">Tag Adicionada</SelectItem>
                    <SelectItem value="tag_removida">Tag Removida</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="agendamento">Agendamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {automacao.gatilho === "mensagem_recebida" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Palavra-chave</label>
                  <Input placeholder="Ex: oi, olá, menu" />
                  <p className="text-xs text-gray-500 mt-1">
                    Separe múltiplas palavras-chave com vírgula. Deixe em branco para qualquer mensagem.
                  </p>
                </div>
              )}

              {automacao.gatilho === "tag_adicionada" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Tag</label>
                  <Input placeholder="Ex: novo-cliente" />
                </div>
              )}

              {automacao.gatilho === "agendamento" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Agendamento</label>
                  <Select defaultValue="diario">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diário</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="personalizado">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="condicoes">
          <Card>
            <CardHeader>
              <CardTitle>Condições</CardTitle>
              <CardDescription>Defina condições adicionais para a execução da automação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {automacao.condicoes.map((condicao, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Condição {index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removerCondicao(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Campo</label>
                      <Select value={condicao.campo} onValueChange={(value) => updateCondicao(index, "campo", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tag">Tag</SelectItem>
                          <SelectItem value="mensagem">Mensagem</SelectItem>
                          <SelectItem value="contato">Contato</SelectItem>
                          <SelectItem value="personalizado">Campo Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Operador</label>
                      <Select
                        value={condicao.operador}
                        onValueChange={(value) => updateCondicao(index, "operador", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="igual">Igual a</SelectItem>
                          <SelectItem value="diferente">Diferente de</SelectItem>
                          <SelectItem value="contem">Contém</SelectItem>
                          <SelectItem value="nao_contem">Não contém</SelectItem>
                          <SelectItem value="comeca_com">Começa com</SelectItem>
                          <SelectItem value="termina_com">Termina com</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Valor</label>
                      <Input
                        value={condicao.valor}
                        onChange={(e) => updateCondicao(index, "valor", e.target.value)}
                        placeholder="Valor para comparação"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={adicionarCondicao}>
                + Adicionar Condição
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acoes">
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
              <CardDescription>Defina as ações que serão executadas quando o gatilho for acionado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {automacao.acoes.map((acao, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Ação {index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removerAcao(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tipo de Ação</label>
                      <Select value={acao.tipo} onValueChange={(value) => updateAcao(index, "tipo", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enviar_mensagem">Enviar Mensagem</SelectItem>
                          <SelectItem value="adicionar_tag">Adicionar Tag</SelectItem>
                          <SelectItem value="remover_tag">Remover Tag</SelectItem>
                          <SelectItem value="webhook">Chamar Webhook</SelectItem>
                          <SelectItem value="iniciar_fluxo">Iniciar Fluxo de Conversa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {acao.tipo === "enviar_mensagem" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Mensagem</label>
                        <Textarea
                          value={acao.valor}
                          onChange={(e) => updateAcao(index, "valor", e.target.value)}
                          rows={3}
                          placeholder="Digite a mensagem a ser enviada"
                        />
                      </div>
                    )}

                    {(acao.tipo === "adicionar_tag" || acao.tipo === "remover_tag") && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Tag</label>
                        <Input
                          value={acao.valor}
                          onChange={(e) => updateAcao(index, "valor", e.target.value)}
                          placeholder="Nome da tag"
                        />
                      </div>
                    )}

                    {acao.tipo === "webhook" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">URL do Webhook</label>
                        <Input
                          value={acao.valor}
                          onChange={(e) => updateAcao(index, "valor", e.target.value)}
                          placeholder="https://exemplo.com/webhook"
                        />
                      </div>
                    )}

                    {acao.tipo === "iniciar_fluxo" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Fluxo de Conversa</label>
                        <Select value={acao.valor} onValueChange={(value) => updateAcao(index, "valor", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um fluxo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fluxo1">Fluxo de Atendimento</SelectItem>
                            <SelectItem value="fluxo2">Fluxo de Vendas</SelectItem>
                            <SelectItem value="fluxo3">Fluxo de Suporte</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">Atraso (segundos)</label>
                      <Input
                        type="number"
                        value={acao.atraso}
                        onChange={(e) => updateAcao(index, "atraso", Number(e.target.value))}
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Tempo de espera antes de executar esta ação (0 = imediato)
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={adicionarAcao}>
                + Adicionar Ação
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
