"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Copy } from "lucide-react"
import Link from "next/link"

export default function ConfigSectionPage({ params }: { params: { section: string } }) {
  const [newQuickReply, setNewQuickReply] = useState("")
  const [newQuickReplyContent, setNewQuickReplyContent] = useState("")

  const renderContent = () => {
    switch (params.section) {
      case "respostas-rapidas":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Respostas Rápidas</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Resposta
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Criar Nova Resposta Rápida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Atalho</label>
                  <Input
                    value={newQuickReply}
                    onChange={(e) => setNewQuickReply(e.target.value)}
                    placeholder="Ex: /ola"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Conteúdo</label>
                  <Textarea
                    value={newQuickReplyContent}
                    onChange={(e) => setNewQuickReplyContent(e.target.value)}
                    placeholder="Olá! Como posso ajudá-lo hoje?"
                    rows={3}
                  />
                </div>
                <Button>Salvar Resposta</Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {[
                { shortcut: "/ola", content: "Olá! Como posso ajudá-lo hoje?" },
                { shortcut: "/obrigado", content: "Obrigado pelo contato! Tenha um ótimo dia!" },
                {
                  shortcut: "/horario",
                  content: "Nosso horário de funcionamento é de segunda a sexta, das 8h às 18h.",
                },
              ].map((reply, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{reply.shortcut}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{reply.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "campos":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Campos Personalizados</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Campo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Data de Nascimento", type: "Data", required: true },
                { name: "Profissão", type: "Texto", required: false },
                { name: "Interesse", type: "Seleção", required: true },
                { name: "Orçamento", type: "Número", required: false },
              ].map((field, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{field.name}</h3>
                        <p className="text-sm text-gray-500">{field.type}</p>
                        {field.required && (
                          <Badge variant="outline" className="mt-1">
                            Obrigatório
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "variaveis":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Variáveis Globais</h2>

            <Card>
              <CardHeader>
                <CardTitle>Criar Nova Variável</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome da Variável</label>
                    <Input placeholder="Ex: nome_empresa" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Valor</label>
                    <Input placeholder="Ex: Frontzapp" />
                  </div>
                </div>
                <Button>Salvar Variável</Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {[
                { name: "nome_empresa", value: "Frontzapp" },
                { name: "telefone_suporte", value: "(11) 99999-9999" },
                { name: "email_contato", value: "contato@frontzapp.com" },
              ].map((variable, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{variable.name}</h3>
                        <p className="text-sm text-gray-600">{variable.value}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "etiquetas":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Etiquetas</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Etiqueta
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Urgente", color: "bg-red-500", count: 12 },
                { name: "VIP", color: "bg-purple-500", count: 8 },
                { name: "Interessado", color: "bg-yellow-500", count: 25 },
                { name: "Cliente", color: "bg-green-500", count: 45 },
                { name: "Lead", color: "bg-blue-500", count: 67 },
              ].map((tag, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${tag.color}`}></div>
                        <div>
                          <h3 className="font-medium">{tag.name}</h3>
                          <p className="text-sm text-gray-500">{tag.count} contatos</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "api":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Configurações de API</h2>

            <Card>
              <CardHeader>
                <CardTitle>Chaves de API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <div className="flex gap-2">
                    <Input value="sk-1234567890abcdef..." readOnly />
                    <Button variant="outline">Copiar</Button>
                    <Button variant="outline">Regenerar</Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Webhook URL</label>
                  <Input placeholder="https://sua-api.com/webhook" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Ativar Webhooks</h3>
                    <p className="text-sm text-gray-500">Receber notificações em tempo real</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentação da API</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Acesse nossa documentação completa para integrar com a API do Frontzapp.
                </p>
                <Button variant="outline">Ver Documentação</Button>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Seção em Desenvolvimento</h2>
            <p className="text-gray-600">Esta seção está sendo desenvolvida.</p>
          </div>
        )
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/configuracoes">
          <Button variant="ghost" size="sm">
            ← Voltar
          </Button>
        </Link>
      </div>
      {renderContent()}
    </div>
  )
}
