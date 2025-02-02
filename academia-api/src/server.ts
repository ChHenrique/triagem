import Fastify from 'fastify'
import { registerJwt } from './config/jwtConfig'
import { registerRoutes } from './routes/routes'
import cookie from '@fastify/cookie' 
import cors from '@fastify/cors'

const app = Fastify();

// Registrar o plugin de cookies
app.register(cookie);

// Configuração do CORS (importante garantir que o CORS permite o envio de cookies)
app.register(cors, {
  origin: true, // Permite qualquer origem (idealmente, substitua por um domínio específico em produção)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Habilita o envio de cookies e outros dados de autenticação
});

// Registro do JWT
registerJwt(app);

// Registrar as rotas
registerRoutes(app);

// Inicializa o servidor
app.listen({ port: 3000, host: '0.0.0.0' }, (err: Error | null, address: string) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
