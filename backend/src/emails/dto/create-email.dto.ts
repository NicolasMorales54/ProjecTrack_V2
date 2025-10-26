import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmailDto {
  @IsInt()
  destinatarioId: number;

  @IsInt()
  remitenteId: number;

  @IsString()
  @IsNotEmpty()
  asunto: string;

  @IsString()
  @IsNotEmpty()
  cuerpo: string;
}
