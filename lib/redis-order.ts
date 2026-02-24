import { Redis } from '@upstash/redis';
const redis = Redis.fromEnv();

export async function findInRedis(orderId: string): Promise<Boolean> {
    const SIXTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 60; // 60 dias
    const dedupeKey = `mercadolivre:order:${orderId}:paid`;
    // Tenta inserir a chave com NX (só insere se não existir) e TTL de 60 dias
    const result = await redis.set(dedupeKey, "1",{ ex: SIXTY_DAYS_IN_SECONDS, nx: true });

    if (!result) {
      // Chave já existia: webhook duplicado, não enviar notificação
      console.warn("Pedido já processado (webhook duplicado):", orderId);
      return true;
    }

    // Primeiro evento 'paid': retornar true
    return false;
}