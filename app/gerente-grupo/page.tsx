"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Users, MoreVertical, Settings, MessageSquare, UserPlus } from "lucide-react"

export default function GerenteGrupoPage() {
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")

  const groups = [
    {
      id: 1,
      name: "Suporte Técnico",
      description: "Grupo para questões técnicas",
      members: 45,
      status: "Ativo",
      created: "15/10/2024",
    },
    {
      id: 2,
      name: "Vendas",
      description: "Equipe de vendas e prospecção",
      members: 23,
      status: "Ativo",
      created: "10/10/2024",
    },
    {
      id: 3,
      name: "Marketing",
      description: "Campanhas e estratégias de marketing",
      members: 12,
      status: "Inativo",
      created: "05/10/2024",
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Gerente de Grupo</h1>
        <Button onClick={() => setIsCreateGroupDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Grupo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Adicionar membros
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Enviar mensagem
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Excluir grupo</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-gray-600">{group.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{group.members} membros</span>
                  </div>
                  <Badge variant={group.status === "Ativo" ? "default" : "secondary"}>{group.status}</Badge>
                </div>
                <div className="text-xs text-gray-500">Criado em {group.created}</div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Gerenciar
                  </Button>
                  <Button size="sm" className="flex-1">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Mensagem
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-dashed border-2 border-gray-200 hover:border-emerald-300 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-full py-8">
            <Plus className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-4">Criar novo grupo</p>
            <Button variant="outline" onClick={() => setIsCreateGroupDialogOpen(true)}>
              Criar Grupo
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Grupo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do grupo</label>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Ex: Equipe de Suporte"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <Input
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="Descreva o propósito do grupo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateGroupDialogOpen(false)}>
              Cancelar
            </Button>
            <Button disabled={!newGroupName.trim()}>Criar Grupo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
