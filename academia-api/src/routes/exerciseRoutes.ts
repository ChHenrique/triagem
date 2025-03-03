import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from '../models/prismaClient';
import { CreateExerciseBody } from "../models/exercises.models";
import { z } from "zod";
import { authMiddleware } from "../middlewares/authMiddleware"; // Importe o middleware
import { uploadPhoto } from "../utils/uploadUtils"; // Importe a função de upload

export async function exerciseRoutes(app: FastifyInstance) {
  // Aplica o authMiddleware a todas as rotas dentro deste escopo
  app.addHook('preHandler', authMiddleware);

  interface Params {
    id: string;
  }
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
        imageUrl: photoUrl,
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
app.put<{ Params: Params; Body: Partial<CreateExerciseBody> }>(
  "/:id",
  async (request, reply) => {

  const { id } = request.params; // Agora TypeScript sabe que id é uma string

  // Verificar se o exercício existe
  const existingExercise = await prisma.exercise.findUnique({
    where: { id }
  });

  if (!existingExercise) {
    return reply.status(404).send({ error: 'Exercício não encontrado' });
  }

  // Inicializa a URL da foto com a foto atual do exercício
  let updatedPhotoUrl = existingExercise.imageUrl;

  // Prepara os dados a serem atualizados
  let updatedData: Partial<CreateExerciseBody> = {};

  // Tipando corretamente o corpo da requisição
  const fields = request.body || {}; // Aqui estamos dizendo ao TypeScript que o corpo é do tipo CreateExerciseBody
  if (fields.name) updatedData.name = fields.name; // Atualiza o nome se fornecido
  if (fields.description) updatedData.description = fields.description; // Atualiza a descrição se fornecido
  if (fields.repetitions) updatedData.repetitions = fields.repetitions; // Atualiza repetições se fornecido
  if (fields.executions) updatedData.executions = fields.executions; // Atualiza execuções se fornecido
  if (fields.restInterval) updatedData.restInterval = fields.restInterval; // Atualiza intervalo se fornecido

  // Verifica se há um arquivo de foto para upload
  if (request.isMultipart()) {
    try {
      const fileInfo = await uploadPhoto(request, 'exercises'); // 'exercises' é a pasta para armazenar as fotos
      updatedPhotoUrl = `/uploads/exercises/${fileInfo.filename}`; // Atualiza a URL da foto
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao fazer upload da foto' });
    }
  }

  // Se não houver dados a serem atualizados (nem campos nem foto), retorna erro
  if (!Object.keys(fields).length && updatedPhotoUrl === existingExercise.imageUrl) {
    return reply.status(400).send({ error: 'Nenhum dado enviado para atualização' });
  }

  try {
    // Atualiza o exercício no banco de dados com os dados fornecidos
    const updatedExercise = await prisma.exercise.update({
      where: { id },
      data: {
        ...updatedData, // Dados atualizados (se houver)
        imageUrl: updatedPhotoUrl, // Atualiza a foto (se houver)
      },
    });

    return reply.send(updatedExercise);
  } catch (error) {
    console.error('Erro ao atualizar exercício:', error);
    return reply.status(400).send({ error: 'Erro ao atualizar exercício' });
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
