/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    ML_CLIENT_ID: string;
    ML_CLIENT_SECRET: string;
    // Adicione outras variáveis de ambiente aqui conforme necessário
  }
}
