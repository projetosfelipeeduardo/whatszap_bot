import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    // Test database connection
    const supabase = createClient()
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      throw error
    }

    // Test environment variables
    const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]

    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      environment: {
        missing_vars: missingEnvVars,
        node_env: process.env.NODE_ENV,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
