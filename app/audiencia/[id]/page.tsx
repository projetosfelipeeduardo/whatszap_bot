import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, MessageSquare, Tag, Clock, Calendar } from "lucide-react"
import Link from "next/link"

export default function ContactProfilePage({ params }: { params: { id: string } }) {
  // Dados de exemplo para o perfil
  const contact = {
    id: params.id,
    name: "Atenor",
    whatsapp: "+55 (91) 84600-4661",
    email: "Não informado",
    date: "15/05/2025 11:26",
    tags: ["VIP", "Cliente"],
    interactions: [
      { id: 1, type: "message", content: "Olá, gostaria de saber mais sobre o produto X", date: "15/05/2025 11:26" },
      { id: 2, type: "message", content: "Qual o prazo de entrega?", date: "15/05/2025 11:28" },
      { id: 3, type: "tag", content: "Tag 'Interessado' adicionada", date: "15/05/2025 11:30" },
      { id: 4, type: "message", content: "Obrigado pelas informações!", date: "15/05/2025 11:35" },
      { id: 5, type: "tag", content: "Tag 'Cliente' adicionada", date: "16/05/2025 09:15" },
    ],
    notes: [
      { id: 1, content: "Cliente interessado em produtos premium", date: "15/05/2025 12:00" },
      { id: 2, content: "Prefere contato no período da tarde", date: "16/05/2025 09:20" },
    ],
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/audiencia">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Perfil do Contato</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-lg font-medium text-emerald-600">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-medium">{contact.name}</h2>
                  <p className="text-sm text-gray-500">{contact.whatsapp}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                <p className="text-sm">{contact.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Data de inscrição</h3>
                <p className="text-sm">{contact.date}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                  <Button variant="ghost" size="sm" className="h-6 p-0 text-xs">
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Notas</h3>
              <div className="space-y-3">
                {contact.notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 p-3 rounded-md text-sm">
                    <p>{note.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{note.date}</p>
                  </div>
                ))}
                <div className="mt-2">
                  <Input placeholder="Adicionar nota..." />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Tabs defaultValue="historico">
              <TabsList className="mb-4">
                <TabsTrigger value="historico">Histórico</TabsTrigger>
                <TabsTrigger value="conversas">Conversas</TabsTrigger>
                <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
              </TabsList>

              <TabsContent value="historico" className="space-y-4">
                <div className="border-l-2 border-gray-200 pl-4 space-y-6 ml-2">
                  {contact.interactions.map((interaction) => (
                    <div key={interaction.id} className="relative">
                      <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-white border-2 border-emerald-500"></div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-gray-100">
                          {interaction.type === "message" ? (
                            <MessageSquare className="h-4 w-4 text-gray-600" />
                          ) : interaction.type === "tag" ? (
                            <Tag className="h-4 w-4 text-gray-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm">{interaction.content}</p>
                          <p className="text-xs text-gray-500 mt-1">{interaction.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="conversas">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma conversa recente</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Inicie uma conversa com este contato para ver o histórico aqui.
                  </p>
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Iniciar conversa
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="campanhas">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma campanha enviada</h3>
                  <p className="text-sm text-gray-500 mb-4">Este contato ainda não recebeu nenhuma campanha.</p>
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Criar campanha
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
