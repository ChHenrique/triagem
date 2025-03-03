export interface CreateTrainingBody {
  name: string;
  description: string;
  bodyParts: string;
  photoUrl?: string; // Adicione esta linha
}