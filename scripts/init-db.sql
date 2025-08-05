-- Frontzap Database Initialization Script
-- This script creates all necessary tables and initial data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create N8N schema
CREATE SCHEMA IF NOT EXISTS n8n;

-- =============================================
-- USERS AND AUTHENTICATION
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(20),
    
    -- Subscription info
    plan_type VARCHAR(50) DEFAULT 'free',
    stripe_customer_id VARCHAR(255),
    subscription_status VARCHAR(50) DEFAULT 'inactive',
    subscription_id VARCHAR(255),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    
    -- Account status
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- WHATSAPP CONNECTIONS
-- =============================================

-- WhatsApp connections
CREATE TABLE IF NOT EXISTS whatsapp_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    status VARCHAR(50) DEFAULT 'pending', -- pending, connected, disconnected, error
    qr_code TEXT,
    session_data JSONB,
    webhook_url TEXT,
    
    -- Statistics
    messages_sent INTEGER DEFAULT 0,
    messages_received INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CONTACTS AND AUDIENCE
-- =============================================

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    whatsapp_connection_id UUID REFERENCES whatsapp_connections(id) ON DELETE SET NULL,
    
    -- Contact info
    phone_number VARCHAR(20) NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    avatar_url TEXT,
    
    -- WhatsApp specific
    whatsapp_name VARCHAR(255),
    whatsapp_business_name VARCHAR(255),
    is_whatsapp_business BOOLEAN DEFAULT FALSE,
    
    -- Segmentation
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}',
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, blocked, unsubscribed
    last_interaction_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, phone_number)
);

-- Contact lists
CREATE TABLE IF NOT EXISTS contact_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    contact_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact list memberships
CREATE TABLE IF NOT EXISTS contact_list_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    list_id UUID NOT NULL REFERENCES contact_lists(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(contact_id, list_id)
);

-- =============================================
-- CONVERSATIONS AND MESSAGES
-- =============================================

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    whatsapp_connection_id UUID NOT NULL REFERENCES whatsapp_connections(id) ON DELETE CASCADE,
    
    -- Conversation info
    status VARCHAR(50) DEFAULT 'open', -- open, closed, archived
    assigned_to UUID REFERENCES users(id),
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    
    -- AI Agent
    ai_agent_id UUID,
    ai_enabled BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    whatsapp_message_id VARCHAR(255),
    
    -- Message content
    type VARCHAR(50) NOT NULL, -- text, image, audio, video, document, location, contact
    content TEXT,
    media_url TEXT,
    media_type VARCHAR(100),
    media_size INTEGER,
    
    -- Message info
    direction VARCHAR(20) NOT NULL, -- inbound, outbound
    status VARCHAR(50) DEFAULT 'sent', -- sent, delivered, read, failed
    is_from_ai BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AI AGENTS AND AUTOMATION
-- =============================================

-- AI Agents
CREATE TABLE IF NOT EXISTS ai_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Agent info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    
    -- AI Configuration
    model VARCHAR(100) DEFAULT 'gpt-3.5-turbo',
    system_prompt TEXT,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 1000,
    
    -- Behavior
    auto_respond BOOLEAN DEFAULT TRUE,
    response_delay INTEGER DEFAULT 0, -- seconds
    working_hours JSONB, -- {"start": "09:00", "end": "18:00", "timezone": "America/Sao_Paulo"}
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Statistics
    conversations_handled INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    satisfaction_score DECIMAL(3,2),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation workflows
CREATE TABLE IF NOT EXISTS automation_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Workflow info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- webhook, campaign, remarketing, chatbot
    
    -- Configuration
    trigger_config JSONB NOT NULL,
    action_config JSONB NOT NULL,
    conditions JSONB DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Statistics
    executions_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow executions log
CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES automation_workflows(id) ON DELETE CASCADE,
    
    -- Execution info
    status VARCHAR(50) NOT NULL, -- success, error, pending
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    execution_time INTEGER, -- milliseconds
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- CAMPAIGNS AND BROADCASTS
-- =============================================

-- Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Campaign info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'broadcast', -- broadcast, drip, triggered
    
    -- Content
    message_template JSONB NOT NULL,
    media_urls TEXT[] DEFAULT '{}',
    
    -- Targeting
    target_lists UUID[] DEFAULT '{}',
    target_tags TEXT[] DEFAULT '{}',
    target_conditions JSONB DEFAULT '{}',
    
    -- Scheduling
    scheduled_at TIMESTAMP WITH TIME ZONE,
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, sending, sent, paused, cancelled
    
    -- Statistics
    total_recipients INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    messages_delivered INTEGER DEFAULT 0,
    messages_read INTEGER DEFAULT 0,
    messages_failed INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE
);

-- Campaign recipients
CREATE TABLE IF NOT EXISTS campaign_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, read, failed
    error_message TEXT,
    
    -- Timestamps
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(campaign_id, contact_id)
);

-- =============================================
-- SUBSCRIPTION PLANS
-- =============================================

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Plan info
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    
    -- Pricing
    price INTEGER NOT NULL, -- in cents
    currency VARCHAR(3) DEFAULT 'BRL',
    interval VARCHAR(20) NOT NULL, -- month, year
    
    -- Limits
    max_contacts INTEGER,
    max_messages_per_month INTEGER,
    max_ai_agents INTEGER,
    max_whatsapp_connections INTEGER,
    max_campaigns_per_month INTEGER,
    
    -- Features
    features JSONB DEFAULT '[]',
    
    -- Stripe
    stripe_price_id VARCHAR(255),
    stripe_product_id VARCHAR(255),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ANALYTICS AND METRICS
-- =============================================

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Event info
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    
    -- Data
    properties JSONB DEFAULT '{}',
    
    -- Context
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily metrics
CREATE TABLE IF NOT EXISTS daily_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Message metrics
    messages_sent INTEGER DEFAULT 0,
    messages_received INTEGER DEFAULT 0,
    messages_delivered INTEGER DEFAULT 0,
    messages_read INTEGER DEFAULT 0,
    
    -- Conversation metrics
    conversations_started INTEGER DEFAULT 0,
    conversations_closed INTEGER DEFAULT 0,
    avg_response_time INTEGER, -- seconds
    
    -- AI metrics
    ai_responses INTEGER DEFAULT 0,
    ai_handovers INTEGER DEFAULT 0,
    
    -- Contact metrics
    new_contacts INTEGER DEFAULT 0,
    active_contacts INTEGER DEFAULT 0,
    
    -- Campaign metrics
    campaigns_sent INTEGER DEFAULT 0,
    campaign_recipients INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_plan_type ON users(plan_type);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- WhatsApp connections indexes
CREATE INDEX IF NOT EXISTS idx_whatsapp_connections_user_id ON whatsapp_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_connections_status ON whatsapp_connections(status);

-- Contacts indexes
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON contacts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_contact_id ON conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_direction ON messages(direction);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_whatsapp_id ON messages(whatsapp_message_id);

-- AI Agents indexes
CREATE INDEX IF NOT EXISTS idx_ai_agents_user_id ON ai_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_active ON ai_agents(is_active);

-- Campaigns indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled_at ON campaigns(scheduled_at);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- Daily metrics indexes
CREATE INDEX IF NOT EXISTS idx_daily_metrics_user_date ON daily_metrics(user_id, date DESC);

-- =============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_connections_updated_at BEFORE UPDATE ON whatsapp_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_agents_updated_at BEFORE UPDATE ON ai_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_workflows_updated_at BEFORE UPDATE ON automation_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_lists_updated_at BEFORE UPDATE ON contact_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_metrics_updated_at BEFORE UPDATE ON daily_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INITIAL DATA
-- =============================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, slug, description, price, interval, max_contacts, max_messages_per_month, max_ai_agents, max_whatsapp_connections, max_campaigns_per_month, features, is_active, is_popular) VALUES
('Gratuito', 'free', 'Plano gratuito para testar a plataforma', 0, 'month', 100, 1000, 1, 1, 5, '["Dashboard básico", "1 agente IA", "1 conexão WhatsApp", "Suporte por email"]', true, false),
('Starter', 'starter', 'Ideal para pequenos negócios', 4900, 'month', 1000, 10000, 3, 2, 20, '["Dashboard completo", "3 agentes IA", "2 conexões WhatsApp", "Automações básicas", "Suporte prioritário"]', true, false),
('Professional', 'professional', 'Para empresas em crescimento', 9900, 'month', 5000, 50000, 10, 5, 100, '["Dashboard avançado", "10 agentes IA", "5 conexões WhatsApp", "Automações avançadas", "Campanhas ilimitadas", "Suporte 24/7"]', true, true),
('Enterprise', 'enterprise', 'Para grandes empresas', 19900, 'month', -1, -1, -1, -1, -1, '["Recursos ilimitados", "Agentes IA personalizados", "Integrações customizadas", "Suporte dedicado", "SLA garantido"]', true, false)
ON CONFLICT (slug) DO NOTHING;

-- Create admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, plan_type, is_active, email_verified) VALUES
('admin@frontzap.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9S2', 'Administrador', 'enterprise', true, true)
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- FUNCTIONS AND PROCEDURES
-- =============================================

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_contacts', (SELECT COUNT(*) FROM contacts WHERE user_id = user_uuid),
        'active_conversations', (SELECT COUNT(*) FROM conversations WHERE user_id = user_uuid AND status = 'open'),
        'messages_today', (SELECT COUNT(*) FROM messages m JOIN conversations c ON m.conversation_id = c.id WHERE c.user_id = user_uuid AND m.created_at >= CURRENT_DATE),
        'ai_agents', (SELECT COUNT(*) FROM ai_agents WHERE user_id = user_uuid AND is_active = true),
        'whatsapp_connections', (SELECT COUNT(*) FROM whatsapp_connections WHERE user_id = user_uuid AND status = 'connected')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View for active conversations with contact info
CREATE OR REPLACE VIEW active_conversations_view AS
SELECT 
    c.id,
    c.user_id,
    c.status,
    c.priority,
    c.last_message_at,
    c.created_at,
    ct.name as contact_name,
    ct.phone_number,
    ct.avatar_url as contact_avatar,
    wc.name as whatsapp_connection_name,
    (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) as message_count,
    (SELECT content FROM messages m WHERE m.conversation_id = c.id ORDER BY sent_at DESC LIMIT 1) as last_message
FROM conversations c
JOIN contacts ct ON c.contact_id = ct.id
JOIN whatsapp_connections wc ON c.whatsapp_connection_id = wc.id
WHERE c.status = 'open';

-- View for user dashboard metrics
CREATE OR REPLACE VIEW user_dashboard_metrics AS
SELECT 
    u.id as user_id,
    u.full_name,
    u.plan_type,
    (SELECT COUNT(*) FROM contacts WHERE user_id = u.id) as total_contacts,
    (SELECT COUNT(*) FROM conversations WHERE user_id = u.id AND status = 'open') as active_conversations,
    (SELECT COUNT(*) FROM ai_agents WHERE user_id = u.id AND is_active = true) as active_ai_agents,
    (SELECT COUNT(*) FROM whatsapp_connections WHERE user_id = u.id AND status = 'connected') as connected_whatsapp,
    (SELECT COUNT(*) FROM campaigns WHERE user_id = u.id AND status = 'sent' AND created_at >= CURRENT_DATE - INTERVAL '30 days') as campaigns_last_month
FROM users u
WHERE u.is_active = true;

COMMIT;
