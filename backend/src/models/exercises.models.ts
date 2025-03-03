export interface CreateExerciseBody {
    name: string;
    imageUrl?: string;
    description: string;
    repetitions: number;
    executions: number;
    restInterval: number;
    trainingId: string;
}
