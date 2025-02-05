import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../models/prismaClient';
import { CreateUserBody } from '../models/user.model';
import { authMiddleware } from '../middlewares/authMiddleware';
import { hashPassword, checkEmailExists, sanitizeUserUpdate } from '../utils/userUtils';
import { JwtPayload } from '../@types/fastify';
import { uploadPhoto } from '../utils/uploadUtils';




export async function userRoutes(fastify: FastifyInstance) {
    // Listagem de todos os usuários
    fastify.get('/', { preHandler: authMiddleware }, async (req, reply) => {
        try {
            const users = await prisma.user.findMany();

            if (!users || users.length === 0) {
                return reply.status(404).send({ error: 'Nenhum usuário encontrado' });
            }

            return reply.send(users);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Erro ao listar usuários:', error);
                return reply.status(500).send({ error: error.message });
            } else {
                console.error('Erro desconhecido:', error);
                return reply.status(500).send({ error: 'Erro interno ao listar usuários' });
            }
        }
    });

    fastify.get<{ Params: { id: string } }>('/:id', { preHandler: authMiddleware }, async (req, reply) => {
        try {
            const { id } = req.params;

            const user = await prisma.user.findUnique({ where: { id } });
            if (!user) {
                return reply.status(404).send({ error: 'Usuário não encontrado' });
            }

            return reply.send(user);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Erro ao listar usuários:', error);
                return reply.status(500).send({ error: error.message });
            } else {
                console.error('Erro desconhecido:', error);
                return reply.status(500).send({ error: 'Erro interno ao listar usuários' });
            }
        }
    });


    fastify.post<{ Body: CreateUserBody }>('/register', async (req, reply) => {
        const { name, email, password, phone } = req.body || {}; // Dados do formulário
        
        if (!email || !password) {
            console.log(req.body); // Isso vai exibir o corpo da requisição para você verificar

            return reply.status(400).send({ error: 'Email e senha são obrigatórios' });
        }
    
        // Verificar se o email já está em uso
        if (await checkEmailExists(email)) {
            return reply.status(400).send({ error: 'Email já em uso' });
        }
    
        // Criptografando a senha
        const hashedPassword = await hashPassword(password);
    
        let photoUrlToSave: string | undefined = undefined;
    
        // Verificar se uma foto foi enviada
        if (req.isMultipart()) {
            try {
                const data = await req.file(); // Pega o arquivo enviado
                if (data) {
                    // Verifique se o arquivo é uma imagem
                    if (data.mimetype && data.mimetype.startsWith('image/')) {
                        const fileInfo = await uploadPhoto(req, 'usuarios');
                        photoUrlToSave = fileInfo ? `/uploads/usuarios/${fileInfo.filename}` : undefined;
                    } else {
                        return reply.status(400).send({ error: 'O arquivo enviado não é uma imagem' });
                    }
                }
            } catch (err) {
                return reply.status(500).send({ error: 'Erro ao fazer upload da foto' });
            }
        }
    
        // Criação do usuário no banco de dados
        const user = await prisma.user.create({
            data: {
                name: name || '', // Valor padrão vazio se não passado
                email,
                password: hashedPassword,
                phone: phone || '', // Valor padrão vazio se não passado
                photoUrl: photoUrlToSave,
            },
        });
    
        return reply.send(user);
    });
    
    

    // Exclusão de usuário
    fastify.delete<{ Params: { id: string } }>('/:id', { preHandler: authMiddleware }, async (req, reply) => {
        try {
            const { id } = req.params;

            const userExists = await prisma.user.findUnique({ where: { id } });
            if (!userExists) {
                return reply.status(404).send({ error: 'Usuário não encontrado' });
            }

            await prisma.user.delete({
                where: { id },
            });

            return reply.status(200).send({ message: 'Usuário excluído com sucesso' });
        } catch (error) {
            if (error instanceof Error) {
                console.error('Erro ao excluir usuário:', error);
                return reply.status(400).send({ error: error.message });
            } else {
                console.error('Erro desconhecido:', error);
                return reply.status(400).send({ error: 'Erro ao excluir usuário' });
            }
        }
    });

    fastify.get('/me', { preHandler: authMiddleware }, async (req: FastifyRequest, reply: FastifyReply) => {
        const user = req.user as JwtPayload;

        if (!user) {
            return reply.status(401).send({ error: 'Não autorizado' });
        }

        try {
            const userData = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!userData) {
                return reply.status(404).send({ error: 'Usuário não encontrado' });
            }

            return reply.send(userData);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Erro ao buscar usuário:', error);
                return reply.status(500).send({ error: error.message });
            } else {
                console.error('Erro desconhecido:', error);
                return reply.status(500).send({ error: 'Erro interno ao buscar os dados do usuário' });
            }
        }
    });
}