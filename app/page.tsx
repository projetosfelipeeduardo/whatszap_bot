import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Users, MessageSquare, Bot, Zap } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Bem-vindo, Igor Ferreira da Silva</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total de Contatos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">1,248</div>
              <div className="p-2 bg-emerald-50 rounded-full">
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div className="text-xs text-emerald-500 flex items-center mt-2">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>12% a mais que o mês passado</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Conversas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">324</div>
              <div className="p-2 bg-blue-50 rounded-full">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="text-xs text-blue-500 flex items-center mt-2">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>8% a mais que ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Agentes IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">5</div>
              <div className="p-2 bg-purple-50 rounded-full">
                <Bot className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div className="text-xs text-purple-500 flex items-center mt-2">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>2 novos esta semana</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Automações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">12</div>
              <div className="p-2 bg-amber-50 rounded-full">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <div className="text-xs text-amber-500 flex items-center mt-2">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>3 ativas agora</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas interações com seus contatos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Cliente {i}</h4>
                      <span className="text-xs text-gray-500">há {i * 5} min</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Respondeu a uma mensagem do agente IA</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desempenho dos Agentes</CardTitle>
            <CardDescription>Métricas dos seus agentes de IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Agente IGÃO", "Agente CF - Esquadrias", "Agente Suporte"].map((agent, i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">{agent}</h4>
                      <p className="text-xs text-gray-500">{90 - i * 10}% de satisfação</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{150 - i * 30} conversas</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
