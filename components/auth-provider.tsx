"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"

interface User {
  id: string
  email: string
  name: string
  planType: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        setUser(null)
        // Se não está autenticado e não está em rota pública, redirecionar
        if (!isPublicRoute) {
          router.push("/login")
        }
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setUser(null)
      if (!isPublicRoute) {
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Erro ao fazer login")
    }

    setUser(data.user)
    router.push("/dashboard")
  }

  const register = async (email: string, password: string, fullName: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
        fullName,
        confirmPassword: password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Erro ao criar conta")
    }

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
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      router.push("/login")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Se usuário está autenticado e não está em rota pública, mostrar layout com sidebar
  if (user && !isPublicRoute) {
    return (
      <AuthContext.Provider value={{ user, loading, login, logout, register }}>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </AuthContext.Provider>
    )
  }

  // Se não está autenticado ou está em rota pública, mostrar apenas o conteúdo
  return <AuthContext.Provider value={{ user, loading, login, logout, register }}>{children}</AuthContext.Provider>
}
