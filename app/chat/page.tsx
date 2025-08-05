"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Paperclip, Smile, MoreVertical } from "lucide-react"

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1)
  const [message, setMessage] = useState("")

  const chats = [
    {
      id: 1,
      name: "João Silva",
      lastMessage: "Obrigado pelo atendimento!",
      time: "14:32",
      unread: 0,
      status: "online",
      avatar: "JS",
    },
    {
      id: 2,
      name: "Maria Santos",
      lastMessage: "Quando vocês fazem entrega?",
      time: "14:15",
      unread: 2,
      status: "offline",
      avatar: "MS",
    },
    {
      id: 3,
      name: "Pedro Costa",
      lastMessage: "Gostaria de saber mais sobre...",
      time: "13:45",
      unread: 1,
      status: "online",
      avatar: "PC",
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "customer",
      content: "Olá, gostaria de saber mais sobre seus produtos",
      time: "14:20",
    },
    {
      id: 2,
      sender: "agent",
      content: "Olá! Claro, ficarei feliz em ajudar. Que tipo de produto você está procurando?",
      time: "14:21",
    },
    {
      id: 3,
      sender: "customer",
      content: "Estou interessado nas escovas de cabelo",
      time: "14:25",
    },
    {
      id: 4,
      sender: "agent",
      content: "Perfeito! Temos várias opções de escovas. Você prefere escova alisadora ou modeladora?",
      time: "14:26",
    },
    {
      id: 5,
      sender: "customer",
      content: "Alisadora, por favor",
      time: "14:30",
    },
    {
      id: 6,
      sender: "agent",
      content:
        "Ótima escolha! Nossa escova alisadora é perfeita para deixar o cabelo liso e sedoso. Ela tem tecnologia de íons negativos e aquecimento rápido. O valor é R$ 149,90 com frete grátis para sua região.",
      time: "14:31",
    },
    {
      id: 7,
      sender: "customer",
      content: "Obrigado pelo atendimento!",
      time: "14:32",
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Bate Papo ao Vivo</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline">3 conversas ativas</Badge>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
        {/* Lista de conversas */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar conversas..." className="pl-10" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedChat === chat.id ? "bg-emerald-50 border-emerald-200" : ""
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-600">
                      {chat.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        chat.status === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && <Badge className="bg-emerald-500 text-white text-xs">{chat.unread}</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de conversa */}
        <div className="col-span-8 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {selectedChat ? (
            <>
              {/* Header da conversa */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-600">
                    JS
                  </div>
                  <div>
                    <h3 className="font-medium">João Silva</h3>
                    <p className="text-sm text-green-500">Online</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === "agent" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender === "agent" ? "text-emerald-100" : "text-gray-500"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input de mensagem */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        // Enviar mensagem
                        setMessage("")
                      }
                    }}
                  />
                  <Button>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
                <p className="text-sm">Escolha uma conversa da lista para começar a responder</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
