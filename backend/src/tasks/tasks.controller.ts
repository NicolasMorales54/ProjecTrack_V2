import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CreateAsignacionTareaDto } from './dto/create-asignacion-tarea.dto';
import { UpdatePrioridadTareaDto } from './dto/update-prioridad-tarea.dto';
import { UpdateEstadoTareaDto } from './dto/update-estado-tarea.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.tasksService.findByUserId(+userId);
  }

  @Get('project/:projectId')
  findByProjectId(@Param('projectId') projectId: string) {
    return this.tasksService.findByProjectId(+projectId);
  }

  @Get('project/:projectId/:id')
  findOneByProjectId(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.tasksService.findOneByProjectId(+projectId, +id);
  }

  @Get('user/:userId/:id')
  findOneByUserId(@Param('userId') userId: string, @Param('id') id: string) {
    return this.tasksService.findOneByUserId(+userId, +id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Patch(':id/estado')
  updateEstado(
    @Param('id') id: string,
    @Body() updateEstadoTareaDto: UpdateEstadoTareaDto,
  ) {
    return this.tasksService.updateEstado(+id, updateEstadoTareaDto);
  }

  @Patch(':id/prioridad')
  updatePrioridad(
    @Param('id') id: string,
    @Body() updatePrioridadTareaDto: UpdatePrioridadTareaDto,
  ) {
    return this.tasksService.updatePrioridad(+id, updatePrioridadTareaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }

  @Post('assign')
  asignarTarea(@Body() dto: CreateAsignacionTareaDto) {
    return this.tasksService.asignarTarea(dto);
  }
}
