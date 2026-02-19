/**
 * Endpoint de autenticação Mercado Livre (exemplo, ajuste conforme lógica real).
 */
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
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: process.env.ML_CLIENT_ID || '',
            redirect_uri: process.env.ML_REDIRECT_URI || ''
        });

        const authUrl = `https://auth.mercadolivre.com.br/authorization?${params.toString()}`;

        console.warn('Redirecionando para Mercado Livre OAuth:', authUrl);
        return res.redirect(authUrl);
    } catch (err: any) {
        console.error('Erro inesperado no endpoint de autenticação Mercado Livre:', err);
        res.status(500).send('Erro interno ao redirecionar para autenticação Mercado Livre');
    }
}