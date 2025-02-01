// Defina a interface para o corpo da requisição
export interface CreateUserBody {
    id: string
    name: string
    email: string
    password: string
    phone: string
    photoUrl?: string; // A foto pode ser opcional
  }