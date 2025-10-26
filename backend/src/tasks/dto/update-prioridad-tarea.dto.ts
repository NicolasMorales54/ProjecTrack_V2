import { IsEnum } from 'class-validator';

import { Prioridad } from '../entities/task.entity';

export class UpdatePrioridadTareaDto {
  @IsEnum(Prioridad)
  prioridad: Prioridad;
}
