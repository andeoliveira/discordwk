// Tipos globais para respostas do Mercado Livre

export interface MercadoLivreOrder {
  id: number;
  status: string;
  date_created: string;
  // Adicione outros campos relevantes conforme a documentação oficial
  [key: string]: unknown;
}
