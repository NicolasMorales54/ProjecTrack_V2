import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TipoRecurso } from '../entities/project-resource.entity';

export class CreateProjectResourceDto {
  @IsNumber()
  @IsNotEmpty()
  proyectoId: number;

  @IsEnum(TipoRecurso)
  @IsNotEmpty()
  tipo: TipoRecurso;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  cantidad?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  costo?: number;

  @IsNumber()
  @IsOptional()
  tareaId?: number;

  @IsNumber()
  @IsOptional()
  subtareaId?: number;
}
