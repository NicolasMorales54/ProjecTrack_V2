import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Length, Max, Min, } from 'class-validator';

import { EstadoTarea, Prioridad } from '../entities/task.entity';


export class CreateTaskDto {
  @IsInt()
  projectId: number;

  @IsString()
  @Length(3, 255)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @IsEnum(EstadoTarea)
  estado: EstadoTarea;

  @IsEnum(Prioridad)
  prioridad: Prioridad;

  @IsInt()
  creadoPorId: number;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @Min(0)
  @Max(100)
  calificacionRevision?: number;

  @IsOptional()
  completada?: boolean;

  @IsOptional()
  solicitudRevision?: boolean;
}
