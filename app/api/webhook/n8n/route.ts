import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    // Verifica a chave de API para autenticação
    const apiKey = req.headers.get("x-api-key")
    if (apiKey !== process.env.N8N_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { event, data } = body

    const supabase = createClient()

    switch (event) {
      case "workflow.completed": {
        // Atualiza o status do workflow no banco de dados
        const { workflowId, userId, status, result } = data

        // Atualiza a conexão WhatsApp associada a este workflow
        const { error } = await supabase
          .from("whatsapp_connections")
          .update({
            status: status === "success" ? "connected" : "error",
            session_data: result,
            updated_at: new Date().toISOString(),
          })
          .eq("n8n_workflow_id", workflowId)
          .eq("user_id", userId)

        if (error) {
          console.error("Erro ao atualizar conexão WhatsApp:", error)
          return NextResponse.json({ error: "Database error" }, { status: 500 })
        }

        break
      }

      case "message.received": {
        // Processa mensagem recebida
        const { userId, phoneNumber, message, contact } = data

        // Verifica se o contato já existe
        const { data: existingContacts, error: contactError } = await supabase
          .from("contacts")
          .select("id")
          .eq("user_id", userId)
          .eq("phone_number", phoneNumber)
          .limit(1)

        if (contactError) {
          console.error("Erro ao verificar contato:", contactError)
          return NextResponse.json({ error: "Database error" }, { status: 500 })
        }

        // Se o contato não existir, cria um novo
        if (!existingContacts || existingContacts.length === 0) {
          const { error: insertError } = await supabase.from("contacts").insert({
            user_id: userId,
            phone_number: phoneNumber,
            full_name: contact?.name || "",
            last_interaction: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Erro ao criar contato:", insertError)
            return NextResponse.json({ error: "Database error" }, { status: 500 })
          }
        } else {
          // Atualiza a última interação do contato
          const { error: updateError } = await supabase
            .from("contacts")
            .update({
              last_interaction: new Date().toISOString(),
            })
            .eq("id", existingContacts[0].id)

          if (updateError) {
            console.error("Erro ao atualizar contato:", updateError)
            return NextResponse.json({ error: "Database error" }, { status: 500 })
          }
        }

        break
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar webhook n8n:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
