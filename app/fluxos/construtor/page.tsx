"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Play, Save, MessageSquare, Bot, Timer, Filter, Zap } from "lucide-react"
import Link from "next/link"

type NodeType = "trigger" | "condition" | "action" | "ai" | "delay"

type FlowNode = {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: {
    label: string
    config: any
  }
}

type FlowEdge = {
  id: string
  source: string
  target: string
  label?: string
}

export default function ConstrutorFluxoPage() {
  const [nodes, setNodes] = useState<FlowNode[]>([
    {
      id: "start",
      type: "trigger",
      position: { x: 100, y: 100 },
      data: {
        label: "Palavra-chave: 'oi'",
        config: { keyword: "oi" },
      },
    },
  ])
  const [edges, setEdges] = useState<FlowEdge[]>([])
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [draggedNodeType, setDraggedNodeType] = useState<NodeType | null>(null)
  const [isCreatingEdge, setIsCreatingEdge] = useState(false)
  const [edgeStart, setEdgeStart] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [tempEdge, setTempEdge] = useState<{ from: { x: number; y: number }; to: { x: number; y: number } } | null>(
    null,
  )

  const nodeTypes = [
    { type: "trigger" as NodeType, label: "Gatilho", icon: Zap, color: "bg-blue-500" },
    { type: "condition" as NodeType, label: "Condição", icon: Filter, color: "bg-yellow-500" },
    { type: "action" as NodeType, label: "Ação", icon: MessageSquare, color: "bg-green-500" },
    { type: "ai" as NodeType, label: "IA", icon: Bot, color: "bg-purple-500" },
    { type: "delay" as NodeType, label: "Delay", icon: Timer, color: "bg-gray-500" },
  ]

  const addNode = useCallback((type: NodeType, position: { x: number; y: number }) => {
    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      type,
      position,
      data: {
        label: `Novo ${type}`,
        config: {},
      },
    }
    setNodes((prev) => [...prev, newNode])
  }, [])

  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    setDraggedNodeType(nodeType)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedNodeType) return

    const rect = e.currentTarget.getBoundingClientRect()
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    addNode(draggedNodeType, position)
    setDraggedNodeType(null)
  }

  const openNodeConfig = (node: FlowNode) => {
    setSelectedNode(node)
    setIsConfigDialogOpen(true)
  }

  const getNodeIcon = (type: NodeType) => {
    const nodeType = nodeTypes.find((nt) => nt.type === type)
    return nodeType?.icon || MessageSquare
  }

  const getNodeColor = (type: NodeType) => {
    const nodeType = nodeTypes.find((nt) => nt.type === type)
    return nodeType?.color || "bg-gray-500"
  }

  // Node dragging functionality
  const [draggedNode, setDraggedNode] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null)

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (isCreatingEdge) return

    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return

    setDraggedNode({
      id: nodeId,
      offsetX: e.clientX - node.position.x,
      offsetY: e.clientY - node.position.y,
    })
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedNode) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left - draggedNode.offsetX
      const y = e.clientY - rect.top - draggedNode.offsetY

      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === draggedNode.id) {
            return {
              ...node,
              position: { x, y },
            }
          }
          return node
        }),
      )
    }

    // Update temp edge if creating an edge
    if (isCreatingEdge && edgeStart) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const startNode = nodes.find((n) => n.id === edgeStart)
      if (!startNode) return

      const startX = startNode.position.x + 150 // Assuming node width is 150px
      const startY = startNode.position.y + 40 // Assuming node height center is at 40px

      setTempEdge({
        from: { x: startX, y: startY },
        to: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      })
    }
  }

  const handleCanvasMouseUp = () => {
    setDraggedNode(null)
  }

  // Edge creation functionality
  const handleConnectionPointClick = (nodeId: string, isOutput: boolean) => {
    if (isOutput) {
      // Start creating an edge
      setIsCreatingEdge(true)
      setEdgeStart(nodeId)
    } else if (isCreatingEdge && edgeStart && edgeStart !== nodeId) {
      // Complete the edge
      const newEdge: FlowEdge = {
        id: `edge-${Date.now()}`,
        source: edgeStart,
        target: nodeId,
      }
      setEdges((prev) => [...prev, newEdge])
      setIsCreatingEdge(false)
      setEdgeStart(null)
      setTempEdge(null)
    }
  }

  // Cancel edge creation on canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isCreatingEdge && e.target === canvasRef.current) {
      setIsCreatingEdge(false)
      setEdgeStart(null)
      setTempEdge(null)
    }
  }

  // Update node configuration
  const updateNodeConfig = (config: any) => {
    if (!selectedNode) return

    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              config,
              label: getNodeLabel(node.type, config),
            },
          }
        }
        return node
      }),
    )
    setIsConfigDialogOpen(false)
  }

  // Get node label based on type and config
  const getNodeLabel = (type: NodeType, config: any): string => {
    switch (type) {
      case "trigger":
        return `Palavra-chave: '${config.keyword || ""}'`
      case "action":
        return config.message
          ? `Mensagem: "${config.message.substring(0, 20)}${config.message.length > 20 ? "..." : ""}"`
          : "Nova ação"
      case "condition":
        return config.field && config.operator && config.value
          ? `${config.field} ${config.operator} "${config.value}"`
          : "Nova condição"
      case "delay":
        return config.time ? `Esperar ${config.time} ${config.unit}` : "Novo delay"
      case "ai":
        return config.agent ? `Agente: ${config.agent}` : "Novo agente IA"
      default:
        return `Novo ${type}`
    }
  }

  // Draw edges
  useEffect(() => {
    const canvas = document.getElementById("edges-canvas") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const container = canvasRef.current
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw edges
    edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source)
      const targetNode = nodes.find((n) => n.id === edge.target)
      if (!sourceNode || !targetNode) return

      const sourceX = sourceNode.position.x + 150 // Assuming node width is 150px
      const sourceY = sourceNode.position.y + 40 // Assuming node height center is at 40px
      const targetX = targetNode.position.x
      const targetY = targetNode.position.y + 40 // Assuming node height center is at 40px

      drawEdge(ctx, sourceX, sourceY, targetX, targetY)
    })

    // Draw temp edge if creating an edge
    if (tempEdge) {
      drawEdge(ctx, tempEdge.from.x, tempEdge.from.y, tempEdge.to.x, tempEdge.to.y)
    }
  }, [nodes, edges, tempEdge])

  // Draw an edge between two points
  const drawEdge = (
    ctx: CanvasRenderingContext2D,
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number,
  ) => {
    const controlPointOffset = 80
    ctx.beginPath()
    ctx.moveTo(sourceX, sourceY)
    ctx.bezierCurveTo(sourceX + controlPointOffset, sourceY, targetX - controlPointOffset, targetY, targetX, targetY)
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw arrow at target
    const angle = Math.atan2(targetY - (targetY - 10), targetX - (targetX - 10))
    ctx.beginPath()
    ctx.moveTo(targetX, targetY)
    ctx.lineTo(targetX - 10 * Math.cos(angle - Math.PI / 6), targetY - 10 * Math.sin(angle - Math.PI / 6))
    ctx.lineTo(targetX - 10 * Math.cos(angle + Math.PI / 6), targetY - 10 * Math.sin(angle + Math.PI / 6))
    ctx.closePath()
    ctx.fillStyle = "#10b981"
    ctx.fill()
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/fluxos">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Construtor de Fluxos</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Testar
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar com componentes */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h3 className="font-medium mb-4">Componentes</h3>
          <div className="space-y-2">
            {nodeTypes.map((nodeType) => {
              const Icon = nodeType.icon
              return (
                <div
                  key={nodeType.type}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-md cursor-grab hover:bg-gray-50"
                  draggable
                  onDragStart={(e) => handleDragStart(e, nodeType.type)}
                >
                  <div className={`p-1 rounded ${nodeType.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm">{nodeType.label}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-4">Configurações do Fluxo</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Nome do Fluxo</label>
                <Input placeholder="Meu Fluxo" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Textarea placeholder="Descrição do fluxo..." rows={3} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge variant="outline">Rascunho</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas principal */}
        <div
          ref={canvasRef}
          className="flex-1 bg-gray-50 relative overflow-hidden"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onClick={handleCanvasClick}
        >
          {/* Grid de fundo */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Canvas for edges */}
          <canvas id="edges-canvas" className="absolute inset-0 pointer-events-none" />

          {/* Nodes */}
          {nodes.map((node) => {
            const Icon = getNodeIcon(node.type)
            return (
              <div
                key={node.id}
                className="absolute bg-white border-2 border-gray-200 rounded-lg p-3 cursor-pointer hover:border-emerald-500 shadow-sm"
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  minWidth: "150px",
                }}
                onClick={() => openNodeConfig(node)}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1 rounded ${getNodeColor(node.type)} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium capitalize">{node.type}</span>
                </div>
                <p className="text-xs text-gray-600">{node.data.label}</p>

                {/* Connection points */}
                <div
                  className={`absolute -right-2 top-1/2 w-4 h-4 ${
                    isCreatingEdge && edgeStart === node.id ? "bg-blue-500" : "bg-emerald-500"
                  } rounded-full border-2 border-white transform -translate-y-1/2 cursor-pointer z-10`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleConnectionPointClick(node.id, true)
                  }}
                ></div>
                {node.id !== "start" && (
                  <div
                    className={`absolute -left-2 top-1/2 w-4 h-4 ${
                      isCreatingEdge && edgeStart !== node.id ? "bg-blue-500" : "bg-gray-400"
                    } rounded-full border-2 border-white transform -translate-y-1/2 cursor-pointer z-10`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleConnectionPointClick(node.id, false)
                    }}
                  ></div>
                )}
              </div>
            )
          })}

          {/* Instruções */}
          {nodes.length === 1 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Construa seu fluxo</h3>
                <p className="text-sm">Arraste componentes da barra lateral para criar seu fluxo de automação</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog de configuração */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar {selectedNode?.type}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedNode?.type === "trigger" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Gatilho</label>
                  <Select defaultValue="keyword">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keyword">Palavra-chave</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="schedule">Agendamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Palavra-chave</label>
                  <Input
                    placeholder="Ex: oi, olá, menu"
                    defaultValue={selectedNode?.data.config.keyword}
                    onChange={(e) => {
                      if (selectedNode) {
                        const newConfig = { ...selectedNode.data.config, keyword: e.target.value }
                        setSelectedNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, config: newConfig },
                        })
                      }
                    }}
                  />
                </div>
              </>
            )}

            {selectedNode?.type === "action" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Ação</label>
                  <Select defaultValue="message">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="message">Enviar Mensagem</SelectItem>
                      <SelectItem value="tag">Adicionar Tag</SelectItem>
                      <SelectItem value="webhook">Chamar Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mensagem</label>
                  <Textarea
                    placeholder="Digite a mensagem..."
                    rows={3}
                    defaultValue={selectedNode?.data.config.message}
                    onChange={(e) => {
                      if (selectedNode) {
                        const newConfig = { ...selectedNode.data.config, message: e.target.value }
                        setSelectedNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, config: newConfig },
                        })
                      }
                    }}
                  />
                </div>
              </>
            )}

            {selectedNode?.type === "condition" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Campo</label>
                  <Select
                    defaultValue={selectedNode?.data.config.field || "message"}
                    onValueChange={(value) => {
                      if (selectedNode) {
                        const newConfig = { ...selectedNode.data.config, field: value }
                        setSelectedNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, config: newConfig },
                        })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um campo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="message">Mensagem</SelectItem>
                      <SelectItem value="tag">Tag</SelectItem>
                      <SelectItem value="custom">Campo personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Operador</label>
                  <Select
                    defaultValue={selectedNode?.data.config.operator || "contains"}
                    onValueChange={(value) => {
                      if (selectedNode) {
                        const newConfig = { ...selectedNode.data.config, operator: value }
                        setSelectedNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, config: newConfig },
                        })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um operador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Contém</SelectItem>
                      <SelectItem value="equals">Igual a</SelectItem>
                      <SelectItem value="not_equals">Diferente de</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Valor</label>
                  <Input
                    placeholder="Valor para comparação"
                    defaultValue={selectedNode?.data.config.value}
                    onChange={(e) => {
                      if (selectedNode) {
                        const newConfig = { ...selectedNode.data.config, value: e.target.value }
                        setSelectedNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, config: newConfig },
                        })
                      }
                    }}
                  />
                </div>
              </>
            )}

            {selectedNode?.type === "ai" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Agente IA</label>
                  <Select
                    defaultValue={selectedNode?.data.config.agent}
                    onValueChange={(value) => {
                      if (selectedNode) {
                        const newConfig = { ...selectedNode.data.config, agent: value }
                        setSelectedNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, config: newConfig },
                        })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um agente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent1">Agente IGÃO</SelectItem>
                      <SelectItem value="agent2">Agente CF - Esquadrias</SelectItem>
                      <SelectItem value="agent3">Agente Suporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contexto Adicional</label>
                  <Textarea
                    placeholder="Contexto específico para esta interação..."
                    rows={3}
                    defaultValue={selectedNode?.data.config.context}
                    onChange={(e) => {
                      if (selectedNode) {
                        const newConfig = { ...selectedNode.data.config, context: e.target.value }
                        setSelectedNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, config: newConfig },
                        })
                      }
                    }}
                  />
                </div>
              </>
            )}

            {selectedNode?.type === "delay" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Tempo de Espera</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="5"
                      defaultValue={selectedNode?.data.config.time}
                      onChange={(e) => {
                        if (selectedNode) {
                          const newConfig = { ...selectedNode.data.config, time: e.target.value }
                          setSelectedNode({
                            ...selectedNode,
                            data: { ...selectedNode.data, config: newConfig },
                          })
                        }
                      }}
                    />
                    <Select
                      defaultValue={selectedNode?.data.config.unit || "minutes"}
                      onValueChange={(value) => {
                        if (selectedNode) {
                          const newConfig = { ...selectedNode.data.config, unit: value }
                          setSelectedNode({
                            ...selectedNode,
                            data: { ...selectedNode.data, config: newConfig },
                          })
                        }
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seconds">Segundos</SelectItem>
                        <SelectItem value="minutes">Minutos</SelectItem>
                        <SelectItem value="hours">Horas</SelectItem>
                        <SelectItem value="days">Dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (selectedNode) {
                  updateNodeConfig(selectedNode.data.config)
                }
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
