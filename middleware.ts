import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

// Rotas que não precisam de autenticação
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/webhook",
  "/api/health",
  "/_next",
  "/favicon.ico",
  "/public",
]

// Rotas que só usuários não autenticados podem acessar
const authRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Verificar se é uma rota de autenticação
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Obter token do cookie
  const token = request.cookies.get("session-token")?.value

  // Se não há token e a rota não é pública, redirecionar para login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se há token, validar a sessão
  if (token) {
    try {
      const user = await AuthService.validateSession(token)

      // Se o token é inválido, limpar cookie e redirecionar se necessário
      if (!user) {
        const response = isPublicRoute ? NextResponse.next() : NextResponse.redirect(new URL("/login", request.url))

        // Limpar cookie inválido
        response.cookies.set("session-token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 0,
          path: "/",
        })

        return response
      }

      // Se usuário está autenticado e tenta acessar rota de auth, redirecionar
      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      // Adicionar informações do usuário aos headers para uso nas APIs
      const response = NextResponse.next()
      response.headers.set("x-user-id", user.id)
      response.headers.set("x-user-email", user.email)
      response.headers.set("x-user-plan", user.planType || "free")

      return response
    } catch (error) {
      console.error("Middleware auth error:", error)

      // Em caso de erro, limpar cookie e continuar
      const response = isPublicRoute ? NextResponse.next() : NextResponse.redirect(new URL("/login", request.url))

      response.cookies.set("session-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      })

      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
