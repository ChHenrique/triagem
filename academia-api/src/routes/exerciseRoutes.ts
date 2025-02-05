import { FastifyInstance } from "fastify";
import { prisma } from '../models/prismaClient';
import { CreateExerciseBody } from "../models/exercises.models";
import { z } from "zod";
import { authMiddleware } from "../middlewares/authMiddleware"; // Importe o middleware
import { uploadPhoto } from "../utils/uploadUtils"; // Importe a função de upload

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

    let photoUrl: string | undefined = undefined; // Garantindo que seja undefined

    // Verifica se há um arquivo na requisição
    if (request.isMultipart()) {
      try {
        const fileInfo = await uploadPhoto(request, 'exercises');
        photoUrl = `/uploads/exercises/${fileInfo.filename}`; // Atribui a URL da foto
      } catch (error) {
        return reply.status(500).send({ error: 'Erro ao fazer upload da foto' });
      }
    }
    
    // Caso não haja foto, photoUrl permanece como undefined

    const exercise = await prisma.exercise.create({
      data: {
        name: data.name,
        imageUrl: photoUrl, // Adiciona a foto
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
      const exercise = await prisma.exercise.findUnique({
        where: { id }
      });

      if (!exercise) {
        return reply.status(404).send({ message: "Exercise not found" });
      }

      // Definir a variável para a URL da foto
      let photoUrl: string | undefined = exercise.imageUrl || undefined; // Mantém a URL atual caso não seja enviada uma nova foto

      // Verifica se há um arquivo na requisição
      if (request.isMultipart()) {
        try {
          const fileInfo = await uploadPhoto(request, 'exercises');
          photoUrl = `/uploads/exercises/${fileInfo.filename}`; // Atualiza a URL da nova foto
        } catch (error) {
          return reply.status(500).send({ error: 'Erro ao fazer upload da foto' });
        }
      }

      // Atualiza o exercício com os novos dados
      const updatedExercise = await prisma.exercise.update({
        where: { id },
        data: {
          name: data.name ?? exercise.name,
          imageUrl: photoUrl, // Atualiza a foto
          description: data.description ?? exercise.description,
          repetitions: data.repetitions ?? exercise.repetitions,
          executions: data.executions ?? exercise.executions,
          restInterval: data.restInterval ?? exercise.restInterval
        }
      });

      return reply.send(updatedExercise);
    } catch (error) {
      return reply.status(404).send({ message: "Error updating exercise" });
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
