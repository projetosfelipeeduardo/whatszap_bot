"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  fullName: string
  planType: string
  avatarUrl?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })
  const router = useRouter()

  // Verificar se o usuário está autenticado
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }, [])

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        })
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Erro de conexão" }
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      router.push("/login")
    }
  }, [router])

  // Registrar
  const register = useCallback(async (email: string, password: string, fullName: string, confirmPassword: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, fullName, confirmPassword }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        })
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Register error:", error)
      return { success: false, error: "Erro de conexão" }
    }
  }, [])

  // Atualizar perfil
  const updateProfile = useCallback(
    async (data: {
      fullName?: string
      avatarUrl?: string
      phone?: string
    }) => {
      try {
        const response = await fetch("/api/auth/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        })

        const result = await response.json()

        if (response.ok) {
          setAuthState((prev) => ({
            ...prev,
            user: result.user,
          }))
          return { success: true, user: result.user }
        } else {
          return { success: false, error: result.error }
        }
      } catch (error) {
        console.error("Update profile error:", error)
        return { success: false, error: "Erro de conexão" }
      }
    },
    [],
  )

  // Verificar autenticação na inicialização
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    ...authState,
    login,
    logout,
    register,
    updateProfile,
    checkAuth,
  }
}

// Hook para proteger rotas
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}
