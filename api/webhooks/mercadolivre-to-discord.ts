/**
 * Webhook para integração Mercado Livre → Discord (exemplo, ajuste conforme lógica real).
 */
import { getValidAccessToken } from '../../lib/ml-token';

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
        console.log("Timestamp:", new Date().toISOString());
        console.log("Method:", req.method);
        console.log("Headers:", JSON.stringify(req.headers, null, 2));
        console.warn("Body COMPLETO:", JSON.stringify(req.body, null, 2));
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

        /*
        const accessToken = await getValidAccessToken();
        if (!accessToken) {
            console.warn("Access token não encontrado no Redis");
        }
        console.log("Access token obtido:", !!accessToken);
        // busca detalhes do pedido
        const orderResponse = await fetch(
            `https://api.mercadolibre.com/orders/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken.access_token}`
                }
            }
        );
        const order = await orderResponse.json();
        if (!orderResponse.ok) {
            console.error('Erro ao buscar pedido:', order);
            //return
        }
        */

        // Envio para Discord
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        if (!webhookUrl) {
            console.error("Discord webhook URL is not set. Skipping notification.");
            return res.status(200).end();
        }

        const message = {
            content: `🛒 **Nova venda no Mercado Livre!**\n📦 Pedido: ${orderId}`
        };

        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message)
        });

        console.warn("Notificação enviada para Discord:", message.content);
        return res.status(200).end();
    } catch (err) {
        console.error("Erro webhook:", err);
        return res.status(200).end(); // ML não reenvia se não for 200
    }
}