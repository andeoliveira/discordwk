/**
 * Endpoint de callback OAuth Mercado Livre (exemplo, ajuste conforme lógica real).
 */

import { Redis } from '@upstash/redis';
const redis = Redis.fromEnv();

export default async function handler(req: any, res: any): Promise<void> {
    try {
        if (process.env.NODE_ENV !== 'production') {
            try {
                const dotenv = await import('dotenv');
                dotenv.config({ path: '.env.local' });
            } catch (e) {
                // dotenv not available or failed to load — continue without crashing
            }
        }
        const { code } = req.query;

        if (!code || typeof code !== 'string') {
            console.error('Code de autorização não fornecido');
            return res.status(400).send('Code não informado');
        }

        const response = await fetch('https://api.mercadolibre.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.ML_CLIENT_ID || '',
                client_secret: process.env.ML_CLIENT_SECRET || '',
                redirect_uri: process.env.ML_REDIRECT_URI || '',
                code,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Erro ao autenticar no Mercado Livre:', error);
            return res.status(400).send(error);
        }

        const data = await response.json();

        // access_token com TTL real
        await redis.set('ml:access_token', data.access_token, {
            ex: data.expires_in,
        });

        // refresh_token sem TTL
        await redis.set('ml:refresh_token', data.refresh_token);

        console.warn('Mercado Livre autenticado com sucesso. Tokens armazenados no Redis.', { key: data });
        res.send('✅ Mercado Livre autenticado com sucesso!');
    } catch (err: any) {
        console.error('Erro inesperado no callback Mercado Livre:', err);
        res.status(400).send('Erro interno ao autenticar Mercado Livre');
    }
}