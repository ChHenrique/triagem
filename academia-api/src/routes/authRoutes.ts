import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '../models/prismaClient'

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (req, reply) => {
    const { email, password } = req.body as { email: string, password: string };

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return reply.status(400).send({ error: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return reply.status(400).send({ error: 'Invalid credentials' })
    }

    const token = fastify.jwt.sign({ id: user.id, role: user.role })

    return reply.send({ token })
  });
}
