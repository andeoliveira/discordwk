export default async function handler(req, res) {
  // Load .env.local only in non-production to avoid affecting Vercel production
  if (process.env.NODE_ENV !== 'production') {
    try {
      const dotenv = await import('dotenv');
      dotenv.config({ path: '.env.local' });
    } catch (e) {
      // dotenv not available or failed to load — continue without crashing
    }
  }

  console.log("DISCORD_WEBHOOK_URL:", process.env.DISCORD_WEBHOOK_URL);

  // Mercado Livre envia POST
  if (req.method !== "POST") {
    console.log("Método não permitido:", req.method);
    return res.status(200).end(); // ML exige 200 rápido
  }

  try {
    console.log("Webhook recebido:", req.body);
    const { topic, resource } = req.body;

    // Só processa pedidos
    if (!topic || !resource || !topic.includes("orders")) {
      console.log("Webhook recebido, mas não é de pedido:", topic);
      return res.status(200).end();
    }

    const orderId = resource.split("/").pop();

    const message = {
      content: `🛒 **Nova venda no Mercado Livre!**\n📦 Pedido: ${orderId}`
    };

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("Discord webhook URL is not set. Skipping notification.");
      return res.status(200).end();
    }

    try {
      new URL(webhookUrl);
    } catch (e) {
      console.error("Invalid DISCORD_WEBHOOK_URL:", webhookUrl, e);
      return res.status(200).end();
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });
    console.log("Notificação enviada para Discord:", message.content);
    return res.status(200).end();
  } catch (err) {
    console.error("Erro Mercado Livre webhook:", err);
    return res.status(200).end(); // ML não reenvia se não for 200
  }
}