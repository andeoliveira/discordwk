export default async function handler(req, res) {
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
        client_id: process.env.ML_CLIENT_ID,
        redirect_uri: process.env.ML_REDIRECT_URI
    })

    const authUrl = `https://auth.mercadolivre.com.br/authorization?${params.toString()}`

    console.warn("Redirecionando para Mercado Livre OAuth:", authUrl);
    
    return res.redirect(authUrl)
}