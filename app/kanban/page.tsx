"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, MoreVertical, Edit, Trash2, TagIcon } from "lucide-react"

// Tipos
type Tag = {
  id: string
  name: string
  color: string
}

type Card = {
  id: string
  title: string
  description: string
  tags: Tag[]
}

type Column = {
  id: string
  title: string
  cards: Card[]
  color: string
}

// Dados iniciais
const initialTags: Tag[] = [
  { id: "tag1", name: "Urgente", color: "bg-red-500" },
  { id: "tag2", name: "Em progresso", color: "bg-yellow-500" },
  { id: "tag3", name: "Concluído", color: "bg-green-500" },
  { id: "tag4", name: "Bloqueado", color: "bg-gray-500" },
  { id: "tag5", name: "Revisão", color: "bg-purple-500" },
  { id: "tag6", name: "Baixa prioridade", color: "bg-blue-500" },
]

const initialColumns: Column[] = [
  {
    id: "col1",
    title: "A fazer",
    color: "bg-gray-500",
    cards: [
      {
        id: "card1",
        title: "Implementar autenticação",
        description: "Adicionar sistema de login com email e senha",
        tags: [initialTags[0], initialTags[5]],
      },
      {
        id: "card2",
        title: "Design da página inicial",
        description: "Criar layout responsivo para a landing page",
        tags: [initialTags[5]],
      },
    ],
  },
  {
    id: "col2",
    title: "Em andamento",
    color: "bg-blue-500",
    cards: [
      {
        id: "card3",
        title: "Integração com API",
        description: "Conectar com serviços externos",
        tags: [initialTags[1], initialTags[4]],
      },
    ],
  },
  {
    id: "col3",
    title: "Revisão",
    color: "bg-yellow-500",
    cards: [
      {
        id: "card4",
        title: "Correção de bugs",
        description: "Resolver problemas reportados pelos usuários",
        tags: [initialTags[0], initialTags[4]],
      },
    ],
  },
  {
    id: "col4",
    title: "Concluído",
    color: "bg-green-500",
    cards: [
      {
        id: "card5",
        title: "Setup inicial do projeto",
        description: "Configuração do ambiente de desenvolvimento",
        tags: [initialTags[2]],
      },
    ],
  },
]

export default function KanbanPage() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [tags, setTags] = useState<Tag[]>(initialTags)

  // Estados para diálogos
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false)
  const [isEditCardDialogOpen, setIsEditCardDialogOpen] = useState(false)
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false)
  const [isEditColumnDialogOpen, setIsEditColumnDialogOpen] = useState(false)
  const [isDeleteCardAlertOpen, setIsDeleteCardAlertOpen] = useState(false)
  const [isDeleteColumnAlertOpen, setIsDeleteColumnAlertOpen] = useState(false)
  const [isManageTagsDialogOpen, setIsManageTagsDialogOpen] = useState(false)

  // Estados para edição
  const [currentColumnId, setCurrentColumnId] = useState<string>("")
  const [currentCardId, setCurrentCardId] = useState<string>("")
  const [newCardTitle, setNewCardTitle] = useState("")
  const [newCardDescription, setNewCardDescription] = useState("")
  const [newCardTags, setNewCardTags] = useState<string[]>([])
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [newColumnColor, setNewColumnColor] = useState("bg-gray-500")

  // Estado para drag and drop
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null)
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null)
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null)

  // Funções auxiliares
  const generateId = () => Math.random().toString(36).substring(2, 9)

  const findColumnById = (columnId: string) => columns.find((col) => col.id === columnId)

  const findCardById = (columnId: string, cardId: string) => {
    const column = findColumnById(columnId)
    return column?.cards.find((card) => card.id === cardId)
  }

  // Funções para gerenciar colunas
  const addColumn = () => {
    const newColumn: Column = {
      id: generateId(),
      title: newColumnTitle,
      color: newColumnColor,
      cards: [],
    }
    setColumns([...columns, newColumn])
    setNewColumnTitle("")
    setIsAddColumnDialogOpen(false)
  }

  const updateColumn = () => {
    const updatedColumns = columns.map((col) => {
      if (col.id === currentColumnId) {
        return { ...col, title: newColumnTitle, color: newColumnColor }
      }
      return col
    })
    setColumns(updatedColumns)
    setIsEditColumnDialogOpen(false)
  }

  const deleteColumn = () => {
    const updatedColumns = columns.filter((col) => col.id !== currentColumnId)
    setColumns(updatedColumns)
    setIsDeleteColumnAlertOpen(false)
  }

  const openEditColumnDialog = (columnId: string) => {
    const column = findColumnById(columnId)
    if (column) {
      setCurrentColumnId(columnId)
      setNewColumnTitle(column.title)
      setNewColumnColor(column.color)
      setIsEditColumnDialogOpen(true)
    }
  }

  const openDeleteColumnAlert = (columnId: string) => {
    setCurrentColumnId(columnId)
    setIsDeleteColumnAlertOpen(true)
  }

  // Funções para gerenciar cards
  const addCard = () => {
    const newCard: Card = {
      id: generateId(),
      title: newCardTitle,
      description: newCardDescription,
      tags: newCardTags.map((tagId) => tags.find((tag) => tag.id === tagId)!).filter(Boolean),
    }

    const updatedColumns = columns.map((col) => {
      if (col.id === currentColumnId) {
        return { ...col, cards: [...col.cards, newCard] }
      }
      return col
    })

    setColumns(updatedColumns)
    setNewCardTitle("")
    setNewCardDescription("")
    setNewCardTags([])
    setIsAddCardDialogOpen(false)
  }

  const updateCard = () => {
    const updatedColumns = columns.map((col) => {
      if (col.id === currentColumnId) {
        const updatedCards = col.cards.map((card) => {
          if (card.id === currentCardId) {
            return {
              ...card,
              title: newCardTitle,
              description: newCardDescription,
              tags: newCardTags.map((tagId) => tags.find((tag) => tag.id === tagId)!).filter(Boolean),
            }
          }
          return card
        })
        return { ...col, cards: updatedCards }
      }
      return col
    })

    setColumns(updatedColumns)
    setIsEditCardDialogOpen(false)
  }

  const deleteCard = () => {
    const updatedColumns = columns.map((col) => {
      if (col.id === currentColumnId) {
        return { ...col, cards: col.cards.filter((card) => card.id !== currentCardId) }
      }
      return col
    })

    setColumns(updatedColumns)
    setIsDeleteCardAlertOpen(false)
  }

  const openAddCardDialog = (columnId: string) => {
    setCurrentColumnId(columnId)
    setIsAddCardDialogOpen(true)
  }

  const openEditCardDialog = (columnId: string, cardId: string) => {
    const card = findCardById(columnId, cardId)
    if (card) {
      setCurrentColumnId(columnId)
      setCurrentCardId(cardId)
      setNewCardTitle(card.title)
      setNewCardDescription(card.description)
      setNewCardTags(card.tags.map((tag) => tag.id))
      setIsEditCardDialogOpen(true)
    }
  }

  const openDeleteCardAlert = (columnId: string, cardId: string) => {
    setCurrentColumnId(columnId)
    setCurrentCardId(cardId)
    setIsDeleteCardAlertOpen(true)
  }

  // Funções para drag and drop
  const handleDragStart = (e: React.DragEvent, cardId: string, columnId: string) => {
    setDraggedCardId(cardId)
    setDraggedColumnId(columnId)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumnId(columnId)
  }

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()

    if (!draggedCardId || !draggedColumnId) return

    // Encontrar o card que está sendo arrastado
    const sourceColumn = findColumnById(draggedColumnId)
    const card = sourceColumn?.cards.find((card) => card.id === draggedCardId)

    if (!card) return

    // Remover o card da coluna de origem
    const updatedColumns = columns.map((col) => {
      if (col.id === draggedColumnId) {
        return { ...col, cards: col.cards.filter((c) => c.id !== draggedCardId) }
      }
      return col
    })

    // Adicionar o card à coluna de destino
    const finalColumns = updatedColumns.map((col) => {
      if (col.id === targetColumnId) {
        return { ...col, cards: [...col.cards, card] }
      }
      return col
    })

    setColumns(finalColumns)
    setDraggedCardId(null)
    setDraggedColumnId(null)
    setDragOverColumnId(null)
  }

  // Funções para gerenciar tags
  const addTag = (name: string, color: string) => {
    const newTag: Tag = {
      id: generateId(),
      name,
      color,
    }
    setTags([...tags, newTag])
  }

  const updateTag = (id: string, name: string, color: string) => {
    const updatedTags = tags.map((tag) => {
      if (tag.id === id) {
        return { ...tag, name, color }
      }
      return tag
    })
    setTags(updatedTags)
  }

  const deleteTag = (id: string) => {
    // Remover a tag de todos os cards
    const updatedColumns = columns.map((col) => {
      const updatedCards = col.cards.map((card) => {
        return {
          ...card,
          tags: card.tags.filter((tag) => tag.id !== id),
        }
      })
      return { ...col, cards: updatedCards }
    })

    setColumns(updatedColumns)
    setTags(tags.filter((tag) => tag.id !== id))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Kanban</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsManageTagsDialogOpen(true)}>
            <TagIcon className="h-4 w-4 mr-2" />
            Gerenciar Tags
          </Button>
          <Button size="sm" onClick={() => setIsAddColumnDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Coluna
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 bg-white rounded-md shadow-sm flex flex-col max-h-[calc(100vh-180px)]"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="p-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                <h3 className="font-medium">{column.title}</h3>
                <span className="text-xs text-gray-500">({column.cards.length})</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditColumnDialog(column.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar coluna
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openDeleteColumnAlert(column.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir coluna
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="p-3 space-y-2 overflow-y-auto flex-grow">
              {column.cards.map((card) => (
                <div
                  key={card.id}
                  className={`bg-gray-50 p-3 rounded-md border ${
                    dragOverColumnId === column.id && draggedCardId === card.id
                      ? "border-emerald-500"
                      : "border-gray-100"
                  } hover:border-gray-300 cursor-grab`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{card.title}</h4>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditCardDialog(column.id, card.id)}>
                          <Edit className="h-3 w-3 mr-2" />
                          Editar card
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteCardAlert(column.id, card.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Excluir card
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {card.description && <p className="text-sm text-gray-600 mb-2">{card.description}</p>}

                  {card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {card.tags.map((tag) => (
                        <Badge key={tag.id} className={`${tag.color} text-white text-xs`}>
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Button
                variant="ghost"
                className="w-full justify-center border border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                onClick={() => openAddCardDialog(column.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar card
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="ghost"
          className="flex-shrink-0 w-80 h-20 border border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
          onClick={() => setIsAddColumnDialogOpen(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar nova coluna
        </Button>
      </div>

      {/* Diálogo para adicionar card */}
      <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar novo card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Título</label>
              <Input
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Digite o título do card"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Descrição</label>
              <Textarea
                value={newCardDescription}
                onChange={(e) => setNewCardDescription(e.target.value)}
                placeholder="Digite a descrição do card"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tags</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    className={`${newCardTags.includes(tag.id) ? tag.color : "bg-gray-100 text-gray-800"} cursor-pointer`}
                    onClick={() => {
                      if (newCardTags.includes(tag.id)) {
                        setNewCardTags(newCardTags.filter((id) => id !== tag.id))
                      } else {
                        setNewCardTags([...newCardTags, tag.id])
                      }
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCardDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addCard} disabled={!newCardTitle.trim()}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar card */}
      <Dialog open={isEditCardDialogOpen} onOpenChange={setIsEditCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Título</label>
              <Input
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Digite o título do card"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Descrição</label>
              <Textarea
                value={newCardDescription}
                onChange={(e) => setNewCardDescription(e.target.value)}
                placeholder="Digite a descrição do card"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tags</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    className={`${newCardTags.includes(tag.id) ? tag.color : "bg-gray-100 text-gray-800"} cursor-pointer`}
                    onClick={() => {
                      if (newCardTags.includes(tag.id)) {
                        setNewCardTags(newCardTags.filter((id) => id !== tag.id))
                      } else {
                        setNewCardTags([...newCardTags, tag.id])
                      }
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCardDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={updateCard} disabled={!newCardTitle.trim()}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para adicionar coluna */}
      <Dialog open={isAddColumnDialogOpen} onOpenChange={setIsAddColumnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar nova coluna</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Título</label>
              <Input
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Digite o título da coluna"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Cor</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "bg-gray-500",
                  "bg-red-500",
                  "bg-yellow-500",
                  "bg-green-500",
                  "bg-blue-500",
                  "bg-indigo-500",
                  "bg-purple-500",
                  "bg-pink-500",
                ].map((color) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full ${color} cursor-pointer ${
                      newColumnColor === color ? "ring-2 ring-offset-2 ring-black" : ""
                    }`}
                    onClick={() => setNewColumnColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddColumnDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addColumn} disabled={!newColumnTitle.trim()}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar coluna */}
      <Dialog open={isEditColumnDialogOpen} onOpenChange={setIsEditColumnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar coluna</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Título</label>
              <Input
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Digite o título da coluna"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Cor</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "bg-gray-500",
                  "bg-red-500",
                  "bg-yellow-500",
                  "bg-green-500",
                  "bg-blue-500",
                  "bg-indigo-500",
                  "bg-purple-500",
                  "bg-pink-500",
                ].map((color) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full ${color} cursor-pointer ${
                      newColumnColor === color ? "ring-2 ring-offset-2 ring-black" : ""
                    }`}
                    onClick={() => setNewColumnColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditColumnDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={updateColumn} disabled={!newColumnTitle.trim()}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alerta para excluir card */}
      <AlertDialog open={isDeleteCardAlertOpen} onOpenChange={setIsDeleteCardAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir card</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este card? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCard} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alerta para excluir coluna */}
      <AlertDialog open={isDeleteColumnAlertOpen} onOpenChange={setIsDeleteColumnAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir coluna</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta coluna e todos os seus cards? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteColumn} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para gerenciar tags */}
      <Dialog open={isManageTagsDialogOpen} onOpenChange={setIsManageTagsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gerenciar Tags</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between p-2 border border-gray-100 rounded-md">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${tag.color}`}></div>
                  <span>{tag.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      // Aqui você poderia abrir um diálogo para editar a tag
                      const newName = prompt("Digite o novo nome da tag:", tag.name)
                      if (newName) {
                        updateTag(tag.id, newName, tag.color)
                      }
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500"
                    onClick={() => deleteTag(tag.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium mb-2">Adicionar nova tag</h4>
              <div className="flex items-center gap-2">
                <Input placeholder="Nome da tag" className="flex-grow" id="new-tag-name" />
                <div className="flex gap-1">
                  {["bg-gray-500", "bg-red-500", "bg-yellow-500", "bg-green-500", "bg-blue-500", "bg-purple-500"].map(
                    (color) => (
                      <div
                        key={color}
                        className={`w-6 h-6 rounded-full ${color} cursor-pointer hover:ring-2 hover:ring-offset-1`}
                        onClick={() => {
                          const nameInput = document.getElementById("new-tag-name") as HTMLInputElement
                          if (nameInput && nameInput.value.trim()) {
                            addTag(nameInput.value.trim(), color)
                            nameInput.value = ""
                          } else {
                            alert("Digite um nome para a tag")
                          }
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsManageTagsDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
