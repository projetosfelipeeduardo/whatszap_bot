"use client"

import { Button } from "@/components/ui/button"
import { Plus, Settings, Smartphone, Bot } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function AtendimentoPage() {
  const agents = [
    {
      id: 1,
      name: "Agente Detox Premium",
      createdAt: "14/05/25",
      status: "Ativo",
      whatsapp: "+55 11 99999-9999",
      whatsappName: "Vendas Encapsulados",
      messagesCount: 1247,
    },
    {
      id: 2,
      name: "Agente Colágeno Hidrolisado",
      createdAt: "17/05/25",
      status: "Inativo",
      whatsapp: "+55 11 88888-8888",
      whatsappName: "Suporte Nutricional",
      messagesCount: 856,
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Atendentes IA</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">512726/5000000</span>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          <Link href="/atendimento/novo">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm">
        <div className="grid grid-cols-12 px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-500">
          <div className="col-span-3">Nome</div>
          <div className="col-span-3">WhatsApp</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Mensagens</div>
          <div className="col-span-2">Ações</div>
        </div>

        {agents.map((agent) => (
          <div
            key={agent.id}
            className="grid grid-cols-12 px-4 py-3 border-b border-gray-100 items-center hover:bg-gray-50"
          >
            <div className="col-span-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <div className="font-medium">{agent.name}</div>
                <div className="text-xs text-gray-500">Criado em {agent.createdAt}</div>
              </div>
            </div>

            <div className="col-span-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Smartphone className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="text-sm">{agent.whatsapp}</div>
                <div className="text-xs text-gray-500">{agent.whatsappName}</div>
              </div>
            </div>

            <div className="col-span-2">
              <Badge variant={agent.status === "Ativo" ? "default" : "secondary"}>{agent.status}</Badge>
            </div>

            <div className="col-span-2">
              <div className="text-sm">{agent.messagesCount.toLocaleString()}</div>
              <div className="text-xs text-gray-500">mensagens</div>
            </div>

            <div className="col-span-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Ações</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/atendimento/editar/${agent.id}`}>
                    <DropdownMenuItem>Editar agente</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>{agent.status === "Ativo" ? "Desativar" : "Ativar"} agente</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

        <div className="p-8 text-center text-gray-500 text-sm">
          <Link href="/atendimento/novo" className="text-emerald-500 hover:underline">
            + Adicionar novo agente
          </Link>
        </div>
      </div>
    </div>
  )
}
