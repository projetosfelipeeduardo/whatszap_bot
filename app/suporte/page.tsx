import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Mail, FileText } from "lucide-react"

export default function SuportePage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Central de Suporte</h1>
          <p className="text-gray-600">Como podemos ajudá-lo hoje?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-emerald-500" />
              <h3 className="font-medium mb-2">Chat ao Vivo</h3>
              <p className="text-sm text-gray-600 mb-4">Fale conosco em tempo real</p>
              <Button variant="outline" className="w-full">
                Iniciar Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-emerald-500" />
              <h3 className="font-medium mb-2">Email</h3>
              <p className="text-sm text-gray-600 mb-4">Envie sua dúvida por email</p>
              <Button variant="outline" className="w-full">
                Enviar Email
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-emerald-500" />
              <h3 className="font-medium mb-2">Documentação</h3>
              <p className="text-sm text-gray-600 mb-4">Acesse nossa base de conhecimento</p>
              <Button variant="outline" className="w-full">
                Ver Docs
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Abrir Ticket de Suporte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <Input placeholder="Seu nome completo" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" placeholder="seu@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Assunto</label>
              <Input placeholder="Descreva brevemente o problema" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <Textarea placeholder="Descreva detalhadamente o problema ou dúvida..." rows={5} />
            </div>
            <Button className="w-full">Enviar Ticket</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
