"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreVertical } from "lucide-react"
import Link from "next/link"

export default function AutomacaoPage() {
  const [activeTab, setActiveTab] = useState("webhooks")

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Automação</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">0/30000</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Pesquisar..." className="pl-10 w-64" />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
          <TabsTrigger value="remarketing">Remarketing</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Webhooks</CardTitle>
              <Link href="/automacao/novo/webhook">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar webhook
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-md shadow-sm">
                <div className="grid grid-cols-12 px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-500">
                  <div className="col-span-4">Nome</div>
                  <div className="col-span-3">URL</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Eventos</div>
                  <div className="col-span-1">Ações</div>
                </div>

                {/* Sample webhooks - in a real app, these would come from your database */}
                {[
                  {
                    id: 1,
                    name: "Integração CRM",
                    url: "https://meucrm.com/webhook",
                    status: "Ativo",
                    events: ["message_received", "contact_created"],
                    requestsMonth: 245,
                    requestsTotal: 1024,
                  },
                  {
                    id: 2,
                    name: "Notificação de Vendas",
                    url: "https://minhaloja.com/api/notify",
                    status: "Ativo",
                    events: ["conversation_ended"],
                    requestsMonth: 128,
                    requestsTotal: 567,
                  },
                  {
                    id: 3,
                    name: "Log de Mensagens",
                    url: "https://logger.minhaapi.com/whatsapp",
                    status: "Pausado",
                    events: ["message_sent", "message_received"],
                    requestsMonth: 0,
                    requestsTotal: 2345,
                  },
                ].map((webhook) => (
                  <div
                    key={webhook.id}
                    className="grid grid-cols-12 px-4 py-3 border-b border-gray-100 items-center hover:bg-gray-50"
                  >
                    <div className="col-span-4 font-medium">{webhook.name}</div>
                    <div className="col-span-3 text-sm text-gray-600 truncate">{webhook.url}</div>
                    <div className="col-span-2">
                      <Badge variant={webhook.status === "Ativo" ? "default" : "secondary"}>{webhook.status}</Badge>
                    </div>
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.length > 0 ? (
                          <>
                            <Badge variant="outline" className="text-xs">
                              {webhook.events.length} evento(s)
                            </Badge>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm">Nenhum</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/automacao/webhook/${webhook.id}`} className="w-full">
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Editar</DropdownMenuItem>
                          </Link>
                          <Link href={`/automacao/testar/${webhook.id}`} className="w-full">
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Testar</DropdownMenuItem>
                          </Link>
                          <Link href={`/automacao/logs/${webhook.id}`} className="w-full">
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Ver logs</DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}

                {/* Empty state - show this when there are no webhooks */}
                {false && (
                  <div className="p-12 text-center text-gray-500">
                    <p className="mb-4">Nenhum webhook encontrado.</p>
                    <Link href="/automacao/novo/webhook">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar webhook
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campanhas">
          <div className="bg-white rounded-md shadow-sm">
            <div className="grid grid-cols-12 px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-500">
              <div className="col-span-4">Nome</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2">Enviados</div>
              <div className="col-span-2">Entregues</div>
              <div className="col-span-1">Ações</div>
            </div>

            <div className="p-12 text-center text-gray-500">
              <p className="mb-4">Nenhuma campanha encontrada.</p>
              <Link href="/automacao/campanhas/nova">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar campanha
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="remarketing">
          <div className="bg-white rounded-md shadow-sm">
            <div className="grid grid-cols-12 px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-500">
              <div className="col-span-4">Nome</div>
              <div className="col-span-3">Gatilho</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Ativações</div>
              <div className="col-span-1">Ações</div>
            </div>

            <div className="p-12 text-center text-gray-500">
              <p className="mb-4">Nenhuma automação de remarketing encontrada.</p>
              <Link href="/automacao/remarketing/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar remarketing
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
