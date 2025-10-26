import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

import { Rol } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  nombreUsuario: string;

  @IsEmail()
  correoElectronico: string;

  @IsString()
  contrasena: string;

  @IsString()
  primerNombre: string;

  @IsString()
  primerApellido: string;

  @IsOptional()
  @IsString()
  segundoNombre?: string;

  @IsString()
  segundoApellido: string;

  @IsEnum(Rol)
  rol: Rol;

  @IsOptional()
  @IsString()
  posicion?: string;
}
