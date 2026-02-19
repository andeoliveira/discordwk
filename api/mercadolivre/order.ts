
import { getValidAccessToken } from '../../lib/ml-token';
import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Endpoint para buscar detalhes de um pedido específico do Mercado Livre.
 * Espera receber o parâmetro id na query string.
 * Exemplo: /api/mercadolivre/order?id=123456789
 */
/**
 * Endpoint para buscar detalhes de um pedido específico do Mercado Livre.
 * Espera receber o parâmetro id na query string.
 * Exemplo: /api/mercadolivre/order?id=123456789
 */
export default async function handler(req: any, res: any): Promise<void> {
    try {
        const { id } = req.query;
        if (!id || typeof id !== 'string' || !/^\d+$/.test(id)) {
            return res.status(400).json({ error: 'Parâmetro id do pedido é obrigatório e deve ser numérico.' });
        }

        const token = await getValidAccessToken();
        console.log("Token válido obtido para /order:", token);
        const response = await fetch(`https://api.mercadolibre.com/orders/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            console.error('Erro ao buscar pedido no Mercado Livre:', data);
            return res.status(response.status).json({ error: data.message || 'Erro ao buscar pedido no Mercado Livre' });
        }
        res.json(data);
    } catch (error: any) {
        console.error('Erro ao obter dados do pedido:', error);
        res.status(400).json({ error: error.message });
    }
}