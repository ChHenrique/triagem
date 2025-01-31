import fastifyJwt from 'fastify-jwt';

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'secret',
  sign: { expiresIn: '1h' },
};

// Função que registra o plugin de JWT
export function registerJwt(app: any) {
  app.register(fastifyJwt, jwtConfig);
}
