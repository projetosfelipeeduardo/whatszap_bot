export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan_type: string
          plan_status: string
          stripe_customer_id: string | null
          subscription_id: string | null
          n8n_user_id: string | null
          n8n_api_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan_type?: string
          plan_status?: string
          stripe_customer_id?: string | null
          subscription_id?: string | null
          n8n_user_id?: string | null
          n8n_api_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan_type?: string
          plan_status?: string
          stripe_customer_id?: string | null
          subscription_id?: string | null
          n8n_user_id?: string | null
          n8n_api_key?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          interval: string
          features: Json
          stripe_price_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          interval?: string
          features?: Json
          stripe_price_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          interval?: string
          features?: Json
          stripe_price_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      whatsapp_connections: {
        Row: {
          id: string
          user_id: string
          name: string
          phone_number: string | null
          status: string
          qr_code: string | null
          session_data: Json | null
          n8n_workflow_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone_number?: string | null
          status?: string
          qr_code?: string | null
          session_data?: Json | null
          n8n_workflow_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone_number?: string | null
          status?: string
          qr_code?: string | null
          session_data?: Json | null
          n8n_workflow_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Outras tabelas seguem o mesmo padrão
    }
  }
}
