import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTaskFileDto {
  @IsNumber()
  taskId: number;

  @IsString()
  nombre: string;

  @IsString()
  ruta: string;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsNumber()
  @IsOptional()
  tamano?: number;

  @IsNumber()
  @IsOptional()
  uploadedById?: number;
}
