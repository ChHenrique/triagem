import { FastifyInstance } from 'fastify'
import { userRoutes } from './userRoutes'
import { trainingRoutes } from './trainingRoutes'
import { authRoutes } from './authRoutes'
import { authMiddleware } from '../middlewares/authMiddleware'
import { exerciseRoutes } from './exerciseRoutes'

export function registerRoutes(app: FastifyInstance) {
  // Rota de login (não precisa de autenticação)
  app.register(authRoutes, { prefix: '/auth' });

  // Rota de usuários (precisa de autenticação)
  app.register(userRoutes, {
    prefix: '/users',
    preHandler: authMiddleware
  });

  // Rota de exercícios (precisa de autenticação)
  app.register(exerciseRoutes, {
    prefix: '/exercises',
    preHandler: authMiddleware
  });

  // Rota de treinos (precisa de autenticação)
  app.register(trainingRoutes, {
    prefix: '/trainings',
    preHandler: authMiddleware
  });


}
