"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Smartphone } from "lucide-react"
import Link from "next/link"

export default function NovoAgentePersonalizadoPage() {
  const [isActive, setIsActive] = useState(true)

  // Lista de números WhatsApp disponíveis
  const whatsappNumbers = [
    { id: "1", number: "+55 11 99999-9999", name: "Atendimento Principal" },
    { id: "2", number: "+55 11 88888-8888", name: "Vendas" },
    { id: "3", number: "+55 11 77777-7777", name: "Suporte" },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/atendimento/novo">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Criar Novo Agente</h1>
        </div>
        <Button>Salvar</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Status do Agente</h3>
            <p className="text-sm text-gray-500">Ativar ou desativar este agente</p>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Nome do agente*</label>
          <Input placeholder="Ex: Agente de Vendas" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">WhatsApp*</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um número de WhatsApp" />
            </SelectTrigger>
            <SelectContent>
              {whatsappNumbers.map((whatsapp) => (
                <SelectItem key={whatsapp.id} value={whatsapp.id}>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-blue-500" />
                    <span>
                      {whatsapp.number} ({whatsapp.name})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">Selecione qual número de WhatsApp este agente irá utilizar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nome da empresa*</label>
            <Input placeholder="Ex: Escova e Aspirador" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tipo do seu negócio*</label>
            <Input placeholder="Ex: Beleza e qualidade" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Linguagem*</label>
            <Select defaultValue="informal">
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma linguagem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informal">Informal</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Endereço*</label>
          <Input placeholder="Ex: Em todo o Brasil" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Horários de funcionamento*</label>
          <Input placeholder="Ex: Todos os dias 24horas" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Informações que preciso (serão salvas como variáveis)
          </label>
          <Textarea
            placeholder="Pergunte o nome do cliente, a cidade dele, para confirmarmos se tem pagamento na entrega, caso o cliente more em alguma dessas cidades:"
            className="min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Informações importantes sobre seu negócio e produtos*
          </label>
          <Textarea
            placeholder="- 'Sabe aquela sensação de sair do salão se sentindo linda? Você vai ter isso TODO DIA.'
- 'Essa escova virou rotina pra mais de 35 mil mulheres no Brasil. Elas não largam mais.'
- 'Se você não amar, devolve. Sem frescura. 7 dias de garantia.'
- 'As unidades com pagamento na entrega estão ACABANDO na sua região. Posso garantir agora?'"
            className="min-h-[200px]"
          />
          <p className="text-xs text-gray-500 mt-2">
            Explique tudo sobre seu negócio e sobre produtos e serviços que você vende. Quanto mais você explicar, mais
            o agente vai saber ajudar seus clientes.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Comandos e instruções adicionais</label>
          <Textarea
            placeholder="Exemplo: COMANDO DIRETO PRA CONFIGURAR SUA IA HOJE: Primeira mensagem tem que ser uma MORDIDA, não um 'oi'. Algo que diga 'chegou a solução que você procurava sem saber'."
            className="min-h-[100px]"
          />
          <p className="text-xs text-gray-500 mt-2">
            Adicione comandos específicos ou instruções para o comportamento do seu agente.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Estratégias de venda e objeções</label>
          <Textarea
            placeholder="Exemplo: Quebre 2 objeções antes mesmo de perguntarem. Corte os medos pela raiz."
            className="min-h-[100px]"
          />
          <p className="text-xs text-gray-500 mt-2">
            Adicione estratégias para lidar com objeções e aumentar as conversões.
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
          <Button variant="outline">Cancelar</Button>
          <Button>Salvar</Button>
        </div>
      </div>
    </div>
  )
}
