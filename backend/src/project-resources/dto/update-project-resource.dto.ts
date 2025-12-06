import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectResourceDto } from './create-project-resource.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProjectResourceDto extends PartialType(CreateProjectResourceDto) {
  @IsBoolean()
  @IsOptional()
  asignado?: boolean;
}
