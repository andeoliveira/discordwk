import { getValidAccessToken } from '../../lib/ml-token';

export default async function handler(req, res) {
  try {
    // Apenas chamar já força validação/refresh
    await getValidAccessToken();

    res.status(200).json({
      status: 'ok',
      message: 'Token do Mercado Livre validado/renovado com sucesso'
    });
  } catch (error) {
    console.error('Erro no cron de refresh:', error);

    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}
