import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectResourcesService } from 'src/project-resources/project-resources.service';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ProjectsReportService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly projectResourcesService: ProjectResourcesService,
  ) {}

  // Helper methods for better PDF formatting
  private drawColoredBox(doc: any, x: number, y: number, width: number, height: number, color: string) {
    doc.save();
    doc.rect(x, y, width, height).fill(color);
    doc.restore();
  }

  private addSectionHeader(doc: any, title: string, color: string = '#4F46E5') {
    const currentY = doc.y;
    this.drawColoredBox(doc, 50, currentY - 5, 495, 30, color);
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#FFFFFF').text(title, 50, currentY, {
      width: 495,
      align: 'left',
      lineGap: 5
    });
    doc.fillColor('#000000');
    doc.moveDown(1.5);
  }

  private addInfoRow(doc: any, label: string, value: string, bold: boolean = false) {
    const font = bold ? 'Helvetica-Bold' : 'Helvetica';
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#4B5563').text(label + ': ', {
      continued: true,
    });
    doc.font(font).fillColor('#000000').text(value);
    doc.fillColor('#000000');
  }

  async generateProjectReport(projectId: number): Promise<Buffer> {
    // Obtener datos del proyecto con relaciones
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['creadoPor'],
    });

    if (!project) {
      throw new Error('Proyecto no encontrado');
    }

    // Obtener recursos del proyecto
    const resourcesSummary = await this.projectResourcesService.getResourcesSummaryByProject(projectId);

    // Obtener todas las tareas
    const tasks = await this.projectRepository.manager
      .getRepository('Task')
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.creadoPor', 'creador')
      .where('task.projectId = :projectId', { projectId })
      .orderBy('task.fechaInicio', 'ASC')
      .getMany();

    // Obtener asignaciones de tareas con sus usuarios
    const taskAssignments = await this.projectRepository.manager
      .getRepository('AsignacionTarea')
      .createQueryBuilder('asignacion')
      .leftJoinAndSelect('asignacion.usuario', 'usuario')
      .where('asignacion.taskId IN (:...taskIds)', {
        taskIds: tasks.length > 0 ? tasks.map(t => t.id) : [0]
      })
      .getMany();

    // Obtener todas las subtareas
    const subtasks = await this.projectRepository.manager
      .getRepository('Subtask')
      .createQueryBuilder('subtask')
      .where('subtask.taskId IN (:...taskIds)', {
        taskIds: tasks.length > 0 ? tasks.map(t => t.id) : [0]
      })
      .getMany();

    // Obtener miembros del proyecto
    const projectUsers = await this.projectRepository.manager
      .getRepository('UsuarioProyecto')
      .createQueryBuilder('up')
      .leftJoinAndSelect('up.usuario', 'usuario')
      .where('up.proyectoId = :projectId', { projectId })
      .getMany();

    // Crear documento PDF
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    return new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      doc.on('error', reject);

      // ===== CONTENIDO DEL PDF =====

      // ========== HEADER ==========
      this.drawColoredBox(doc, 0, 0, 595, 80, '#6366F1');
      doc.fontSize(26).font('Helvetica-Bold').fillColor('#FFFFFF')
        .text('REPORTE DE PROYECTO', 50, 25, { align: 'center' });
      doc.fontSize(10).font('Helvetica')
        .text(`Generado el ${new Date().toLocaleDateString('es-ES', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })}`, { align: 'center' });
      doc.fillColor('#000000');
      doc.moveDown(3);

      // ========== 1. INFORMACIÓN DEL PROYECTO ==========
      this.addSectionHeader(doc, '📋 INFORMACIÓN DEL PROYECTO', '#6366F1');

      this.addInfoRow(doc, 'Nombre del Proyecto', project.nombre, true);
      this.addInfoRow(doc, 'Descripción', project.descripcion || 'Sin descripción');
      this.addInfoRow(doc, 'Estado Actual', project.estado, true);
      this.addInfoRow(doc, 'Creado por',
        `${project.creadoPor?.primerNombre || ''} ${project.creadoPor?.primerApellido || ''} (${project.creadoPor?.correoElectronico || 'N/A'})`);
      this.addInfoRow(doc, 'Fecha de Inicio',
        project.fechaInicio ? new Date(project.fechaInicio).toLocaleDateString('es-ES') : 'No definida');
      this.addInfoRow(doc, 'Fecha de Finalización',
        project.fechaFin ? new Date(project.fechaFin).toLocaleDateString('es-ES') : 'No definida');

      doc.moveDown(2);

      // ========== 2. EQUIPO DEL PROYECTO ==========
      this.addSectionHeader(doc, '👥 EQUIPO DEL PROYECTO', '#8B5CF6');

      if (projectUsers.length > 0) {
        doc.fontSize(10).font('Helvetica-Bold').text(`Total de miembros: ${projectUsers.length}`);
        doc.moveDown(0.5);

        projectUsers.forEach((pu, idx) => {
          const user = pu.usuario;
          doc.fontSize(9).font('Helvetica-Bold')
            .text(`${idx + 1}. ${user.primerNombre} ${user.primerApellido}`, { continued: true });
          doc.font('Helvetica').fillColor('#4B5563')
            .text(` - ${pu.rolEnProyecto || 'Sin rol'} (${user.correoElectronico})`);
          doc.fillColor('#000000');
        });
      } else {
        doc.fontSize(10).font('Helvetica').fillColor('#6B7280')
          .text('No hay miembros asignados al proyecto');
        doc.fillColor('#000000');
      }

      doc.moveDown(2);

      // ========== 3. RECURSOS DEL PROYECTO ==========
      this.addSectionHeader(doc, '💰 RECURSOS DEL PROYECTO', '#10B981');

      doc.fontSize(10).font('Helvetica');
      this.addInfoRow(doc, 'Recursos Humanos', `${resourcesSummary.humanos.length} recursos`);
      this.addInfoRow(doc, 'Recursos Materiales', `${resourcesSummary.materiales.length} recursos`);
      this.addInfoRow(doc, 'Recursos Financieros', `${resourcesSummary.financieros.length} recursos`);
      this.addInfoRow(doc, 'Costo Total Estimado', `$${resourcesSummary.costoTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, true);

      // Detalles de recursos si existen
      if (resourcesSummary.humanos.length > 0 || resourcesSummary.materiales.length > 0 || resourcesSummary.financieros.length > 0) {
        doc.moveDown(1);
        doc.fontSize(11).font('Helvetica-Bold').text('Desglose de Recursos:');
        doc.moveDown(0.5);

        const allResources = [...resourcesSummary.humanos, ...resourcesSummary.materiales, ...resourcesSummary.financieros];
        allResources.slice(0, 10).forEach((resource) => {
          doc.fontSize(9).font('Helvetica');
          const assignedTo = resource.subtareaId ? 'Subtarea' : resource.tareaId ? 'Tarea específica' : 'Proyecto general';
          doc.text(`• ${resource.nombre} (${resource.tipo}) - ${assignedTo}`, { indent: 10 });
          if (resource.costo) {
            doc.fillColor('#059669').text(`  Costo: $${Number(resource.costo).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, { indent: 20 });
            doc.fillColor('#000000');
          }
        });

        if (allResources.length > 10) {
          doc.fontSize(9).fillColor('#6B7280').text(`... y ${allResources.length - 10} recursos más`);
          doc.fillColor('#000000');
        }
      }

      doc.moveDown(2);

      // ========== 4. ESTADÍSTICAS DE TAREAS ==========
      this.addSectionHeader(doc, '📊 ESTADÍSTICAS DE TAREAS', '#F59E0B');

      const tareasCompletadas = tasks.filter(t => t.estado === 'Completada').length;
      const tareasEnProgreso = tasks.filter(t => t.estado === 'En Progreso').length;
      const tareasPorHacer = tasks.filter(t => t.estado === 'Por Hacer').length;
      const tareasBloqueadas = tasks.filter(t => t.estado === 'Bloqueada').length;

      const prioridadAlta = tasks.filter(t => t.prioridad === 'Alta').length;
      const prioridadMedia = tasks.filter(t => t.prioridad === 'Media').length;
      const prioridadBaja = tasks.filter(t => t.prioridad === 'Baja').length;

      const totalSubtasks = subtasks.length;
      const subtareasCompletadas = subtasks.filter(s => s.completada).length;

      doc.fontSize(10).font('Helvetica');
      this.addInfoRow(doc, 'Total de Tareas', `${tasks.length} tareas`, true);
      doc.fontSize(9);
      doc.fillColor('#059669').text(`  ✓ Completadas: ${tareasCompletadas}`, { indent: 20 });
      doc.fillColor('#000000');
      doc.fillColor('#3B82F6').text(`  ⏳ En Progreso: ${tareasEnProgreso}`, { indent: 20 });
      doc.fillColor('#000000');
      doc.fillColor('#6B7280').text(`  ⭕ Por Hacer: ${tareasPorHacer}`, { indent: 20 });
      doc.fillColor('#000000');
      if (tareasBloqueadas > 0) {
        doc.fillColor('#DC2626').text(`  ⛔ Bloqueadas: ${tareasBloqueadas}`, { indent: 20 });
        doc.fillColor('#000000');
      }

      doc.moveDown(0.5);
      doc.fontSize(10);
      this.addInfoRow(doc, 'Distribución por Prioridad', '');
      doc.fontSize(9);
      doc.text(`  🔴 Alta: ${prioridadAlta} | 🟡 Media: ${prioridadMedia} | 🟢 Baja: ${prioridadBaja}`, { indent: 20 });

      doc.moveDown(0.5);
      doc.fontSize(10);
      this.addInfoRow(doc, 'Total de Subtareas', `${totalSubtasks} subtareas`);
      doc.fontSize(9);
      doc.text(`  ✓ Completadas: ${subtareasCompletadas} | ⏳ Pendientes: ${totalSubtasks - subtareasCompletadas}`, { indent: 20 });

      const progressPercent = tasks.length > 0 ? Math.round((tareasCompletadas / tasks.length) * 100) : 0;
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold');
      this.addInfoRow(doc, 'Progreso General del Proyecto', `${progressPercent}%`, true);

      doc.moveDown(2);

      // ========== 5. LISTA DETALLADA DE TAREAS ==========
      if (tasks.length > 0) {
        doc.addPage();
        this.addSectionHeader(doc, '📝 DETALLE DE TAREAS', '#6366F1');

        tasks.forEach((task, index) => {
          // Check if we need a new page
          if (doc.y > 700) {
            doc.addPage();
          }

          // Task header with colored background based on status
          const statusColors: any = {
            'Completada': '#D1FAE5',
            'En Progreso': '#DBEAFE',
            'Por Hacer': '#F3F4F6',
            'Bloqueada': '#FEE2E2'
          };
          const bgColor = statusColors[task.estado] || '#F3F4F6';

          this.drawColoredBox(doc, 50, doc.y, 495, 25, bgColor);
          doc.fontSize(11).font('Helvetica-Bold').fillColor('#1F2937')
            .text(`${index + 1}. ${task.nombre}`, 55, doc.y + 5, { width: 485 });
          doc.fillColor('#000000');
          doc.moveDown(1.5);

          // Task details
          doc.fontSize(9).font('Helvetica');
          doc.text(`Estado: ${task.estado} | Prioridad: ${task.prioridad}`, { indent: 10 });

          if (task.descripcion) {
            doc.text(`Descripción: ${task.descripcion.substring(0, 200)}${task.descripcion.length > 200 ? '...' : ''}`, { indent: 10 });
          }

          doc.text(
            `Periodo: ${task.fechaInicio ? new Date(task.fechaInicio).toLocaleDateString('es-ES') : 'N/A'} - ${task.fechaVencimiento ? new Date(task.fechaVencimiento).toLocaleDateString('es-ES') : 'N/A'}`,
            { indent: 10 }
          );

          // Assigned users
          const taskAssigs = taskAssignments.filter(a => a.taskId === task.id);
          if (taskAssigs.length > 0) {
            const assignedNames = taskAssigs
              .map(a => `${a.usuario?.primerNombre || ''} ${a.usuario?.primerApellido || ''}`.trim())
              .filter(name => name.length > 0)
              .join(', ');
            if (assignedNames) {
              doc.text(`Asignado a: ${assignedNames}`, { indent: 10 });
            }
          }

          // Subtasks for this task
          const taskSubtasks = subtasks.filter(s => s.taskId === task.id);
          if (taskSubtasks.length > 0) {
            doc.fontSize(9).font('Helvetica-Bold').text(`Subtareas (${taskSubtasks.length}):`, { indent: 10 });
            taskSubtasks.slice(0, 5).forEach(st => {
              const checkmark = st.completada ? '✓' : '○';
              doc.fontSize(8).font('Helvetica')
                .text(`${checkmark} ${st.titulo}`, { indent: 20 });
            });
            if (taskSubtasks.length > 5) {
              doc.fontSize(8).fillColor('#6B7280').text(`... y ${taskSubtasks.length - 5} subtareas más`, { indent: 20 });
              doc.fillColor('#000000');
            }
          }

          doc.moveDown(1);
        });
      }

      // ========== FOOTER EN TODAS LAS PÁGINAS ==========
      const range = doc.bufferedPageRange();
      const pageCount = range.count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(range.start + i);
        this.drawColoredBox(doc, 0, 762, 595, 30, '#6366F1');
        doc.fontSize(8).font('Helvetica').fillColor('#FFFFFF')
          .text(
            'Generado con Projectrack - Sistema de Gestión de Proyectos',
            50,
            770,
            { align: 'center', width: 495 }
          );
        doc.fontSize(8).text(`Página ${i + 1} de ${pageCount}`, 50, 782, { align: 'right', width: 495 });
      }

      // Finalizar documento
      doc.end();
    });
  }
}
