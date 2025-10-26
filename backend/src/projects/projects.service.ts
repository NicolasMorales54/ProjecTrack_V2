import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';

import { AsignarUsuarioProyectoDto } from './dto/asignar-usuario-proyecto.dto';
import { UsuarioProyecto } from './entities/usuario-proyecto.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(UsuarioProyecto)
    private readonly usuarioProyectoRepository: Repository<UsuarioProyecto>,
  ) {}

  create(dto: CreateProjectDto) {
    const project = this.projectRepository.create(dto);
    return this.projectRepository.save(project);
  }

  findAll() {
    return this.projectRepository.find({ relations: ['creadoPor'] });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['creadoPor'],
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async update(id: number, dto: UpdateProjectDto) {
    await this.projectRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    // 1. Obtener todas las tareas del proyecto
    const tareas = await this.projectRepository.manager
      .getRepository('Task')
      .find({ where: { projectId: id } });
    const tareaIds = tareas.map((t) => t.id);

    // 2. Obtener todas las subtareas de las tareas
    let subtareaIds: number[] = [];
    if (tareaIds.length > 0) {
      const subtareas = await this.projectRepository.manager
        .getRepository('Subtask')
        .find({ where: { taskId: In(tareaIds) } });
      subtareaIds = subtareas.map((st) => st.id);
    }

    // 3. Eliminar asignaciones de subtareas
    if (subtareaIds.length > 0) {
      await this.projectRepository.manager
        .getRepository('AsignacionSubtarea')
        .delete({ subtaskId: In(subtareaIds) });
    }

    // 4. Eliminar subtareas
    if (subtareaIds.length > 0) {
      await this.projectRepository.manager
        .getRepository('Subtask')
        .delete({ id: In(subtareaIds) });
    }

    // 5. Eliminar asignaciones de tareas
    if (tareaIds.length > 0) {
      await this.projectRepository.manager
        .getRepository('AsignacionTarea')
        .delete({ taskId: In(tareaIds) });
    }

    // 6. Eliminar registros de tiempo
    if (tareaIds.length > 0) {
      await this.projectRepository.manager
        .getRepository('TimeRegister')
        .delete({ taskId: In(tareaIds) });
    }

    // 7. Eliminar tareas
    if (tareaIds.length > 0) {
      await this.projectRepository.manager
        .getRepository('Task')
        .delete({ id: In(tareaIds) });
    }

    // 8. Eliminar usuarios_proyectos
    await this.usuarioProyectoRepository.delete({ proyectoId: id });

    // 9. Eliminar el proyecto
    const project = await this.findOne(id);
    return this.projectRepository.remove(project);
  }

  async asignarUsuarioProyecto(dto: AsignarUsuarioProyectoDto) {
    const usuarioProyecto = this.usuarioProyectoRepository.create(dto);
    return this.usuarioProyectoRepository.save(usuarioProyecto);
  }

  async findByUserId(userId: number) {
    const userProjects = await this.usuarioProyectoRepository.find({
      where: { usuarioId: userId },
      relations: ['proyecto'],
    });
    return userProjects.map((up) => up.proyecto);
  }

  async groupByEstadoAndUserId(userId: number) {
    const userProjects = await this.usuarioProyectoRepository.find({
      where: { usuarioId: userId },
      relations: ['proyecto'],
    });
    const grouped = {};
    for (const up of userProjects) {
      const estado = up.proyecto.estado;
      if (!grouped[estado]) grouped[estado] = [];
      grouped[estado].push(up.proyecto);
    }
    return grouped;
  }

  async findUsersNotInProject(projectId: number) {
    // Get all user IDs in the project
    const userProjects = await this.usuarioProyectoRepository.find({
      where: { proyectoId: projectId },
      select: ['usuarioId'],
    });
    const userIdsInProject = userProjects.map((up) => up.usuarioId);
    // Find all users not in the project
    const usersRepo =
      this.usuarioProyectoRepository.manager.getRepository('User');
    const where =
      userIdsInProject.length > 0 ? { id: Not(In(userIdsInProject)) } : {};
    const users = await usersRepo.find({ where });
    return users;
  }
}
