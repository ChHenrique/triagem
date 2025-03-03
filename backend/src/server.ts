import Fastify from 'fastify';
import { registerJwt } from './config/jwtConfig';
import { registerRoutes } from './routes/routes';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import path from 'path';
import fastifyStatic from '@fastify/static';
import multipart from '@fastify/multipart'; // Importe o plugin multipart

// Cria uma única instância do Fastify
const app = Fastify();
// Registrar o plugin multipart para processar uploads de arquivos
app.register(multipart);
// Registrar o plugin de cookies
app.register(cookie);

// Configuração do CORS
app.register(cors, {
  origin: true, // Permite qualquer origem (substitua por um domínio específico em produção)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Habilita o envio de cookies e outros dados de autenticação
});

// Registro do JWT
registerJwt(app);

// Registrar as rotas
registerRoutes(app);

// Configuração para servir arquivos estáticos (uploads)
app.register(fastifyStatic, {
  root: path.join(__dirname, 'uploads'), // Caminho relativo ao diretório atual
  prefix: '/uploads/', // Prefixo da URL
  decorateReply: false,  // Impede o fastify de tentar processar os arquivos como templates
});

// Inicializa o servidor
app.listen({ port: 3000, host: '0.0.0.0' }, (err: Error | null, address: string) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});