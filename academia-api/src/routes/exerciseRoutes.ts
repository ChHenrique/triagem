import { FastifyInstance } from "fastify";
import { prisma } from '../models/prismaClient';
import { CreateExerciseBody } from "../models/exercises.models";
import { z } from "zod";
import { authMiddleware } from "../middlewares/authMiddleware"; // Importe o middleware

export async function exerciseRoutes(app: FastifyInstance) {
  // Aplica o authMiddleware a todas as rotas dentro deste escopo
  app.addHook('preHandler', authMiddleware);

  // Criar um exercício vinculado a um treino
  app.post("/", async (request, reply) => {
    const schema = z.object({
      name: z.string(),
      imageUrl: z.string().optional(),
      description: z.string(),
      repetitions: z.number().int().positive(),
      executions: z.number().int().positive(),
      restInterval: z.number().int().positive(),
      trainingId: z.string()
    });

    const data: CreateExerciseBody = schema.parse(request.body);

    const trainingExists = await prisma.training.findUnique({
      where: { id: data.trainingId }
    });

    if (!trainingExists) {
      return reply.status(404).send({ message: "Training not found" });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        description: data.description,
        repetitions: data.repetitions,
        executions: data.executions,
        restInterval: data.restInterval,
        trainingId: data.trainingId
      }
    });

    return reply.status(201).send(exercise);
  });

  // Listar todos os exercícios
  app.get("/", async () => {
    return await prisma.exercise.findMany();
  });

  // Obter um exercício específico
  app.get("/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    });

    const { id } = paramsSchema.parse(request.params);
    const exercise = await prisma.exercise.findUnique({ where: { id } });

    if (!exercise) {
      return reply.status(404).send({ message: "Exercise not found" });
    }

    return exercise;
  });

  // Atualizar um exercício
  app.put("/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    });

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      name: z.string().optional(),
      imageUrl: z.string().optional(),
      description: z.string().optional(),
      repetitions: z.number().int().positive().optional(),
      executions: z.number().int().positive().optional(),
      restInterval: z.number().int().positive().optional()
    });

    const data: Partial<CreateExerciseBody> = bodySchema.parse(request.body);

    try {
      const exercise = await prisma.exercise.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.imageUrl && { imageUrl: data.imageUrl }),
          ...(data.description && { description: data.description }),
          ...(data.repetitions !== undefined && { repetitions: data.repetitions }),
          ...(data.executions !== undefined && { executions: data.executions }),
          ...(data.restInterval !== undefined && { restInterval: data.restInterval })
        }
      });

      return exercise;
    } catch (error) {
      return reply.status(404).send({ message: "Exercise not found" });
    }
  });

  // Deletar um exercício
  app.delete("/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    });

    const { id } = paramsSchema.parse(request.params);

    try {
      await prisma.exercise.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      return reply.status(404).send({ message: "Exercise not found" });
    }
  });
}