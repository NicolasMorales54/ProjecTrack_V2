import { IsInt, IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateProjectPlanningDto {
  @IsInt()
  projectId: number;

  @IsOptional()
  @IsString()
  objetivos?: string;

  @IsOptional()
  @IsString()
  alcance?: string;

  @IsOptional()
  @IsNumber()
  presupuesto?: number;

  @IsOptional()
  @IsDateString()
  fechaClaveInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaClaveFin?: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsInt()
  creadoPorId?: number;
}
