import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createUserWorkflow } from "@/lib/n8n"

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

    const { connectionId } = await req.json()

    if (!connectionId) {
      return NextResponse.json({ error: "Connection ID is required" }, { status: 400 })
    }

    // Obtém os dados do usuário
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("n8n_user_id, n8n_api_key")
      .eq("id", session.user.id)
      .single()

    if (userError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verifica se o usuário já tem um usuário n8n
    let n8nUserId = userData.n8n_user_id
    let n8nApiKey = userData.n8n_api_key

    if (!n8nUserId || !n8nApiKey) {
      // Cria um usuário n8n para o usuário
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("email, full_name")
        .eq("id", session.user.id)
        .single()

      if (profileError) {
        return NextResponse.json({ error: "User profile not found" }, { status: 404 })
      }

      // Cria o usuário n8n via API
      const response = await fetch("/api/n8n/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userProfile.email,
          fullName: userProfile.full_name,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao criar usuário n8n")
      }

      const { userId, apiKey } = await response.json()

      n8nUserId = userId
      n8nApiKey = apiKey

      // Atualiza o usuário com os dados do n8n
      await supabase
        .from("users")
        .update({
          n8n_user_id: userId,
          n8n_api_key: apiKey,
        })
        .eq("id", session.user.id)
    }

    // Cria um workflow para a conexão WhatsApp
    const workflowData = {
      name: `WhatsApp Connection - ${connectionId}`,
      nodes: [
        // Nós do workflow para conexão WhatsApp
        // Este é um exemplo simplificado
        {
          parameters: {
            webhookId: connectionId,
            userId: session.user.id,
          },
          name: "WhatsApp Connection",
          type: "n8n-nodes-base.whatsappTrigger",
          typeVersion: 1,
          position: [250, 300],
        },
      ],
      connections: {},
      active: true,
      settings: {
        saveExecutionProgress: true,
        saveManualExecutions: true,
      },
    }

    const workflow = await createUserWorkflow(n8nUserId, n8nApiKey, workflowData)

    // Atualiza a conexão com o ID do workflow
    await supabase
      .from("whatsapp_connections")
      .update({
        n8n_workflow_id: workflow.id,
      })
      .eq("id", connectionId)

    // Gera um QR code (simulado neste exemplo)
    const qrCode =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCI+UVIgQ29kZTwvdGV4dD4KPC9zdmc+"

    return NextResponse.json({ qrCode })
  } catch (error) {
    console.error("Erro ao conectar WhatsApp:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
