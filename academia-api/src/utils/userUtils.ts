import bcrypt from "bcryptjs"
import { prisma } from "../models/prismaClient"

// Função para criptografar senha
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Função para verificar se o email já está em uso
export async function checkEmailExists(email: string): Promise<boolean> {
  const userExists = await prisma.user.findUnique({ where: { email } })
  return !!userExists;
}

// Função para remover campos undefined antes de enviar pro Prisma
export function sanitizeUserUpdate(data: Partial<{ [key: string]: any }>): Partial<{ [key: string]: any }> {
  return Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
}


