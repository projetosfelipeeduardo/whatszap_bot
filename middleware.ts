import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ["/login", "/register", "/api/auth/login", "/api/auth/register"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Rotas de API que precisam de autenticação
  const protectedApiRoutes = ["/api/whatsapp", "/api/contacts", "/api/campaigns", "/api/ai"]
  const isProtectedApiRoute = protectedApiRoutes.some((route) => pathname.startsWith(route))

  try {
    const user = await getCurrentUser(request)

    // Se não está autenticado e tenta acessar rota protegida
    if (!user && !isPublicRoute) {
      if (isProtectedApiRoute) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      // Redirecionar para login
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirectTo", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Se está autenticado e tenta acessar rota pública
    if (user && isPublicRoute && !pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Adicionar headers com informações do usuário para rotas protegidas
    if (user && !isPublicRoute) {
      const response = NextResponse.next()
      response.headers.set("X-User-Id", user.id)
      response.headers.set("X-User-Plan", user.planType)
      return response
    }
  } catch (error) {
    console.error("Middleware error:", error)

    // Em caso de erro, redirecionar para login se não for rota pública
    if (!isPublicRoute) {
      if (isProtectedApiRoute) {
        return NextResponse.json({ error: "Authentication error" }, { status: 401 })
      }

      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
