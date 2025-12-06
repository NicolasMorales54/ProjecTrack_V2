import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Rol } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  nombreUsuario?: string;

  @IsOptional()
  @IsEmail()
  correoElectronico?: string;

  @IsOptional()
  @IsString()
  primerNombre?: string;

  @IsOptional()
  @IsString()
  primerApellido?: string;

  @IsOptional()
  @IsString()
  segundoNombre?: string;

  @IsOptional()
  @IsString()
  segundoApellido?: string;

  @IsOptional()
  @IsEnum(Rol)
  rol?: Rol;

  @IsOptional()
  @IsString()
  posicion?: string;
}
