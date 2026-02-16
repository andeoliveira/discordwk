export default async function handler(req, res) {
  // Mercado Livre envia POST
  if (req.method !== "POST") {
    console.log("Método não permitido:", req.method);
    return res.status(200).end(); // ML exige 200 rápido
  }

  try {
    const { topic, resource } = req.body;

    // Só processa pedidos
    if (!topic || !resource || !topic.includes("orders")) {
      console.log("Webhook recebido, mas não é de pedido:", topic);
      return res.status(200).end();
    }

    const orderId = resource.split("/").pop();

    const message = {
      content: `🛒 **Nova venda no Mercado Livre!**
📦 Pedido: ${orderId}`
    };

    await fetch(process.env.DISCORD_WEBHOOK_URL, {
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