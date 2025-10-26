import { IsEnum, IsInt } from 'class-validator';

import { RolEnProyecto } from '../entities/usuario-proyecto.entity';

export class AsignarUsuarioProyectoDto {
  @IsInt()
  proyectoId: number;

  @IsInt()
  usuarioId: number;

  @IsEnum(RolEnProyecto)
  rolEnProyecto: RolEnProyecto;
}
