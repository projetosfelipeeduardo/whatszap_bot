import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Frontzap - Automação WhatsApp com IA",
  description: "Plataforma completa de automação para WhatsApp com inteligência artificial",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {({ user, isLoading }) => {
        // Páginas que não precisam de sidebar
        const publicPages = ["/login", "/register", "/forgot-password", "/reset-password"]
        const isPublicPage = typeof window !== "undefined" && publicPages.includes(window.location.pathname)

        // Se está carregando, mostrar loading
        if (isLoading) {
          return (
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )
        }

        // Se não está logado e não é página pública, mostrar apenas o conteúdo (será redirecionado)
        if (!user && !isPublicPage) {
          return <div className="min-h-screen">{children}</div>
        }

        // Se é página pública, mostrar sem sidebar
        if (isPublicPage) {
          return <div className="min-h-screen">{children}</div>
        }

        // Se está logado, mostrar com sidebar
        if (user) {
          return (
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          )
        }

        // Fallback
        return <div className="min-h-screen">{children}</div>
      }}
    </AuthProvider>
  )
}
