import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTimeRegisterDto {
  @IsInt()
  taskId: number;

  @IsInt()
  userId: number;

  @IsOptional()
  @IsDateString()
  tiempoInicio?: string;

  @IsOptional()
  @IsDateString()
  tiempoFin?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
