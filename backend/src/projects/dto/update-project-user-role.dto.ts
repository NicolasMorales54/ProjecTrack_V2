import { IsEnum } from 'class-validator';

import { RolEnProyecto } from '../entities/usuario-proyecto.entity';

export class UpdateProjectUserRoleDto {
  @IsEnum(RolEnProyecto)
  rolEnProyecto: RolEnProyecto;
}
