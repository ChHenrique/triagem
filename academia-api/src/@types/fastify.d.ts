// src/types/fastify.d.ts
import '@fastify/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload; // Tipando a propriedade 'user' com o tipo JwtPayload
  }
}

// Define o tipo para o payload do JWT
export interface JwtPayload {
  id: string;
  role: string;
}
