import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Test basic database operations
    const tests = {
      database_connection: false,
      user_table_access: false,
      plans_table_access: false,
      whatsapp_connections_access: false,
    }

    // Test database connection
    const { data: connectionTest, error: connectionError } = await supabase.from("users").select("count").limit(1)

    if (!connectionError) {
      tests.database_connection = true
    }

    // Test users table
    const { data: usersTest, error: usersError } = await supabase.from("users").select("id").limit(1)

    if (!usersError) {
      tests.user_table_access = true
    }

    // Test plans table
    const { data: plansTest, error: plansError } = await supabase.from("plans").select("id").limit(1)

    if (!plansError) {
      tests.plans_table_access = true
    }

    // Test whatsapp_connections table
    const { data: whatsappTest, error: whatsappError } = await supabase
      .from("whatsapp_connections")
      .select("id")
      .limit(1)

    if (!whatsappError) {
      tests.whatsapp_connections_access = true
    }

    const allTestsPassed = Object.values(tests).every((test) => test === true)

    return NextResponse.json({
      success: allTestsPassed,
      tests,
      errors: {
        connection: connectionError?.message,
        users: usersError?.message,
        plans: plansError?.message,
        whatsapp: whatsappError?.message,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
