"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  planType: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode | ((props: { user: User | null; isLoading: boolean }) => React.ReactNode)
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Páginas públicas que não precisam de autenticação
  const publicPages = ["/login", "/register", "/forgot-password", "/reset-password"]
  const isPublicPage = publicPages.includes(pathname)

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
        // Se não está em página pública, redirecionar para login
        if (!isPublicPage) {
          router.push("/login")
        }
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
      setUser(null)
      if (!isPublicPage) {
        router.push("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "Erro ao fazer login")
    }

    const data = await response.json()
    setUser(data.user)
    router.push("/dashboard")
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setUser(null)
      router.push("/login")
    }
  }

  useEffect(() => {
    refreshUser()
  }, [pathname])

  const contextValue = {
    user,
    isLoading,
    login,
    logout,
    refreshUser,
  }

  // Se children é uma função, chama com os props
  if (typeof children === "function") {
    return <AuthContext.Provider value={contextValue}>{children({ user, isLoading })}</AuthContext.Provider>
  }

  // Caso contrário, renderiza normalmente
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
