import { FastifyInstance } from 'fastify';
import { prisma } from '../models/prismaClient';
import { CreateTrainingBody } from '../models/training.model'; // Certifique-se de que isso contém o tipo correto.
import { uploadPhoto } from '../utils/uploadUtils';

interface TrainingParams {
  id: string;
}

interface UserTrainingBody {
  userId: string; // ID do usuário
}

export async function trainingRoutes(fastify: FastifyInstance) {
  // Criar um novo treino
  fastify.post<{ Body: CreateTrainingBody }>('/', async (req, reply) => {
    const { name, description, bodyParts } = req.body; // Não é necessário usar `|| {}` aqui, pois já garantimos que `req.body` terá a tipagem correta.

    let photoUrl: string | undefined = undefined;

    // Verifica se há um arquivo na requisição
    if (req.isMultipart()) {
      try {
        const fileInfo = await uploadPhoto(req, 'trainings');
        photoUrl = `/uploads/trainings/${fileInfo.filename}`;
      } catch (error) {
        if (error instanceof Error) {
          return reply.status(500).send({ error: error.message });
        } else {
          return reply.status(500).send({ error: 'Erro ao fazer upload da foto' });
        }
      }
    }

    // Cria o treino no banco de dados
    const training = await prisma.training.create({
      data: {
        name: name || '', // Valor default vazio caso não passe
        description: description || '',
        bodyParts: bodyParts || '', // Valor default vazio caso não passe
        photoUrl,
      },
    });

    return reply.send(training);
  });

  // Associar um treino existente a um usuário
  fastify.post<{ Params: TrainingParams; Body: UserTrainingBody }>('/:id/associate', async (req, reply) => {
    const { id } = req.params; // ID do treino que queremos associar
    const { userId } = req.body; // ID do usuário a ser associado

    try {
      // Verifica se o treino existe
      const trainingExists = await prisma.training.findUnique({
        where: { id },
      });

      if (!trainingExists) {
        return reply.status(404).send({ error: 'Treino não encontrado' });
      }

      // Verifica se o usuário existe
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }

      // Cria a associação entre o treino e o usuário
      const userTraining = await prisma.userTraining.create({
        data: {
          userId: userId,
          trainingId: id,
        },
      });

      return reply.send({ message: 'Treino associado com sucesso ao usuário', userTraining });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Erro ao associar treino ao usuário' });
    }
  });

  // Listar treinos
  fastify.get('/', async (req, reply) => {
    const trainings = await prisma.training.findMany({
      include: { exercises: true },
    });
    return reply.send(trainings);
  });

  // Detalhes de um treino específico
  fastify.get<{ Params: TrainingParams }>('/:id', async (req, reply) => {
    const { id } = req.params;

    const training = await prisma.training.findUnique({
      where: { id },
      include: { exercises: true },
    });

    if (!training) {
      return reply.status(404).send({ error: 'Treino não encontrado' });
    }

    return reply.send(training);
  });

  fastify.put<{ Params: TrainingParams; Body: Partial<CreateTrainingBody> }>('/:id', async (req, reply) => {
    const { id } = req.params;

    // Verificar se o treino existe
    const existingTraining = await prisma.training.findUnique({
        where: { id }
    });

    if (!existingTraining) {
        return reply.status(404).send({ error: 'Treino não encontrado' });
    }

    // Inicializa a URL da foto com a foto atual do treino
    let updatedPhotoUrl = existingTraining.photoUrl;

    // Prepara os dados a serem atualizados
    let updatedData: Partial<CreateTrainingBody> = {};

    // Verifica se o body contém dados para atualização
    const fields = req.body || {};
    if (fields.name) updatedData.name = fields.name; // Atualiza o nome se fornecido
    if (fields.description) updatedData.description = fields.description; // Atualiza a descrição se fornecido
    if (fields.bodyParts) updatedData.bodyParts = fields.bodyParts; // Atualiza as partes do corpo se fornecido

    // Verifica se há um arquivo de foto para upload
    if (req.isMultipart()) {
        try {
            const fileInfo = await uploadPhoto(req, 'trainings'); // 'trainings' é a pasta para armazenar as fotos
            updatedPhotoUrl = `/uploads/trainings/${fileInfo.filename}`; // Atualiza a URL da foto
        } catch (error) {
            return reply.status(500).send({ error: 'Erro ao fazer upload da foto' });
        }
    }

    // Se não houver dados a serem atualizados (nem campos nem foto), retorna erro
    if (!Object.keys(fields).length && updatedPhotoUrl === existingTraining.photoUrl) {
        return reply.status(400).send({ error: 'Nenhum dado enviado para atualização' });
    }

    try {
        // Atualiza o treino no banco de dados com os dados fornecidos
        const updatedTraining = await prisma.training.update({
            where: { id },
            data: {
                ...updatedData, // Dados atualizados (se houver)
                photoUrl: updatedPhotoUrl, // Atualiza a foto (se houver)
            },
        });

        return reply.send(updatedTraining);
    } catch (error) {
        console.error('Erro ao atualizar treino:', error);
        return reply.status(400).send({ error: 'Erro ao atualizar treino' });
    }
});

  

  // Excluir um treino
  fastify.delete<{ Params: TrainingParams }>('/:id', async (req, reply) => {
    const { id } = req.params;
    try {
      const existingTraining = await prisma.training.findUnique({
        where: { id },
      });

      if (!existingTraining) {
        return reply.status(404).send({ error: 'Treino não encontrado' });
      }

      await prisma.training.delete({
        where: { id },
      });

      return reply.status(200).send({ message: 'Treino excluído com sucesso' });
    } catch (error) {
      console.error(error);
      return reply.status(400).send({ error: 'Erro ao excluir treino' });
    }
  });
}
