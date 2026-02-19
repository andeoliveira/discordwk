/**
 * Endpoint para refresh de token (exemplo, ajuste conforme lógica real).
 */
import { getValidAccessToken } from '../../lib/ml-token';

export default async function handler(req: any, res: any): Promise<void> {
    try {
        // Apenas chamar já força validação/refresh
        await getValidAccessToken();

        res.status(200).json({
            status: 'ok',
            message: 'Token do Mercado Livre validado/renovado com sucesso'
        });
    } catch (error: any) {
        console.error('Erro no cron de refresh:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
}