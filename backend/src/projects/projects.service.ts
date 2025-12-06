import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';

import { AsignarUsuarioProyectoDto } from './dto/asignar-usuario-proyecto.dto';
import { UsuarioProyecto } from './entities/usuario-proyecto.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';
import { ProjectHistory } from './entities/project-history.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(UsuarioProyecto)
    private readonly usuarioProyectoRepository: Repository<UsuarioProyecto>,
    @InjectRepository(ProjectHistory)
    private readonly projectHistoryRepository: Repository<ProjectHistory>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(dto: CreateProjectDto) {
    const project = this.projectRepository.create(dto);
    const savedProject = await this.projectRepository.save(project);

    // Registrar en historial
    await this.addToHistory(
      savedProject.id,
      'creado',
      `Proyecto "${savedProject.nombre}" creado`,
      dto.creadoPorId,
    );

    return savedProject;
  }

  findAll() {
    return this.projectRepository.find({
      relations: [
        'creadoPor',
        'archivadoPor',
        'eliminadoPor',
        'pausadoPor',
      ],
    });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: [
        'creadoPor',
        'archivadoPor',
        'eliminadoPor',
        'pausadoPor',
      ],
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async update(id: number, dto: UpdateProjectDto, usuarioId?: number) {
    const oldProject = await this.findOne(id);
    await this.projectRepository.update(id, dto);
    const updatedProject = await this.findOne(id);

    // Registrar cambios en el historial
    const cambios: string[] = [];
    const dtoAny = dto as any; // Type assertion to access properties

    if (dtoAny.nombre && dtoAny.nombre !== oldProject.nombre) {
      cambios.push(`Nombre cambiado de "${oldProject.nombre}" a "${dtoAny.nombre}"`);
    }
    if (dtoAny.estado && dtoAny.estado !== oldProject.estado) {
      cambios.push(`Estado cambiado de "${oldProject.estado}" a "${dtoAny.estado}"`);
    }
    if (dtoAny.fechaInicio) {
      cambios.push(`Fecha de inicio actualizada`);
    }
    if (dtoAny.fechaFin) {
      cambios.push(`Fecha de fin actualizada`);
    }

    if (cambios.length > 0) {
      await this.addToHistory(
        id,
        'actualizado',
        cambios.join(', '),
        usuarioId,
      );

      // Notificar a todos los usuarios del proyecto sobre el cambio
      const usuariosProyecto = await this.usuarioProyectoRepository.find({
        where: { proyectoId: id },
      });
      const descripcionCambios = cambios.join(', ');

      for (const up of usuariosProyecto) {
        // No notificar al usuario que hizo el cambio
        if (up.usuarioId !== usuarioId) {
          await this.notificationsGateway.notifyProjectUpdate(
            up.usuarioId,
            id,
            'actualizado',
            descripcionCambios,
          );
        }
      }
    }

    return updatedProject;
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

  async updateProjectUserRole(
    proyectoId: number,
    usuarioId: number,
    rolEnProyecto: string,
  ) {
    const usuarioProyecto = await this.usuarioProyectoRepository.findOne({
      where: { proyectoId, usuarioId },
    });

    if (!usuarioProyecto) {
      throw new NotFoundException(
        `User ${usuarioId} not found in project ${proyectoId}`,
      );
    }

    usuarioProyecto.rolEnProyecto = rolEnProyecto as any;
    return this.usuarioProyectoRepository.save(usuarioProyecto);
  }

  async removeUserFromProject(proyectoId: number, usuarioId: number) {
    const usuarioProyecto = await this.usuarioProyectoRepository.findOne({
      where: { proyectoId, usuarioId },
    });

    if (!usuarioProyecto) {
      throw new NotFoundException(
        `User ${usuarioId} not found in project ${proyectoId}`,
      );
    }

    return this.usuarioProyectoRepository.remove(usuarioProyecto);
  }

  // ============ HISTORIAL DE PROYECTOS ============

  async addToHistory(
    proyectoId: number,
    accion: string,
    descripcion: string,
    usuarioId?: number,
  ): Promise<ProjectHistory> {
    const historyEntry = this.projectHistoryRepository.create({
      proyectoId,
      accion,
      descripcion,
      usuarioId,
    });
    return await this.projectHistoryRepository.save(historyEntry);
  }

  async getProjectHistory(proyectoId: number): Promise<ProjectHistory[]> {
    return await this.projectHistoryRepository.find({
      where: { proyectoId },
      relations: ['usuario'],
      order: { fecha: 'DESC' },
    });
  }

  // Phase 3: Soft Delete
  async softDelete(id: number, usuarioId: number) {
    const project = await this.findOne(id);
    project.eliminado = true;
    project.eliminadoPorId = usuarioId;
    project.fechaEliminado = new Date();
    const updated = await this.projectRepository.save(project);

    // Registrar en historial
    await this.addToHistory(
      id,
      'eliminado',
      `Proyecto "${project.nombre}" marcado como eliminado`,
      usuarioId,
    );

    return updated;
  }

  // Phase 3: Change Estado
  async changeEstado(id: number, nuevoEstado: string, usuarioId: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['creadoPor'],
    });

    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }

    const estadoAnterior = project.estado;
    const updateData: any = { estado: nuevoEstado };

    // Registrar auditoría según el nuevo estado
    if (nuevoEstado === 'Archivado') {
      updateData.archivadoPorId = usuarioId;
      updateData.fechaArchivado = new Date();
    } else if (nuevoEstado === 'Pausado') {
      updateData.pausadoPorId = usuarioId;
      updateData.fechaPausado = new Date();
    }

    // Update using repository update to avoid TypeORM casting issues
    await this.projectRepository.update(id, updateData);

    // Registrar en historial
    await this.addToHistory(
      id,
      'cambio_estado',
      `Estado cambiado de "${estadoAnterior}" a "${nuevoEstado}"`,
      usuarioId,
    );

    // Return updated project
    return await this.findOne(id);
  }

  // FASE 6: Timeline endpoint - obtiene tareas y hitos ordenados cronológicamente
  async getTimeline(projectId: number) {
    const project = await this.findOne(projectId);

    // Obtener tareas del proyecto ordenadas por fecha
    const projectWithTasks = await this.projectRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.tareas', 't')
      .where('p.id = :projectId', { projectId })
      .select([
        'p.id',
        't.id',
        't.nombre',
        't.descripcion',
        't.fechaInicio',
        't.fechaVencimiento',
        't.estado',
        't.prioridad',
      ])
      .orderBy('t.fechaInicio', 'ASC')
      .getOne();

    return {
      projectId: project.id,
      projectName: project.nombre,
      tasks: (projectWithTasks as any)?.tareas || [],
    };
  }
}
