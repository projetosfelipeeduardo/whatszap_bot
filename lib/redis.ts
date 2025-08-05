import Redis from "ioredis"

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number.parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
})

export class CacheService {
  // Cache de sessões
  static async setSession(token: string, userId: string, expiresIn = 86400) {
    await redis.setex(`session:${token}`, expiresIn, userId)
  }

  static async getSession(token: string): Promise<string | null> {
    return await redis.get(`session:${token}`)
  }

  static async deleteSession(token: string) {
    await redis.del(`session:${token}`)
  }

  // Cache de usuários
  static async setUser(userId: string, userData: any, expiresIn = 3600) {
    await redis.setex(`user:${userId}`, expiresIn, JSON.stringify(userData))
  }

  static async getUser(userId: string): Promise<any | null> {
    const data = await redis.get(`user:${userId}`)
    return data ? JSON.parse(data) : null
  }

  // Cache de planos
  static async setPlans(plans: any[], expiresIn = 3600) {
    await redis.setex("plans:active", expiresIn, JSON.stringify(plans))
  }

  static async getPlans(): Promise<any[] | null> {
    const data = await redis.get("plans:active")
    return data ? JSON.parse(data) : null
  }

  // Cache de estatísticas
  static async incrementStat(key: string, value = 1) {
    await redis.incrby(`stats:${key}`, value)
  }

  static async getStat(key: string): Promise<number> {
    const value = await redis.get(`stats:${key}`)
    return value ? Number.parseInt(value) : 0
  }

  // Rate limiting
  static async checkRateLimit(key: string, limit: number, window: number): Promise<boolean> {
    const current = await redis.incr(`rate:${key}`)
    if (current === 1) {
      await redis.expire(`rate:${key}`, window)
    }
    return current <= limit
  }

  // Cache invalidation
  static async invalidatePattern(pattern: string) {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  }
}

export default redis
