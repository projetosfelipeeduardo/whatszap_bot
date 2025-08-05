import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// Cria um cliente Supabase para uso no lado do servidor
export const createClient = () => {
  return createServerComponentClient<Database>({ cookies })
}
