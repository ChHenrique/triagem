import Fastify from 'fastify';
import { registerJwt } from './config/jwtConfig';  
import { registerRoutes } from './routes/routes';  

const app = Fastify();

// Configuração do JWT
registerJwt(app);

// Registro das rotas
registerRoutes(app);

// Inicialização do servidor
app.listen({ port: 3000, host: '0.0.0.0' }, (err: Error | null, address: string) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});
