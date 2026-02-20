
import { getValidAccessToken } from '../../lib/ml-token';
import { get, type IncomingMessage, type ServerResponse } from 'http';

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
export class OrderService {
    async get(id: string): Promise<any> {
        const token = await getValidAccessToken();
        console.log("Token válido obtido para /order:", token);
        const response = await fetch(`https://api.mercadolibre.com/orders/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }
    
}