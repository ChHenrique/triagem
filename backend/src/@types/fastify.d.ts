import '@fastify/jwt';
import '@fastify/multipart'; // Adiciona a importação para garantir que as tipagens do multipart sejam reconhecidas
import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload; // Tipando a propriedade 'user' com o tipo JwtPayload
    fields: any; // Tipando a propriedade 'fields' que vem do multipart
  }
}

// Define o tipo para o payload do JWT
export interface JwtPayload {
  id: string;
  role: string;
}
