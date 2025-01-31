// Defina a interface para o corpo da requisição
export interface CreateUserBody {
    name: string;
    email: string;
    password: string;
    phone: string;
    photoUrl?: string;  // A foto pode ser opcional
  }