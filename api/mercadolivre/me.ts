import { getValidAccessToken } from '../../lib/ml-token';

/**
 * Endpoint para buscar dados do usuário autenticado no Mercado Livre.
 */
export default async function handler(req: any, res: any): Promise<void> {
    try {
        const token = await getValidAccessToken();
        console.log("Token válido obtido para /me:", token);
        const response = await fetch('https://api.mercadolibre.com/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error: any) {
        console.error('Erro ao obter dados do usuário:', error);
        res.status(400).json({ error: error.message });
    }
}