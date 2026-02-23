import { Redis } from '@upstash/redis';
const redis = Redis.fromEnv();

export async function findInRedis(orderId: string): Promise<Boolean> {
  
    const dedupeKey = `mercadolivre:order:${orderId}:paid`;
    // Tenta inserir a chave com NX (só insere se não existir) e TTL de 24h (86400s)
    const result = await redis.set(dedupeKey, "1", {ex: 86400, nx: true});

    if (!result) {
      // Chave já existia: webhook duplicado, não enviar notificação
      console.warn("Pedido já processado (webhook duplicado):", orderId);
      return true;
    }

    // Primeiro evento 'paid': retornar true
    return false;
}