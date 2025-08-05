import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { CacheService } from "./redis"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

export interface User {
  id: string
  email: string
  name: string
  planType: string
}

export class AuthService {
  static async register(email: string, password: string, fullName?: string) {
    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error("Usuário já existe com este email")
    }

    // Validar força da senha
    if (password.length < 8) {
      throw new Error("Senha deve ter pelo menos 8 caracteres")
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: fullName?.trim(),
        planType: "free",
        planStatus: "active",
        emailVerified: false,
        isActive: true,
      },
    })

    // Gerar token de sessão
    const token = this.generateSessionToken()

    // Salvar sessão no Redis (cache rápido)
    await CacheService.setSession(token, user.id, 86400 * 7) // 7 dias

    // Salvar sessão no banco (persistência)
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 86400 * 7 * 1000), // 7 dias
      },
    })

    return { user: this.sanitizeUser(user), token }
  }

  static async login(email: string, password: string) {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user) {
      throw new Error("Credenciais inválidas")
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      throw new Error("Credenciais inválidas")
    }

    // Verificar se a conta está ativa
    if (user.planStatus === "suspended" || !user.isActive) {
      throw new Error("Conta suspensa ou inativa. Entre em contato com o suporte.")
    }

    // Gerar token de sessão
    const token = this.generateSessionToken()

    // Salvar sessão no Redis
    await CacheService.setSession(token, user.id, 86400 * 7)

    // Salvar sessão no banco
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 86400 * 7 * 1000),
      },
    })

    // Atualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() },
    })

    return { user: this.sanitizeUser(user), token }
  }

  static async validateSession(token: string) {
    if (!token) return null

    try {
      // Verificar no Redis primeiro (mais rápido)
      const userId = await CacheService.getSession(token)

      if (!userId) {
        // Se não estiver no Redis, verificar no banco
        const session = await prisma.session.findUnique({
          where: { token },
          include: { user: true },
        })

        if (!session || session.expiresAt < new Date()) {
          // Sessão expirada, limpar do banco
          if (session) {
            await prisma.session.delete({ where: { id: session.id } })
          }
          return null
        }

        // Recolocar no Redis
        await CacheService.setSession(token, session.userId, 86400 * 7)
        return this.sanitizeUser(session.user)
      }

      // Buscar usuário no cache
      let user = await CacheService.getUser(userId)

      if (!user) {
        // Se não estiver no cache, buscar no banco
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (!dbUser) return null

        user = this.sanitizeUser(dbUser)
        // Salvar no cache para próximas consultas
        await CacheService.setUser(userId, user, 3600) // 1 hora
      }

      return user
    } catch (error) {
      console.error("Session validation error:", error)
      return null
    }
  }

  static async logout(token: string) {
    if (!token) return

    try {
      // Remover do Redis
      await CacheService.deleteSession(token)

      // Remover do banco
      await prisma.session.deleteMany({
        where: { token },
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  static async logoutAllSessions(userId: string) {
    try {
      // Buscar todas as sessões do usuário
      const sessions = await prisma.session.findMany({
        where: { userId },
        select: { token: true },
      })

      // Remover do Redis
      for (const session of sessions) {
        await CacheService.deleteSession(session.token)
      }

      // Remover do banco
      await prisma.session.deleteMany({
        where: { userId },
      })

      // Limpar cache do usuário
      await CacheService.deleteUser(userId)
    } catch (error) {
      console.error("Logout all sessions error:", error)
    }
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    // Verificar senha atual
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)

    if (!isValidPassword) {
      throw new Error("Senha atual incorreta")
    }

    // Validar nova senha
    if (newPassword.length < 8) {
      throw new Error("Nova senha deve ter pelo menos 8 caracteres")
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Atualizar senha
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    })

    // Invalidar todas as sessões exceto a atual
    await this.logoutAllSessions(userId)
  }

  static async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user) {
      // Por segurança, não revelar se o email existe
      return { message: "Se o email existir, você receberá instruções para redefinir a senha." }
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    // Salvar token no banco
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // TODO: Enviar email com link de reset
    // await EmailService.sendPasswordResetEmail(user.email, resetToken)

    return { message: "Se o email existir, você receberá instruções para redefinir a senha." }
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      throw new Error("Token inválido ou expirado")
    }

    // Validar nova senha
    if (newPassword.length < 8) {
      throw new Error("Senha deve ter pelo menos 8 caracteres")
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Atualizar senha e limpar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date(),
      },
    })

    // Invalidar todas as sessões
    await this.logoutAllSessions(user.id)

    return { message: "Senha redefinida com sucesso" }
  }

  static async checkRateLimit(key: string, maxAttempts: number, windowSeconds: number): Promise<boolean> {
    try {
      return await CacheService.checkRateLimit(key, maxAttempts, windowSeconds)
    } catch (error) {
      console.error("Rate limit check error:", error)
      return true // Em caso de erro, permitir a tentativa
    }
  }

  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  static sanitizeUser(user: any) {
    const { password, resetToken, resetTokenExpiry, ...sanitizedUser } = user
    return sanitizedUser
  }

  static async getCurrentUser(request: NextRequest): Promise<User | null> {
    try {
      const token = request.cookies.get("session-token")?.value

      if (!token) {
        return null
      }

      // Verificar token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string
        email: string
        planType: string
      }

      // Buscar usuário no banco para garantir que ainda existe e está ativo
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          planType: true,
          isActive: true,
        },
      })

      if (!user || !user.isActive) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        planType: user.planType,
      }
    } catch (error) {
      console.error("Get current user error:", error)
      return null
    }
  }

  static async requireAuth(request: NextRequest): Promise<User> {
    const user = await this.getCurrentUser(request)

    if (!user) {
      throw new Error("Authentication required")
    }

    return user
  }

  static async getUserById(userId: string) {
    try {
      // Tentar buscar do cache primeiro
      let user = await CacheService.getUser(userId)

      if (!user) {
        // Buscar do banco
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (!dbUser) return null

        user = this.sanitizeUser(dbUser)
        // Salvar no cache
        await CacheService.setUser(userId, user, 3600)
      }

      return user
    } catch (error) {
      console.error("Get user by ID error:", error)
      return null
    }
  }

  static async updateUserProfile(
    userId: string,
    data: {
      fullName?: string
      avatarUrl?: string
      phone?: string
    },
  ) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      })

      // Atualizar cache
      const sanitizedUser = this.sanitizeUser(updatedUser)
      await CacheService.setUser(userId, sanitizedUser, 3600)

      return sanitizedUser
    } catch (error) {
      console.error("Update user profile error:", error)
      throw new Error("Erro ao atualizar perfil")
    }
  }
}
