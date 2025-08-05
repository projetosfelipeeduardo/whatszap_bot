import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "../auth"

export async function authMiddleware(request: NextRequest) {
  const token = request.cookies.get("session-token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const user = await AuthService.validateSession(token)

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Adicionar usuário ao header para uso nas APIs
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", user.id)
  requestHeaders.set("x-user-email", user.email)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
