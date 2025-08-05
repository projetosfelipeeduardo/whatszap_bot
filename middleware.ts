import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas que não precisam de autenticação
const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/pricing", "/api/webhook"]

// Middleware para verificar autenticação e redirecionar se necessário
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verifica se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = req.nextUrl.clone()
  const { pathname } = url

  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith("/api/public/"))

  // Se não estiver autenticado e a rota não for pública, redireciona para login
  if (!session && !isPublicRoute) {
    url.pathname = "/login"
    url.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(url)
  }

  // Se estiver autenticado e tentar acessar login/register, redireciona para dashboard
  if (session && (pathname === "/login" || pathname === "/register")) {
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return res
}

// Configuração para aplicar o middleware apenas em rotas específicas
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
