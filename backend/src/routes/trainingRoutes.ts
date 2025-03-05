import { FastifyInstance } from 'fastify';
import { prisma } from '../models/prismaClient';
import { CreateTrainingBody } from '../models/training.model'; // Certifique-se de que isso contém o tipo correto.
import { uploadPhoto } from '../utils/uploadUtils';
import { startOfDay, endOfDay } from 'date-fns';

interface TrainingParams {
  id: string;
}

interface UserTrainingBody {
  userId: string; // ID do usuário
}

export async function trainingRoutes(fastify: FastifyInstance) {
  // Criar um novo treino
  fastify.post<{ Body: CreateTrainingBody }>('/', async (req, reply) => {
    const { name, description, bodyParts } = req.body; 

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

  // Desassociar um treino de um usuário
fastify.delete<{ Params: TrainingParams; Body: UserTrainingBody }>('/:id/dissociate', async (req, reply) => {
  const { id } = req.params; // ID do treino que queremos desassociar
  const { userId } = req.body; // ID do usuário a ser desassociado

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

    // Verifica se a associação entre o usuário e o treino existe
    const userTrainingExists = await prisma.userTraining.findUnique({
      where: {
        userId_trainingId: {
          userId: userId,
          trainingId: id,
        },
      },
    });

    if (!userTrainingExists) {
      return reply.status(404).send({ error: 'Associação não encontrada' });
    }

    // Exclui a associação entre o usuário e o treino
    await prisma.userTraining.delete({
      where: {
        userId_trainingId: {
          userId: userId,
          trainingId: id,
        },
      },
    });

    return reply.send({ message: 'Treino desassociado com sucesso do usuário' });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Erro ao desassociar treino do usuário' });
  }
});


  // Listar treinos no geral
  fastify.get('/', async (req, reply) => {
    const trainings = await prisma.training.findMany({
      include: {
        exercises: true,
        _count: { select: { clients: true } }, // Conta quantos usuários têm esse treino
      },
    });
  
    // Formatar resposta para incluir usersCount
    const formattedTrainings = trainings.map(t => ({
      ...t,
      usersCount: t._count.clients,
    }));
  
    return reply.send(formattedTrainings);
  });
  
  //pegando os dados de um treino em especifico pelo id
  fastify.get<{ Params: TrainingParams }>('/:id', async (req, reply) => {
    const { id } = req.params;
  
    const training = await prisma.training.findUnique({
      where: { id },
      include: {
        exercises: true,
        _count: { select: { clients: true } }, // Conta quantos usuários estão associados
      },
    });
  
    if (!training) {
      return reply.status(404).send({ error: 'Treino não encontrado' });
    }
  
    return reply.send({
      ...training,
      usersCount: training._count.clients, // Adiciona a contagem ao retorno
    });
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

  fastify.post<{ Body: { userId: string; trainingId: string; date?: string } }>(
    '/training-log',

    async (req, reply) => {
      try {
        const { userId, trainingId, date } = req.body;
  
        // Verifica se o usuário e o treino existem
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const training = await prisma.training.findUnique({ where: { id: trainingId } });
  
        if (!user || !training) {
          return reply.status(404).send({ error: 'Usuário ou treino não encontrado' });
        }
  
        // Cria o registro do treino realizado com a data personalizada ou a data atual
        const log = await prisma.trainingLog.create({
          data: {
            userId,
            trainingId,
            date: date ? new Date(date) : new Date(), // Se não passar data, usa a atual
          },
        });
  
        return reply.send(log);
      } catch (error) {
        console.error('Erro ao registrar treino:', error);
        return reply.status(500).send({ error: 'Erro ao registrar treino realizado' });
      }
    }
  );

  fastify.get<{ Params: { userId: string } }>('/training-log/:userId', async (req, reply) => {
    try {
      const { userId } = req.params;
  
      const logs = await prisma.trainingLog.findMany({
        where: { userId },
        include: {
          training: true, // Inclui os detalhes do treino
        },
        orderBy: { date: 'desc' }, // Ordena do mais recente para o mais antigo
      });
  
      if (logs.length === 0) {
        return reply.status(404).send({ error: 'Nenhum treino encontrado para este usuário' });
      }
  
      return reply.send(logs);
    } catch (error) {
      console.error('Erro ao buscar treinos realizados:', error);
      return reply.status(500).send({ error: 'Erro ao buscar treinos realizados' });
    }
  });

  // obter o numero de treinos por semana
  function getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
  
  
  fastify.get<{ Params: { userId: string } }>('/training-log/average/:userId', async (req, reply) => {
    try {
      const { userId } = req.params;
  
      // Calcula a data de 4 semanas atrás
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  
      // Busca os treinos realizados nas últimas 4 semanas
      const logs = await prisma.trainingLog.findMany({
        where: {
          userId,
          date: {
            gte: fourWeeksAgo, // Filtra treinos realizados a partir de 4 semanas atrás
          },
        },
      });
  
      // Agrupa os treinos por semana
      const weeksMap = new Map<number, number>(); // { Semana -> Quantidade de treinos }
      
      logs.forEach((log) => {
        const weekNumber = getWeekNumber(new Date(log.date)); // Calcula a semana do treino
        weeksMap.set(weekNumber, (weeksMap.get(weekNumber) || 0) + 1);
      });
  
      // Calcula a média
      const totalWeeks = weeksMap.size || 1; // Evita divisão por zero
      const average = logs.length / totalWeeks;
  
      return reply.send({ average });
    } catch (error) {
      console.error('Erro ao calcular a média de treinos por semana:', error);
      return reply.status(500).send({ error: 'Erro ao calcular a média' });
    }
  });

  fastify.delete<{ Params: { logId: string } }>('/training-log/:logId', async (req, reply) => {
    try {
      const { logId } = req.params;
  
      // Verifica se o log existe antes de deletar
      const existingLog = await prisma.trainingLog.findUnique({ where: { id: logId } });
  
      if (!existingLog) {
        return reply.status(404).send({ error: 'Registro de treino não encontrado' });
      }
  
      // Deleta o log
      await prisma.trainingLog.delete({ where: { id: logId } });
  
      return reply.send({ message: 'Registro de treino deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar treino realizado:', error);
      return reply.status(500).send({ error: 'Erro ao deletar treino realizado' });
    }
  });

  fastify.get<{ Params: { userId: string; date: string } }>('/training-log/:userId/:date', async (req, reply) => {
    try {
      const { userId, date } = req.params;
  
      // Converte a data fornecida na URL para um objeto Date (que estará no fuso horário UTC)
      const targetDate = new Date(date);
      console.log('Data fornecida:', targetDate); // Aqui você pode verificar a data fornecida
  
      // Verifica se a data é válida
      if (isNaN(targetDate.getTime())) {
        return reply.status(400).send({ error: 'Data inválida' });
      }
  
      // Ajusta a data para o início e o final do dia no fuso horário UTC
      const startOfDayUTC = new Date(targetDate);
      startOfDayUTC.setUTCHours(0, 0, 0, 0);  // Início do dia em UTC
  
      const endOfDayUTC = new Date(targetDate);
      endOfDayUTC.setUTCHours(23, 59, 59, 999);  // Final do dia em UTC
  
      console.log('Início do dia UTC:', startOfDayUTC);
      console.log('Fim do dia UTC:', endOfDayUTC);
  
      // Busca os treinos realizados no intervalo da data ajustada para UTC
      const logs = await prisma.trainingLog.findMany({
        where: {
          userId,
          date: {
            gte: startOfDayUTC,  // Maior ou igual ao início do dia em UTC
            lt: endOfDayUTC,     // Menor que o final do dia em UTC
          },
        },
        include: {
          training: true, // Inclui os detalhes do treino
        },
      });
  
      // Se não encontrar nenhum treino para a data fornecida
      if (logs.length === 0) {
        return reply.status(404).send({ error: 'Nenhum treino encontrado para este usuário nesse dia' });
      }
  
      return reply.send(logs);
    } catch (error) {
      console.error('Erro ao buscar treino realizado:', error);
      return reply.status(500).send({ error: 'Erro ao buscar treino realizado' });
    }
  });
  
  
  
  
  
  
}
