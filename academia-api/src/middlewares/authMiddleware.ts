import { FastifyReply, FastifyRequest } from 'fastify';

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify(); // Verifica o token JWT
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized' }); // Retorna imediatamente em caso de erro
  }
}