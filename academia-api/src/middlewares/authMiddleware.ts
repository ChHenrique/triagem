import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtPayload } from '../@types/fastify';

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  try {
    // O token agora será extraído automaticamente do cookie
    const token = req.cookies.token;
    console.log('Token extraído:', token);

    if (!token) {
      return reply.status(401).send({ error: 'Token de autenticação não fornecido' });
    }

    // Verifica o token JWT
    const payload = await req.jwtVerify();  // Não é necessário passar o token aqui, o fastify-jwt já vai olhar no cookie

    req.user = payload as JwtPayload; // Atribui o payload ao usuário

    console.log('Dados do usuário no req.user:', req.user);

  } catch (err) {
    console.error('Erro na autenticação:', err);
    return reply.status(401).send({ error: 'Não autorizado' });
  }
}
