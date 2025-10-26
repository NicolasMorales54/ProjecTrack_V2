import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  IsInt,
  IsDateString,
} from 'class-validator';

import { EstadoProyecto } from '../entities/project.entity';

export class CreateProjectDto {
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
  fechaFin?: string;

  @IsOptional()
  @IsEnum(EstadoProyecto)
  estado?: EstadoProyecto;

  @IsInt()
  creadoPorId: number;
}
