import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectMilestoneDto } from './create-project-milestone.dto';

export class UpdateProjectMilestoneDto extends PartialType(CreateProjectMilestoneDto) {}
