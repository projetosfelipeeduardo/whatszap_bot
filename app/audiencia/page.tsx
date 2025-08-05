"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserX, Download, Upload, Tag, MoreVertical, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Dados de exemplo
const contacts = [
  {
    id: 1,
    name: "5511911304353",
    whatsapp: "+55 (11) 91130-4353",
    email: "Não informado",
    date: "15/05/2025 10:32",
    tags: ["Lead", "Interessado"],
  },
  {
    id: 2,
    name: "5511942949681",
    whatsapp: "+55 (11) 94294-9681",
    email: "Não informado",
    date: "19/05/2025 21:32",
    tags: ["Cliente"],
  },
  {
    id: 3,
    name: "5541923383861",
    whatsapp: "+55 (41) 92338-3861",
    email: "Não informado",
    date: "16/05/2025 10:07",
    tags: ["Lead"],
  },
  {
    id: 4,
    name: "5567811473121",
    whatsapp: "+55 (67) 81147-3121",
    email: "Não informado",
    date: "15/05/2025 18:35",
    tags: [],
  },
  {
    id: 5,
    name: "Atenor",
    whatsapp: "+55 (91) 84600-4661",
    email: "Não informado",
    date: "15/05/2025 11:26",
    tags: ["VIP", "Cliente"],
  },
]

// Dados para o Kanban
const kanbanColumns = [
  { id: "leads", title: "Leads", color: "bg-blue-500", count: 12 },
  { id: "interessados", title: "Interessados", color: "bg-yellow-500", count: 8 },
  { id: "clientes", title: "Clientes", color: "bg-green-500", count: 15 },
  { id: "inativos", title: "Inativos", color: "bg-gray-500", count: 3 },
]

export default function AudienciaPage() {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Audiência</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "list" ? "kanban" : "list")}>
            {viewMode === "list" ? "Ver Kanban" : "Ver Lista"}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="todos" className="mb-6">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
          <TabsTrigger value="custom">
            <Plus className="h-3 w-3 mr-1" />
            Nova Lista
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Pesquisar..." className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <UserX className="h-4 w-4 mr-2" />
            Remover todos
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="bg-white rounded-md shadow-sm">
          <div className="grid grid-cols-12 px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-500">
            <div className="col-span-3">Nome</div>
            <div className="col-span-3">WhatsApp</div>
            <div className="col-span-2">Email</div>
            <div className="col-span-2">Data de inscrição</div>
            <div className="col-span-1">Tags</div>
            <div className="col-span-1">Ações</div>
          </div>

          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="grid grid-cols-12 px-4 py-3 border-b border-gray-100 items-center hover:bg-gray-50"
            >
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                  {typeof contact.name === "string" && isNaN(Number(contact.name.charAt(0)))
                    ? contact.name.charAt(0).toUpperCase()
                    : "#"}
                </div>
                <span className="font-medium truncate">{contact.name}</span>
              </div>
              <div className="col-span-3 text-gray-600">{contact.whatsapp}</div>
              <div className="col-span-2 text-gray-600">{contact.email}</div>
              <div className="col-span-2 text-gray-600">{contact.date}</div>
              <div className="col-span-1">
                <div className="flex flex-wrap gap-1">
                  {contact.tags.length > 0 ? (
                    contact.tags.slice(0, 1).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Tag className="h-3 w-3" />
                    </Button>
                  )}
                  {contact.tags.length > 1 && (
                    <Badge variant="outline" className="text-xs">
                      +{contact.tags.length - 1}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="col-span-1 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Ações</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                    <DropdownMenuItem>Editar tags</DropdownMenuItem>
                    <DropdownMenuItem>Enviar mensagem</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Remover</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((column) => (
            <div key={column.id} className="bg-white rounded-md shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  <h3 className="font-medium">{column.title}</h3>
                  <span className="text-xs text-gray-500">({column.count})</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
                {contacts
                  .filter((_, i) => i % 4 === kanbanColumns.indexOf(column) % 4)
                  .map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-gray-300 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                            {typeof contact.name === "string" && isNaN(Number(contact.name.charAt(0)))
                              ? contact.name.charAt(0).toUpperCase()
                              : "#"}
                          </div>
                          <span className="font-medium truncate">{contact.name}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                            <DropdownMenuItem>Mover para</DropdownMenuItem>
                            <DropdownMenuItem>Editar tags</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{contact.whatsapp}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {contact.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        <Button variant="ghost" size="sm" className="h-5 p-0 text-xs">
                          <Plus className="h-3 w-3 mr-1" />
                          Tag
                        </Button>
                      </div>
                    </div>
                  ))}
                <div className="border border-dashed border-gray-200 rounded-md p-3 text-center text-sm text-gray-400 hover:border-emerald-300 hover:text-emerald-500 cursor-pointer">
                  <Plus className="h-4 w-4 mx-auto mb-1" />
                  Adicionar contato
                </div>
              </div>
            </div>
          ))}
          <div className="bg-white rounded-md shadow-sm border border-dashed border-gray-200 flex items-center justify-center">
            <Button variant="ghost" className="h-full w-full flex flex-col items-center py-8">
              <Plus className="h-6 w-6 mb-2" />
              <span>Adicionar nova coluna</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
