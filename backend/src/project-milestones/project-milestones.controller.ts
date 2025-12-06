import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectMilestonesService } from './project-milestones.service';
import { CreateProjectMilestoneDto } from './dto/create-project-milestone.dto';
import { UpdateProjectMilestoneDto } from './dto/update-project-milestone.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('project-milestones')
@UseGuards(JwtAuthGuard)
export class ProjectMilestonesController {
  constructor(
    private readonly projectMilestonesService: ProjectMilestonesService,
  ) {}

  @Post()
  create(@Body() createProjectMilestoneDto: CreateProjectMilestoneDto) {
    return this.projectMilestonesService.create(createProjectMilestoneDto);
  }

  @Get()
  findAll() {
    return this.projectMilestonesService.findAll();
  }

  @Get('project/:projectId')
  findByProjectId(@Param('projectId') projectId: string) {
    return this.projectMilestonesService.findByProjectId(+projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectMilestonesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectMilestoneDto: UpdateProjectMilestoneDto,
  ) {
    return this.projectMilestonesService.update(+id, updateProjectMilestoneDto);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.projectMilestonesService.complete(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectMilestonesService.remove(+id);
  }
}
