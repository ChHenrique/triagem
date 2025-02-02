import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../models/prismaClient';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = req.body as { email: string; password: string };

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return reply.status(400).send({ error: 'Credenciais inválidas', message: 'Usuário não encontrado' });
    }

    // Verifica a senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return reply.status(400).send({ error: 'Credenciais inválidas', message: 'Senha incorreta' });
    }

    // Gera o token JWT
    const token = fastify.jwt.sign({ id: user.id, role: user.role });

    // Define o cookie com o token JWT
    reply.setCookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 86400, // Expira após 1 dia
    });

    return reply.send({ message: 'Login bem-sucedido' });
  });
}
