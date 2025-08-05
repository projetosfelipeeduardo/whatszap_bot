"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Pause, Edit, Copy, GitBranch } from "lucide-react"
import Link from "next/link"

export default function FluxosPage() {
  const flows = [
    {
      id: 1,
      name: "Boas-vindas Novos Clientes",
      description: "Fluxo automático para novos clientes",
      status: "Ativo",
      triggers: 45,
      conversions: 32,
      created: "15/10/2024",
    },
    {
      id: 2,
      name: "Recuperação de Carrinho",
      description: "Para clientes que abandonaram o carrinho",
      status: "Pausado",
      triggers: 23,
      conversions: 12,
      created: "10/10/2024",
    },
    {
      id: 3,
      name: "Suporte Técnico",
      description: "Fluxo para questões técnicas",
      status: "Ativo",
      triggers: 67,
      conversions: 54,
      created: "05/10/2024",
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Fluxos de Conversa</h1>
        <div className="flex gap-2">
          <Link href="/fluxos/construtor">
            <Button>
              <GitBranch className="h-4 w-4 mr-2" />
              Construtor Visual
            </Button>
          </Link>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Criar Fluxo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flows.map((flow) => (
          <Card key={flow.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{flow.name}</CardTitle>
                <Badge variant={flow.status === "Ativo" ? "default" : "secondary"}>{flow.status}</Badge>
              </div>
              <p className="text-sm text-gray-600">{flow.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Acionamentos</p>
                    <p className="font-medium">{flow.triggers}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Conversões</p>
                    <p className="font-medium">{flow.conversions}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Criado em {flow.created}</div>
                <div className="flex gap-2 pt-2">
                  <Link href="/fluxos/construtor">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline">
                    {flow.status === "Ativo" ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Ativar
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="h-3 w-3 mr-1" />
                    Duplicar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-dashed border-2 border-gray-200 hover:border-emerald-300 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-full py-8">
            <Plus className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-4">Criar novo fluxo</p>
            <Link href="/fluxos/construtor">
              <Button variant="outline">Criar Fluxo</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
