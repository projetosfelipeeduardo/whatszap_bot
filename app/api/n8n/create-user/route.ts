import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createN8nUser } from "@/lib/n8n"

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

    const { email, fullName } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Cria o usuário no n8n
    const { userId, apiKey } = await createN8nUser({
      email,
      fullName,
    })

    return NextResponse.json({ userId, apiKey })
  } catch (error) {
    console.error("Erro ao criar usuário n8n:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
