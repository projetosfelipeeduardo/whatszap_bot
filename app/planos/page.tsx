"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

// Interface para os planos
interface Plan {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  interval: string
  features: string[]
  stripe_price_id: string | null
  is_active: boolean
}

export default function PlanosPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)

  const supabase = createClient()

  // Carrega os planos disponíveis
  useEffect(() => {
    async function loadPlans() {
      try {
        // Obtém os planos ativos
        const { data: plansData, error: plansError } = await supabase
          .from("plans")
          .select("*")
          .eq("is_active", true)
          .order("price", { ascending: true })

        if (plansError) {
          throw plansError
        }

        setPlans(plansData as Plan[])

        // Obtém o plano atual do usuário
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("plan_type")
            .eq("id", user.id)
            .single()

          if (userError) {
            throw userError
          }

          setCurrentPlan(userData.plan_type)
        }
      } catch (error) {
        console.error("Erro ao carregar planos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPlans()
  }, [])

  // Inicia o processo de checkout
  const handleSubscribe = async (plan: Plan) => {
    try {
      // Verifica se o usuário está autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login?redirectTo=/planos")
        return
      }

      // Verifica se o usuário já tem um customer_id no Stripe
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("stripe_customer_id")
        .eq("id", user.id)
        .single()

      if (userError) {
        throw userError
      }

      // Cria a sessão de checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: plan.stripe_price_id,
          customerId: userData.stripe_customer_id,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao criar sessão de checkout")
      }

      const { url } = await response.json()

      // Redireciona para a página de checkout do Stripe
      window.location.href = url
    } catch (error) {
      console.error("Erro ao iniciar checkout:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando planos...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Escolha o plano ideal para o seu negócio</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Todos os planos incluem acesso a todas as funcionalidades. Escolha o plano que melhor se adapta ao volume de
          mensagens do seu negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.slug === "pro" ? "border-primary shadow-lg" : ""}`}>
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">R$ {(plan.price / 100).toFixed(2)}</span>
                <span className="text-gray-500">/{plan.interval}</span>
              </div>
            </CardHeader>

            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {(plan.features as string[]).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={plan.slug === currentPlan ? "outline" : "default"}
                disabled={plan.slug === currentPlan}
                onClick={() => handleSubscribe(plan)}
              >
                {plan.slug === currentPlan ? "Plano atual" : "Assinar"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
