import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

// Inicializa o cliente Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

// Webhook secret para verificar assinatura
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature") || ""

    // Verifica a assinatura do webhook
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Processa o evento
    const supabase = createClient()

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Atualiza o status da assinatura no banco de dados
        const { data: users, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .limit(1)

        if (userError || !users || users.length === 0) {
          console.error("Usuário não encontrado:", userError || "Nenhum usuário com este customer_id")
          break
        }

        const userId = users[0].id

        // Determina o plano com base no preço da assinatura
        const priceId = subscription.items.data[0].price.id
        const { data: plans, error: planError } = await supabase
          .from("plans")
          .select("plan_type")
          .eq("stripe_price_id", priceId)
          .limit(1)

        if (planError || !plans || plans.length === 0) {
          console.error("Plano não encontrado:", planError || "Nenhum plano com este price_id")
          break
        }

        const planType = plans[0].plan_type

        // Atualiza o usuário com os dados da assinatura
        const { error: updateError } = await supabase
          .from("users")
          .update({
            subscription_id: subscription.id,
            plan_type: planType,
            plan_status: subscription.status === "active" ? "active" : "inactive",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (updateError) {
          console.error("Erro ao atualizar usuário:", updateError)
        }

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Atualiza o status da assinatura no banco de dados
        const { data: users, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .limit(1)

        if (userError || !users || users.length === 0) {
          console.error("Usuário não encontrado:", userError || "Nenhum usuário com este customer_id")
          break
        }

        const userId = users[0].id

        // Atualiza o usuário para o plano gratuito
        const { error: updateError } = await supabase
          .from("users")
          .update({
            plan_type: "free",
            plan_status: "inactive",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (updateError) {
          console.error("Erro ao atualizar usuário:", updateError)
        }

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Erro ao processar webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
