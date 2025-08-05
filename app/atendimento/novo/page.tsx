import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NovoAgentePage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/atendimento">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Criar Novo Agente</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/atendimento/novo/personalizado" className="block">
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-emerald-500"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <path d="M13 8h2" />
                    <path d="M13 12h2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Atendimento ao Cliente</h3>
                <p className="text-sm text-gray-500 text-center">
                  Crie um agente especializado em atendimento e suporte ao cliente
                </p>
              </div>
            </Link>

            <Link href="/atendimento/novo/personalizado" className="block">
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-emerald-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Vendas</h3>
                <p className="text-sm text-gray-500 text-center">
                  Crie um agente especializado em vendas e conversão de leads
                </p>
              </div>
            </Link>

            <Link href="/atendimento/novo/personalizado" className="block">
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-emerald-500"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Personalizado</h3>
                <p className="text-sm text-gray-500 text-center">
                  Crie um agente personalizado para suas necessidades específicas
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            Selecione um tipo de agente para começar a configuração
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
