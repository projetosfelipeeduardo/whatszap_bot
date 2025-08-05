"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, TrendingUp, Zap, Phone, Bot, BarChart3, Clock } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalMessages: number
  activeConnections: number
  totalContacts: number
  automationsActive: number
  messagesThisMonth: number
  responseTime: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    activeConnections: 0,
    totalContacts: 0,
    automationsActive: 0,
    messagesThisMonth: 0,
    responseTime: "0s",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Get current user
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()
        if (!currentUser) return

        setUser(currentUser)

        // Load user profile
        const { data: profile } = await supabase.from("users").select("*").eq("id", currentUser.id).single()

        // Load WhatsApp connections
        const { data: connections } = await supabase.from("whatsapp_connections").select("*").eq("status", "connected")

        // Load automations
        const { data: automations } = await supabase.from("automations").select("*").eq("is_active", true)

        // Mock stats for now - in production these would come from actual data
        setStats({
          totalMessages: 1247,
          activeConnections: connections?.length || 0,
          totalContacts: 856,
          automationsActive: automations?.length || 0,
          messagesThisMonth: 342,
          responseTime: "2.3s",
        })
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo de volta! Aqui está um resumo da sua atividade.</p>
        </div>
        <Badge variant="outline" className="text-emerald-600 border-emerald-600">
          {user?.plan_type || "free"} Plan
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Totais</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{stats.messagesThisMonth} este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conexões Ativas</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConnections}</div>
            <p className="text-xs text-muted-foreground">WhatsApp conectado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total de contatos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automações</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.automationsActive}</div>
            <p className="text-xs text-muted-foreground">Ativas no momento</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/whatsapp">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Phone className="h-4 w-4 mr-2" />
                  Conectar WhatsApp
                </Button>
              </Link>
              <Link href="/automacao/novo/webhook">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Zap className="h-4 w-4 mr-2" />
                  Nova Automação
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </Link>
              <Link href="/audiencia">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Audiência
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas de Performance</CardTitle>
            <CardDescription>Acompanhe o desempenho do seu atendimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Tempo de Resposta Médio</span>
              </div>
              <Badge variant="secondary">{stats.responseTime}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Taxa de Conversão</span>
              </div>
              <Badge variant="secondary">12.5%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Satisfação do Cliente</span>
              </div>
              <Badge variant="secondary">4.8/5</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Últimas ações realizadas na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nova conexão WhatsApp estabelecida</p>
                <p className="text-xs text-muted-foreground">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Automação "Boas-vindas" ativada</p>
                <p className="text-xs text-muted-foreground">Há 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">25 novos contatos adicionados</p>
                <p className="text-xs text-muted-foreground">Ontem</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
