-- Criar usuário administrador
INSERT INTO users (
  id,
  email,
  password,
  name,
  plan_type,
  plan_status,
  is_active,
  email_verified,
  created_at,
  updated_at
) VALUES (
  'admin_' || generate_random_uuid(),
  'admin@frontzap.com',
  '$2a$12$LQv3c1yqBwEHFl5aysHdsOu/1oKMVw.VnN/7mqEp6rxgUi0qUEx/u', -- admin123
  'Administrador',
  'premium',
  'active',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  name = EXCLUDED.name,
  plan_type = EXCLUDED.plan_type,
  updated_at = NOW();

-- Verificar se o usuário foi criado
SELECT id, email, name, plan_type, created_at FROM users WHERE email = 'admin@frontzap.com';
