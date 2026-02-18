    import { getValidAccessToken } from '../../lib/ml-token.js';
    
    export default async function handler(req, res) {

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
        } catch (error) {
            console.error('Erro ao obter dados do usuário:', error);
            res.status(400).json({ error: error.message });
        }
            
}