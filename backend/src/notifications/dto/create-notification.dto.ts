import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  userId: number;

  @IsString()
  @IsNotEmpty()
  mensaje: string;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsBoolean()
  leida?: boolean;
}
