import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectPlanningDto } from './create-project-planning.dto';

export class UpdateProjectPlanningDto extends PartialType(CreateProjectPlanningDto) {}
