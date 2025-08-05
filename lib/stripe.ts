import Stripe from "stripe"

// Inicializa o cliente Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

// Cria um cliente Stripe
export async function createCustomer(email: string, name?: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    })

    return customer
  } catch (error) {
    console.error("Erro ao criar cliente Stripe:", error)
    throw error
  }
}

// Cria uma sessão de checkout
export async function createCheckoutSession(options: {
  customerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: options.customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: options.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
    })

    return session
  } catch (error) {
    console.error("Erro ao criar sessão de checkout:", error)
    throw error
  }
}

// Obtém detalhes de uma assinatura
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error("Erro ao obter assinatura:", error)
    throw error
  }
}

// Cancela uma assinatura
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error)
    throw error
  }
}
