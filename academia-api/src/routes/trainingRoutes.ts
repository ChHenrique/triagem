import { FastifyInstance } from 'fastify';
import { prisma } from '../models/prismaClient';  // Certifique-se de que o prismaClient está configurado corretamente
import { CreateTrainingBody } from '../models/training.model';

// Defina os tipos dos parâmetros
interface TrainingParams {
  id: string;
}

export async function trainingRoutes(fastify: FastifyInstance) {
  // Criar um novo treino
  fastify.post<{ Body: CreateTrainingBody }>('/', async (req, reply) => {
    const { name, description, bodyParts } = req.body;

    const training = await prisma.training.create({
      data: { name, description, bodyParts }
    });

    return reply.send(training);
  });

  // Listar treinos
  fastify.get('/', async (req, reply) => {
    const trainings = await prisma.training.findMany();
    return reply.send(trainings);
  });

  // Detalhes de um treino
  fastify.get<{ Params: TrainingParams }>('/:id', async (req, reply) => {
    const { id } = req.params;

    const training = await prisma.training.findUnique({
      where: { id },
      include: { exercises: true }
    });

    return reply.send(training);
  });
}
