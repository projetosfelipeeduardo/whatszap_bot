import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createCustomer, createCheckoutSession } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    // Verifica se o usuário está autenticado
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { priceId, customerId } = await req.json()

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 })
    }

    // Obtém os dados do usuário
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email, full_name, stripe_customer_id")
      .eq("id", session.user.id)
      .single()

    if (userError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Cria ou obtém o cliente Stripe
    let stripeCustomerId = customerId || userData.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await createCustomer(userData.email, userData.full_name || undefined)

      stripeCustomerId = customer.id

      // Atualiza o ID do cliente Stripe no banco de dados
      await supabase.from("users").update({ stripe_customer_id: stripeCustomerId }).eq("id", session.user.id)
    }

    // Cria a sessão de checkout
    const checkoutSession = await createCheckoutSession({
      customerId: stripeCustomerId,
      priceId,
      successUrl: `${req.headers.get("origin")}/planos/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${req.headers.get("origin")}/planos`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Erro ao criar sessão de checkout:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
