"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff, Check } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validatePassword = (password: string) => {
    const requirements = [
      { test: password.length >= 8, text: "Pelo menos 8 caracteres" },
      { test: /[A-Z]/.test(password), text: "Uma letra maiúscula" },
      { test: /[a-z]/.test(password), text: "Uma letra minúscula" },
      { test: /\d/.test(password), text: "Um número" },
    ]
    return requirements
  }

  const passwordRequirements = validatePassword(formData.password)
  const isPasswordValid = passwordRequirements.every((req) => req.test)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validações básicas
    if (!formData.fullName.trim()) {
      setError("Nome completo é obrigatório")
      setIsLoading(false)
      return
    }

    if (!isPasswordValid) {
      setError("A senha não atende aos requisitos mínimos")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Falha ao criar conta")
      }

      // Registro bem-sucedido, redirecionar
      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Falha ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Criar Conta</CardTitle>
          <CardDescription className="text-gray-600">
            Preencha os dados abaixo para criar sua conta gratuita
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Seu nome completo"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="transition-colors focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="transition-colors focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="pr-10 transition-colors focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Requisitos da senha */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center text-xs ${req.test ? "text-green-600" : "text-gray-500"}`}
                    >
                      <Check className={`h-3 w-3 mr-1 ${req.test ? "text-green-600" : "text-gray-300"}`} />
                      {req.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="pr-10 transition-colors focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-600">As senhas não coincidem</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              disabled={isLoading || !isPasswordValid || formData.password !== formData.confirmPassword}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Criando conta...
                </div>
              ) : (
                "Criar Conta Gratuita"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                Faça login
              </Link>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Ao criar uma conta, você concorda com nossos{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
