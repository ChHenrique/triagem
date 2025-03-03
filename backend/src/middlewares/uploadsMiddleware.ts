import multer from 'fastify-multer';
import path from 'path';
import { FastifyRequest } from 'fastify';

// Configuração do armazenamento
const storage = multer.diskStorage({
    destination: (req: FastifyRequest, file: any, cb: (error: any, destination: string) => void) => {
        const uploadPath = path.join(__dirname, '..', 'uploads');
        console.log('Salvando em:', uploadPath);
        cb(null, uploadPath);  // Caminho onde o arquivo será salvo
    },
    filename: (req: FastifyRequest, file: any, cb: (error: any, filename: string) => void) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));  // Geração do nome único para o arquivo
    }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req: FastifyRequest, file: any, cb: (error: any, acceptFile: boolean) => void) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas arquivos de imagem são permitidos'), false);
    }
};

// Criando o middleware de upload
export const upload = multer({ storage, fileFilter });
