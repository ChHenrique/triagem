import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../models/prismaClient';
import { CreateUserBody } from '../models/user.model';
import { authMiddleware } from '../middlewares/authMiddleware';
import { hashPassword, checkEmailExists, sanitizeUserUpdate } from '../utils/userUtils';
import { JwtPayload } from '../@types/fastify';


export async function userRoutes(fastify: FastifyInstance) {
  // Cadastro de usuário
  fastify.post<{ Body: CreateUserBody }>('/register', async (req, reply) => {
    const { name, email, password, phone, photoUrl } = req.body;

    // Verificar se o email já está em uso
    if (await checkEmailExists(email)) {
      return reply.status(400).send({ error: 'Email already in use' });
    }

    // Criptografar senha
    const hashedPassword = await hashPassword(password);

    // Criar usuário no banco
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, phone, photoUrl },
    });

    return reply.send(user);
  });

  // Listagem de usuários
  fastify.get('/', { preHandler: authMiddleware }, async (_, reply) => {
    const users = await prisma.user.findMany();
    return reply.send(users);
  });

  // Atualização de usuário
  fastify.put<{ Params: { id: string }; Body: Partial<CreateUserBody> }>(
    '/:id',
    { preHandler: authMiddleware },
    async (req, reply) => {
      try {
        const { id } = req.params;

        // Verifica se o usuário existe
        const userExists = await prisma.user.findUnique({ where: { id } });
        if (!userExists) {
          return reply.status(404).send({ error: 'Usuário não encontrado' });
        }

        const { password, ...body } = req.body;

        // Se houver senha, criptografa antes de atualizar
        const data: Partial<CreateUserBody> = password
          ? {
              ...body,
              password: await hashPassword(password),
            }
          : { ...body };

        // Atualiza usuário com dados fornecidos
        const userUpdate = await prisma.user.update({
          where: { id },
          data: sanitizeUserUpdate(data),
        });

        return reply.status(200).send(userUpdate);
      } catch (error) {
        console.error('Erro no Prisma:', error);
        return reply.status(400).send({ error: 'Erro ao atualizar usuário' });
      }
    }
  );

  // Exclusão de usuário
  fastify.delete<{ Params: { id: string } }>('/:id', { preHandler: authMiddleware }, async (req, reply) => {
    try {
      const { id } = req.params;

      // Verifica se o usuário existe antes de tentar excluir
      const userExists = await prisma.user.findUnique({ where: { id } });
      if (!userExists) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }

      // Exclui o usuário
      await prisma.user.delete({
        where: { id },
      });

      return reply.status(200).send({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      console.error(error);
      return reply.status(400).send({ error: 'Erro ao excluir usuário' });
    }
  });

  fastify.get('/me', { preHandler: authMiddleware }, async (req: FastifyRequest, reply: FastifyReply) => {
    const user = req.user as JwtPayload; 

    if (!user) {
      return reply.status(401).send({ error: 'Não autorizado' });
    }

    try {
      // Obter os dados do usuário com base no id do JWT
      const userData = await prisma.user.findUnique({
        where: { id: user.id }, 
      });

      if (!userData) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }

      // Retorna os dados do usuário encontrado
      return reply.send(userData);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return reply.status(500).send({ error: 'Erro interno ao buscar os dados do usuário' });
    }
  });
  
  


}
