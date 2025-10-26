export interface Subtask {
  id: number;
  taskId: number;
  titulo: string;
  texto?: string;
  completada: boolean;
  tarea?: any;
}

export interface CreateSubtaskDto {
  taskId: number;
  titulo: string;
  texto?: string;
  completada?: boolean;
}

export interface UpdateSubtaskDto extends Partial<CreateSubtaskDto> {}
