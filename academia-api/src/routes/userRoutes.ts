import { FastifyInstance } from 'fastify';
import { prisma } from '../models/prismaClient';
import bcrypt from 'bcryptjs';
import { CreateUserBody } from '../models/user.model';
import { authMiddleware } from '../middlewares/authMiddleware';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: CreateUserBody }>('/register', async (req, reply) => {
    const { name, email, password, phone, photoUrl } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return reply.status(400).send({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, phone, photoUrl }
    });

    return reply.send(user);
  });

  fastify.get('/users', { preHandler: authMiddleware }, async (req, reply) => {
    const users = await prisma.user.findMany();
    return reply.send(users);
  });
}
