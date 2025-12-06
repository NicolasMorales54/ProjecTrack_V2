import {
  IsInt,
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateProjectMilestoneDto {
  @IsInt()
  projectId: number;

  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsDateString()
  fechaObjetivo: string;

  @IsOptional()
  @IsBoolean()
  completado?: boolean;

  @IsOptional()
  @IsDateString()
  fechaCompletado?: string;

  @IsOptional()
  @IsNumber()
  orden?: number;
}
