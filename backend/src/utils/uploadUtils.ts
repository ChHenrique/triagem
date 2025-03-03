import fs from 'fs';
import path from 'path';
import { FastifyRequest } from 'fastify';

export async function uploadPhoto(
    req: FastifyRequest,
    folderName: string,
    fileField: string = 'photo'
) {
    try {
        if (!req.isMultipart()) {
            throw new Error('Requisição não contém dados multipart/form-data');
        }

        const data = await req.file({ limits: { fileSize: 100 * 1024 * 1024 } });

        if (!data) {
            throw new Error('Nenhuma foto enviada');
        }

        if (!data.mimetype.startsWith('image/')) {
            throw new Error('Apenas arquivos de imagem são permitidos');
        }

        const buffer = await data.toBuffer();

        const fileInfo = {
            fieldname: data.fieldname,
            filename: `${Date.now()}-${data.filename}`,
            encoding: data.encoding,
            mimetype: data.mimetype,
            size: buffer.length,
        };

        const uploadPath = path.join(__dirname, '..', 'uploads', folderName);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        const filePath = path.join(uploadPath, fileInfo.filename);

        await fs.promises.writeFile(filePath, buffer);

        return fileInfo;
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erro no upload:', err);
            throw new Error(err.message || 'Erro ao processar o upload');
        } else {
            console.error('Erro desconhecido:', err);
            throw new Error('Erro ao processar o upload');
        }
    }
}