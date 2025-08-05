import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Get basic metrics
    const [{ count: totalUsers }, { count: activeConnections }, { count: totalAutomations }, { count: totalMessages }] =
      await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("whatsapp_connections").select("*", { count: "exact", head: true }).eq("status", "connected"),
        supabase.from("automations").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("messages").select("*", { count: "exact", head: true }),
      ])

    // Get plan distribution
    const { data: planDistribution } = await supabase.from("users").select("plan_type").neq("plan_type", null)

    const planCounts =
      planDistribution?.reduce((acc: any, user) => {
        acc[user.plan_type] = (acc[user.plan_type] || 0) + 1
        return acc
      }, {}) || {}

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      metrics: {
        total_users: totalUsers || 0,
        active_connections: activeConnections || 0,
        total_automations: totalAutomations || 0,
        total_messages: totalMessages || 0,
        plan_distribution: planCounts,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
