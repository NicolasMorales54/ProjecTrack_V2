import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSubtaskDto {
  @IsInt()
  taskId: number;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  texto?: string;

  @IsOptional()
  @IsBoolean()
  completada?: boolean;
}
