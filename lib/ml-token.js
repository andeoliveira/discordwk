import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function getValidAccessToken() {
  const accessToken = await redis.get('ml:access_token')

  if (accessToken) {
    console.warn("Access token válido encontrado no Redis");
    return accessToken
  }

  // token expirou → renovar
  const refreshToken = await redis.get('ml:refresh_token')

  if (!refreshToken) {
    throw new Error('Refresh token não encontrado. Reautorize a aplicação.')
  }

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.ML_CLIENT_ID,
    client_secret: process.env.ML_CLIENT_SECRET,
    refresh_token: refreshToken
  })

  const response = await fetch(
    'https://api.mercadolibre.com/oauth/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    }
  )

  const data = await response.json()

  if (!response.ok) {
    console.error('Erro ao renovar token:', data)
    throw new Error('Falha ao renovar token')
  }

  await redis.set('ml:access_token', data.access_token, {
    ex: data.expires_in
  })

  if (data.refresh_token) {
    await redis.set('ml:refresh_token', data.refresh_token)
  }

  return data.access_token
}