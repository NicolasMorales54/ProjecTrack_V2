import { IsEnum } from 'class-validator';

import { EstadoTarea } from '../entities/task.entity';

export class UpdateEstadoTareaDto {
  @IsEnum(EstadoTarea)
  estado: EstadoTarea;
}
