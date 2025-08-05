import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { CacheService } from "./redis"
import crypto from "crypto"

export class AuthService {
  static async register(email: string, password: string, fullName?: string) {
    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error("Usuário já existe")
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
    })

    // Gerar token de sessão
    const token = this.generateSessionToken()

    // Salvar sessão no Redis
    await CacheService.setSession(token, user.id, 86400 * 7) // 7 dias

    // Salvar sessão no banco
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 86400 * 7 * 1000),
      },
    })

    return { user: this.sanitizeUser(user), token }
  }

  static async login(email: string, password: string) {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error("Credenciais inválidas")
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      throw new Error("Credenciais inválidas")
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

    return { user: this.sanitizeUser(user), token }
  }

  static async validateSession(token: string) {
    // Verificar no Redis primeiro (mais rápido)
    const userId = await CacheService.getSession(token)

    if (!userId) {
      return null
    }

    // Buscar usuário no cache
    let user = await CacheService.getUser(userId)

    if (!user) {
      // Se não estiver no cache, buscar no banco
      user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (user) {
        // Salvar no cache para próximas consultas
        await CacheService.setUser(userId, this.sanitizeUser(user))
      }
    }

    return user ? this.sanitizeUser(user) : null
  }

  static async logout(token: string) {
    // Remover do Redis
    await CacheService.deleteSession(token)

    // Remover do banco
    await prisma.session.deleteMany({
      where: { token },
    })
  }

  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  static sanitizeUser(user: any) {
    const { password, ...sanitizedUser } = user
    return sanitizedUser
  }
}
