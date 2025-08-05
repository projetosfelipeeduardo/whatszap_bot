import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Rotas de API que precisam de autenticação
  const protectedApiRoutes = ["/api/whatsapp", "/api/contacts", "/api/campaigns", "/api/flows"]
  const isProtectedApiRoute = protectedApiRoutes.some((route) => pathname.startsWith(route))

  // Rotas de API de autenticação (sempre públicas)
  const authApiRoutes = ["/api/auth"]
  const isAuthApiRoute = authApiRoutes.some((route) => pathname.startsWith(route))

  // Permitir rotas de API de autenticação
  if (isAuthApiRoute) {
    return NextResponse.next()
  }

  try {
    const token = request.cookies.get("session-token")?.value

    // Se não há token e a rota não é pública
    if (!token && !isPublicRoute) {
      if (isProtectedApiRoute) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      // Redirecionar para login
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirectTo", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Se há token, validar
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          userId: string
          email: string
          planType: string
        }

        // Se está autenticado e tenta acessar rota pública (exceto API)
        if (isPublicRoute && !pathname.startsWith("/api/")) {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }

        // Adicionar headers com informações do usuário para rotas protegidas
        if (!isPublicRoute) {
          const response = NextResponse.next()
          response.headers.set("X-User-Id", decoded.userId)
          response.headers.set("X-User-Email", decoded.email)
          response.headers.set("X-User-Plan", decoded.planType)
          return response
        }
      } catch (jwtError) {
        console.error("JWT verification failed:", jwtError)

        // Token inválido, limpar cookie
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
