import fastifyJwt from 'fastify-jwt';

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'secret',
  sign: { expiresIn: '1h' },
  cookie: {
    cookieName: 'token', // Nome do cookie onde o token será procurado
    signed: false, // Se o cookie for assinado, ajuste conforme necessário
  },
};

// Função que registra o plugin de JWT
export function registerJwt(app: any) {
  app.register(fastifyJwt, jwtConfig);
}
