// Funções para integração com n8n

// URL base da sua instância n8n
const N8N_BASE_URL = process.env.N8N_BASE_URL || "https://sua-instancia-n8n.com"
// API Key para autenticação com n8n
const N8N_API_KEY = process.env.N8N_API_KEY || "seu-api-key"

// Interface para usuário n8n
interface N8nUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  password?: string
  role: "global:owner" | "global:member" | "global:user"
}

// Cria um usuário no n8n
export async function createN8nUser(userData: {
  email: string
  fullName?: string
  password?: string
}): Promise<{ userId: string; apiKey: string }> {
  try {
    // Divide o nome completo em primeiro e último nome
    let firstName = "",
      lastName = ""
    if (userData.fullName) {
      const nameParts = userData.fullName.split(" ")
      firstName = nameParts[0]
      lastName = nameParts.slice(1).join(" ")
    }

    // Cria o usuário no n8n
    const userResponse = await fetch(`${N8N_BASE_URL}/api/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-N8N-API-KEY": N8N_API_KEY,
      },
      body: JSON.stringify({
        email: userData.email,
        firstName,
        lastName,
        password: userData.password || generateRandomPassword(),
        role: "global:user",
      }),
    })

    if (!userResponse.ok) {
      throw new Error(`Falha ao criar usuário n8n: ${await userResponse.text()}`)
    }

    const user = (await userResponse.json()) as N8nUser

    // Gera uma API key para o usuário
    const apiKeyResponse = await fetch(`${N8N_BASE_URL}/api/v1/users/${user.id}/api-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-N8N-API-KEY": N8N_API_KEY,
      },
    })

    if (!apiKeyResponse.ok) {
      throw new Error(`Falha ao gerar API key: ${await apiKeyResponse.text()}`)
    }

    const { apiKey } = await apiKeyResponse.json()

    return {
      userId: user.id,
      apiKey,
    }
  } catch (error) {
    console.error("Erro ao criar usuário n8n:", error)
    throw error
  }
}

// Cria um workflow para o usuário no n8n
export async function createUserWorkflow(userId: string, apiKey: string, workflowData: any) {
  try {
    const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-N8N-API-KEY": apiKey,
      },
      body: JSON.stringify(workflowData),
    })

    if (!response.ok) {
      throw new Error(`Falha ao criar workflow: ${await response.text()}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao criar workflow:", error)
    throw error
  }
}

// Gera uma senha aleatória
function generateRandomPassword(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}
