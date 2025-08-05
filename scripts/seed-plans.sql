-- Insert default plans
INSERT INTO public.plans (name, slug, description, price, interval, features, stripe_price_id, plan_type, is_active) VALUES
(
  'Gratuito',
  'free',
  'Ideal para começar e testar a plataforma',
  0,
  'month',
  '["1 conexão WhatsApp", "100 mensagens/mês", "Automações básicas", "Suporte por email"]',
  null,
  'free',
  true
),
(
  'Starter',
  'starter',
  'Perfeito para pequenos negócios',
  2900,
  'month',
  '["3 conexões WhatsApp", "1.000 mensagens/mês", "Automações avançadas", "Chatbot com IA", "Relatórios básicos", "Suporte prioritário"]',
  'price_starter_monthly',
  'starter',
  true
),
(
  'Pro',
  'pro',
  'Para empresas em crescimento',
  9900,
  'month',
  '["10 conexões WhatsApp", "10.000 mensagens/mês", "Automações ilimitadas", "IA avançada", "Relatórios completos", "API access", "Integrações", "Suporte 24/7"]',
  'price_pro_monthly',
  'pro',
  true
),
(
  'Enterprise',
  'enterprise',
  'Solução completa para grandes empresas',
  29900,
  'month',
  '["Conexões ilimitadas", "Mensagens ilimitadas", "Recursos personalizados", "Gerente de conta dedicado", "SLA garantido", "Treinamento personalizado", "Integração customizada"]',
  'price_enterprise_monthly',
  'enterprise',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  features = EXCLUDED.features,
  updated_at = NOW();
