-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'starter', 'pro', 'enterprise')),
  plan_status TEXT DEFAULT 'active' CHECK (plan_status IN ('active', 'inactive', 'cancelled')),
  stripe_customer_id TEXT UNIQUE,
  subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in cents
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
  features JSONB DEFAULT '[]',
  stripe_price_id TEXT UNIQUE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'starter', 'pro', 'enterprise')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp connections table
CREATE TABLE IF NOT EXISTS public.whatsapp_connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'connected', 'disconnected', 'error')),
  qr_code TEXT,
  session_data JSONB,
  webhook_url TEXT,
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automations table
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('webhook', 'keyword', 'schedule', 'remarketing')),
  trigger_config JSONB DEFAULT '{}',
  actions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  stats JSONB DEFAULT '{"executions": 0, "success": 0, "errors": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  phone_number TEXT NOT NULL,
  name TEXT,
  email TEXT,
  tags JSONB DEFAULT '[]',
  custom_fields JSONB DEFAULT '{}',
  last_interaction TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, phone_number)
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  whatsapp_connection_id UUID REFERENCES public.whatsapp_connections(id) ON DELETE CASCADE,
  message_id TEXT, -- WhatsApp message ID
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'audio', 'video', 'document', 'location')),
  content TEXT,
  media_url TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation logs table
CREATE TABLE IF NOT EXISTS public.automation_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending')),
  trigger_data JSONB DEFAULT '{}',
  execution_data JSONB DEFAULT '{}',
  error_message TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON public.users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_connections_user ON public.whatsapp_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_connections_status ON public.whatsapp_connections(status);
CREATE INDEX IF NOT EXISTS idx_automations_user ON public.automations(user_id);
CREATE INDEX IF NOT EXISTS idx_automations_active ON public.automations(is_active);
CREATE INDEX IF NOT EXISTS idx_contacts_user ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON public.contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_messages_user ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_contact ON public.messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_automation_logs_automation ON public.automation_logs(automation_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Plans are viewable by everyone (for pricing page)
CREATE POLICY "Plans are viewable by everyone" ON public.plans
  FOR SELECT USING (true);

-- WhatsApp connections
CREATE POLICY "Users can manage own connections" ON public.whatsapp_connections
  FOR ALL USING (auth.uid() = user_id);

-- Automations
CREATE POLICY "Users can manage own automations" ON public.automations
  FOR ALL USING (auth.uid() = user_id);

-- Contacts
CREATE POLICY "Users can manage own contacts" ON public.contacts
  FOR ALL USING (auth.uid() = user_id);

-- Messages
CREATE POLICY "Users can manage own messages" ON public.messages
  FOR ALL USING (auth.uid() = user_id);

-- Automation logs
CREATE POLICY "Users can view own automation logs" ON public.automation_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.automations 
      WHERE automations.id = automation_logs.automation_id 
      AND automations.user_id = auth.uid()
    )
  );
