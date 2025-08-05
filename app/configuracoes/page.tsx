"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Settings } from "lucide-react"
import Link from "next/link"

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("empresa")

  const menuItems = [
    { id: "respostas-rapidas", name: "Respostas Rápidas", href: "/configuracoes/respostas-rapidas" },
    { id: "campos", name: "Campos", href: "/configuracoes/campos" },
    { id: "variaveis", name: "Variável global", href: "/configuracoes/variaveis" },
    { id: "etiquetas", name: "Etiquetas", href: "/configuracoes/etiquetas" },
    { id: "departamento", name: "Departamento", href: "/configuracoes/departamento" },
    { id: "equipe", name: "Equipe", href: "/configuracoes/equipe" },
    { id: "bibliotecas", name: "Bibliotecas", href: "/configuracoes/bibliotecas" },
    { id: "horarios", name: "Horários", href: "/configuracoes/horarios" },
    { id: "fluxo", name: "Fluxo padrão", href: "/configuracoes/fluxo" },
    { id: "conexoes", name: "Conexões", href: "/configuracoes/conexoes" },
    { id: "api", name: "API", href: "/configuracoes/api" },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Configurações</h1>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-medium mb-4 text-emerald-600">Empresa</h2>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link key={item.id} href={item.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-6">Painel de Configurações</h2>
            <p className="text-sm text-gray-500 mb-6">Personalize as Configurações</p>

            <div className="space-y-6">
              <div className="pb-6 border-b border-gray-100">
                <h3 className="text-sm font-medium mb-2">Renomear empresa</h3>
                <p className="text-xs text-gray-500 mb-4">Clique aqui para alterar o nome da empresa.</p>
                <div className="flex items-center gap-2">
                  <Input defaultValue="Frontzapp" className="max-w-xs" />
                  <Button variant="outline" size="sm">
                    Alterar nome
                  </Button>
                </div>
              </div>

              <div className="pb-6 border-b border-gray-100">
                <h3 className="text-sm font-medium mb-2">Email da empresa</h3>
                <p className="text-xs text-gray-500 mb-1">Email utilizado para cobrança do produto, atual é</p>
                <p className="text-sm mb-4">igor_hiphop1@hotmail.com</p>
              </div>

              <div className="pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Aceitar Chamada</h3>
                  <Switch />
                </div>
                <p className="text-xs text-gray-500">Ative esta opção para permitir o recebimento de chamadas.</p>
              </div>

              <div className="pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Transcrever o áudio</h3>
                  <Switch />
                </div>
                <p className="text-xs text-gray-500">
                  Ative esta opção para transcrever os áudios, consome de 100 a 1500 tokens de IA.
                </p>
              </div>

              <div className="pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Separar atendimentos (Usuário)</h3>
                  <Switch />
                </div>
                <p className="text-xs text-gray-500">
                  Habilite esta funcionalidade para organizar os atendimentos por usuário, facilitando o acompanhamento.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Ativar licença</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Clique em 'Ativar por código' para inserir o código de licença e desbloquear funcionalidades.
                </p>
                <Button variant="outline" size="sm">
                  Ativar por código
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
