"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart2,
  Users,
  Bot,
  Send,
  Settings,
  Zap,
  Layers,
  MessageCircle,
  HelpCircle,
  Smartphone,
  Target,
  CreditCard,
  GitBranch,
} from "lucide-react"

const menuItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: BarChart2,
  },
  {
    name: "Bate Papo ao vivo",
    href: "/chat",
    icon: MessageCircle,
  },
  {
    name: "Kanban",
    href: "/kanban",
    icon: Layers,
  },
  {
    name: "Atendimento (IA)",
    href: "/atendimento",
    icon: Bot,
  },
  {
    name: "Fluxos de Conversa",
    href: "/fluxos",
    icon: GitBranch,
  },
  {
    name: "Transmissão",
    href: "/transmissao",
    icon: Send,
  },
  {
    name: "Audiência",
    href: "/audiencia",
    icon: Users,
  },
  {
    name: "Gerente de grupo",
    href: "/gerente-grupo",
    icon: Users,
  },
  {
    name: "WhatsApp",
    href: "/whatsapp",
    icon: Smartphone,
  },
  {
    name: "Campanhas",
    href: "/campanhas",
    icon: Target,
  },
  {
    name: "Automação",
    href: "/automacao",
    icon: Zap,
  },
  {
    name: "Planos",
    href: "/planos",
    icon: CreditCard,
  },
  {
    name: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-emerald-500">AgentFlow</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/suporte"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          <HelpCircle className="h-5 w-5" />
          Suporte
        </Link>
      </div>
    </div>
  )
}
