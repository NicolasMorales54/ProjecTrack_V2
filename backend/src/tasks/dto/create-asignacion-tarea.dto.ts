import { IsInt } from 'class-validator';

export class CreateAsignacionTareaDto {
  @IsInt()
  taskId: number;

  @IsInt()
  usuarioId: number;
}
