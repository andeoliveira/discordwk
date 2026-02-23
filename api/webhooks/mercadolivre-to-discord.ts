/**
 * Webhook para integração Mercado Livre → Discord (exemplo, ajuste conforme lógica real).
 */
import { getValidAccessToken } from '../../lib/ml-token';
import { DiscordNotifier } from './discord';
import { OrderService } from '../mercadolivre/order';
import { findInRedis } from '../../lib/redis-order';

export default async function handler(req: any, res: any): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
        try {
            const dotenv = await import('dotenv');
            dotenv.config({ path: '.env.local' });
        } catch (e) {
            // dotenv not available or failed to load — continue without crashing
        }
    }

    // Mercado Livre envia POST
    if (req.method !== "POST") {
        console.log("Método não permitido:", req.method);
        return res.status(200).end(); // ML exige 200 rápido
    }

    try {
        console.log("===== WEBHOOK MERCADO LIVRE =====");
        console.log("Timestamp: ", new Date().toISOString());
        console.log("Method: ", req.method);
        console.log("Headers: ", JSON.stringify(req.headers, null, 2));
        console.warn("Body: ", JSON.stringify(req.body, null, 2));
        console.log("================================");

        const { topic, resource } = req.body || {};

        if (!topic || !resource) {
            console.warn("Payload sem topic/resource");
            return;
        }

        // 🔹 Só processa eventos de pedidos
        if (!topic || !resource || !topic.includes("orders")) {
            console.warn("Webhook recebido, mas não é de pedido:", topic);
            return res.status(200).end();
        }
        const orderId = resource.split("/").pop();

        const accessToken = await getValidAccessToken();
        if (!accessToken) {
            console.warn("Access token não encontrado no Redis");
        }
        console.log("Access token obtido:", !!accessToken);
        
        // busca detalhes do pedido
        const order = await new OrderService().get(orderId);

        if (!order || !order.id) {
            console.warn("Detalhes do pedido não encontrados ou inválidos:", order);
            //return res.status(200).end();
        }
       
        //filtra somente pelos pedidos pagos
        if (order.status !== "paid") {
            console.warn("Pedido recebido, mas status não é 'paid':", order.status);
            return res.status(200).end();
        }

        const findRedisOrder = await findInRedis(orderId);
        if (findRedisOrder) {
            console.warn("Pedido já processado (webhook duplicado):", orderId);
            return res.status(200).json({ message: 'Pedido já processado' });
        }

        const message = {
            content: `🛒 **Nova venda no Mercado Livre!**\n📦 Pedido: ${orderId}`
        };

        if (order.order_items && order.order_items.length > 0) {
            console.warn(`Pedido ${orderId} contém ${order.order_items.length} item(s).`);
            message.content += `\n👤 Cliente: ${order.buyer.first_name} ${order.buyer.last_name}\n📋 Itens:\n` + order.order_items.map((item: any) => {
                return `- ${item.item.title} (${item.quantity} - UN)`;
            }).join('\n');
        }

        //envia notificação para Discord
        await new DiscordNotifier().send(message.content);  
        console.warn("Notificação enviada para Discord:", message.content);
        return res.status(200).end();
        
    } catch (err) {
        console.error("Erro webhook:", err);
        return res.status(200).end(); // ML não reenvia se não for 200
    }
}