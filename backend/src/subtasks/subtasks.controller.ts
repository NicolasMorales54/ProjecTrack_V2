import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { AsignacionSubtarea } from './entities/asignacion-subtarea.entity';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { SubtasksService } from './subtasks.service';

@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post()
  create(@Body() createSubtaskDto: CreateSubtaskDto) {
    return this.subtasksService.create(createSubtaskDto);
  }

  @Get()
  findAll() {
    return this.subtasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subtasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubtaskDto: UpdateSubtaskDto) {
    return this.subtasksService.update(+id, updateSubtaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subtasksService.remove(+id);
  }

  @Get('by-task/:taskId')
  findByTaskId(@Param('taskId') taskId: string) {
    return this.subtasksService.findByTaskId(+taskId);
  }

  @Get('by-project/:projectId')
  findByProjectId(@Param('projectId') projectId: string) {
    return this.subtasksService.findByProjectId(+projectId);
  }

  @Post('by-task/:taskId')
  createForTask(
    @Param('taskId') taskId: string,
    @Body() dto: CreateSubtaskDto,
  ) {
    return this.subtasksService.createForTask(+taskId, dto);
  }

  @Patch('by-task/:taskId/:id')
  updateForTask(
    @Param('taskId') taskId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSubtaskDto,
  ) {
    return this.subtasksService.updateForTask(+taskId, +id, dto);
  }

  @Patch('by-project/:projectId/:id')
  updateForProject(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSubtaskDto,
  ) {
    return this.subtasksService.updateForProject(+projectId, +id, dto);
  }

  @Get(':id/assignments')
  async getAssignmentsAndCreator(@Param('id') id: string) {
    return this.subtasksService.getSubtaskWithAssignmentsAndCreator(+id);
  }

  @Post(':id/assignments')
  async assignUserToSubtask(
    @Param('id') id: string,
    @Body() body: { userId: number },
  ) {
    return this.subtasksService.assignUserToSubtask(+id, body.userId);
  }
}
