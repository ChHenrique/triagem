import { FastifyInstance } from 'fastify';
import { prisma } from '../models/prismaClient';  
import { CreateTrainingBody } from '../models/training.model';

interface TrainingParams {
  id: string
}

export async function trainingRoutes(fastify: FastifyInstance) {
  //Criar um novo treino
  fastify.post<{ Body: CreateTrainingBody }>('/', async (req, reply) => {
    const { name, description, bodyParts } = req.body

    const training = await prisma.training.create({
      data: { name, description, bodyParts }
    });

    return reply.send(training)
  });

  // Listar treinos
  fastify.get('/', async (req, reply) => {
    const trainings = await prisma.training.findMany()
    return reply.send(trainings)
  });

  // Detalhes de um treino específico
  fastify.get<{ Params: TrainingParams }>('/:id', async (req, reply) => {
    const { id } = req.params

    const training = await prisma.training.findUnique({
      where: { id },
      include: { exercises: true }
    });

    if (!training) {
      return reply.status(404).send({ error: "Treino não encontrado" })
    }

    return reply.send(training)
  });

  // Atualizar um treino
  fastify.put<{ Params: TrainingParams; Body: CreateTrainingBody }>('/:id', async (req, reply) => {
    const { id } = req.params
    const { name, description, bodyParts } = req.body

    try {
      const training = await prisma.training.update({
        where: { id },
        data: { name, description, bodyParts }
      });

      return reply.send(training)
    } catch (error) {
      console.error(error)
      return reply.status(400).send({ error: 'Erro ao atualizar treino' })
    }
  });

  // Excluir um treino
  fastify.delete<{ Params: TrainingParams }>('/:id', async (req, reply) => {
    const { id } = req.params
    try {
 
      const existingTraining = await prisma.training.findUnique({
        where: { id }
      });

      if (!existingTraining) {
        return reply.status(404).send({ error: 'Treino não encontrado' })
      }

      await prisma.training.delete({
        where: { id }
      });

      return reply.status(200).send({ message: 'Treino excluído com sucesso' })
    } catch (error) {
      console.error(error)
      return reply.status(400).send({ error: 'Erro ao excluir treino' })
    }
  });
}
