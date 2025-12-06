import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ProjectsService } from '../../core/services/projects.service';
import { TasksService, Task } from '../../core/services/tasks.service';
import { UsersService } from '../../core/services/users.service';
import { Project } from '../../core/model/project.model';
import { User } from '../../core/model/user.model';

@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './all-projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllProjectsComponent implements OnInit {
  allProjects: Project[] = [];
  allLeaders: User[] = [];
  projectTasks: { [projectId: number]: Task[] } = {};
  loading = true;
  activeTab: 'todos' | 'activos' | 'archivados' | 'completados' | 'pausados' | 'eliminados' = 'todos';
  searchTerm = '';
  selectedLeaderId: number | null = null;
  startDate = '';
  endDate = '';
  showChangeEstadoModal = false;
  selectedProject: Project | null = null;
  selectedEstado = '';

  constructor(
    private projectsService: ProjectsService,
    private tasksService: TasksService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAllProjects();
    this.loadLeaders();
  }

  loadAllProjects() {
    this.loading = true;
    this.projectsService.findAll().subscribe({
      next: (projects) => {
        this.allProjects = projects;
        this.loading = false;
        this.loadTasksForProjects(projects);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadLeaders() {
    this.usersService.findByRole('Líder de Proyecto').subscribe({
      next: (leaders: User[]) => {
        this.allLeaders = leaders;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Error loading leaders:', err);
      }
    });
  }

  loadTasksForProjects(projects: Project[]) {
    const taskObservables = projects.map(p =>
      this.tasksService.findByProjectId(p.id)
    );

    forkJoin(taskObservables).subscribe({
      next: (tasksArrays) => {
        projects.forEach((project, index) => {
          this.projectTasks[project.id] = tasksArrays[index] || [];
        });
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
      }
    });
  }

  get filteredProjects(): Project[] {
    let filtered = this.allProjects;

    // Filter by tab (estado and eliminado)
    if (this.activeTab === 'eliminados') {
      // Show only deleted projects
      filtered = filtered.filter(p => p.eliminado === true);
    } else if (this.activeTab !== 'todos') {
      // Show only non-deleted projects with specific estado
      filtered = filtered.filter(p => !p.eliminado);

      const estadoMap: { [key: string]: string[] } = {
        'activos': ['Abierto', 'En Progreso'],
        'archivados': ['Archivado'],
        'completados': ['Completado'],
        'pausados': ['Pausado']
      };

      const estados = estadoMap[this.activeTab];
      if (estados) {
        filtered = filtered.filter(p => p.estado && estados.includes(p.estado));
      }
    } else {
      // "Todos" tab: show only non-deleted projects
      filtered = filtered.filter(p => !p.eliminado);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.descripcion?.toLowerCase().includes(term)
      );
    }

    // Filter by leader
    if (this.selectedLeaderId) {
      filtered = filtered.filter(p => p.creadoPor?.id === this.selectedLeaderId);
    }

    // Filter by date range
    if (this.startDate) {
      const start = new Date(this.startDate);
      filtered = filtered.filter(p => {
        if (!p.fechaInicio) return false;
        const projectStart = new Date(p.fechaInicio);
        return projectStart >= start;
      });
    }

    if (this.endDate) {
      const end = new Date(this.endDate);
      filtered = filtered.filter(p => {
        if (!p.fechaInicio) return false;
        const projectStart = new Date(p.fechaInicio);
        return projectStart <= end;
      });
    }

    return filtered;
  }

  get todosCount(): number {
    return this.allProjects.length;
  }

  get activosCount(): number {
    return this.allProjects.filter(p => p.estado && ['Abierto', 'En Progreso'].includes(p.estado)).length;
  }

  get archivadosCount(): number {
    return this.allProjects.filter(p => p.estado === 'Archivado').length;
  }

  get completadosCount(): number {
    return this.allProjects.filter(p => p.estado === 'Completado').length;
  }

  get pausadosCount(): number {
    return this.allProjects.filter(p => p.estado === 'Pausado' && !p.eliminado).length;
  }

  get eliminadosCount(): number {
    return this.allProjects.filter(p => p.eliminado === true).length;
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.cdr.markForCheck();
  }

  onLeaderFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedLeaderId = select.value ? Number(select.value) : null;
    this.cdr.markForCheck();
  }

  onStartDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.startDate = input.value;
    this.cdr.markForCheck();
  }

  onEndDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.endDate = input.value;
    this.cdr.markForCheck();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedLeaderId = null;
    this.startDate = '';
    this.endDate = '';
    this.cdr.markForCheck();
  }

  getProjectProgress(projectId: number): number {
    const tasks = this.projectTasks[projectId] || [];
    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter(t => t.estado === 'Completada').length;
    return Math.round((completedTasks / tasks.length) * 100);
  }

  getEstadoBadgeClass(estado: string | undefined): string {
    if (!estado) return 'bg-gray-100 text-gray-700';
    const badgeMap: { [key: string]: string } = {
      'Abierto': 'bg-blue-100 text-blue-700',
      'En Progreso': 'bg-yellow-100 text-yellow-700',
      'Completado': 'bg-green-100 text-green-700',
      'Archivado': 'bg-gray-100 text-gray-700',
      'Pausado': 'bg-orange-100 text-orange-700'
    };
    return badgeMap[estado] || 'bg-gray-100 text-gray-700';
  }

  formatDate(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  downloadReport(projectId: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.projectsService.downloadProjectReport(projectId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-proyecto-${projectId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading report:', err);
        alert('Error al descargar el reporte.');
      }
    });
  }

  // Phase 3: Soft delete
  softDeleteProject(project: Project, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!confirm(`¿Estás seguro de eliminar permanentemente el proyecto "${project.nombre}"? Esta acción NO se puede deshacer.`)) {
      return;
    }

    this.projectsService.softDelete(project.id).subscribe({
      next: () => {
        this.loadAllProjects();
      },
      error: (err) => {
        console.error('Error deleting project:', err);
        alert('Error al eliminar el proyecto.');
      }
    });
  }

  // Phase 3: Open change estado modal
  openChangeEstadoModal(project: Project, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedProject = project;
    this.selectedEstado = project.estado || '';
    this.showChangeEstadoModal = true;
    this.cdr.markForCheck();
  }

  // Phase 3: Close change estado modal
  closeChangeEstadoModal() {
    this.showChangeEstadoModal = false;
    this.selectedProject = null;
    this.selectedEstado = '';
    this.cdr.markForCheck();
  }

  // Phase 3: Confirm estado change
  confirmChangeEstado() {
    if (!this.selectedProject || !this.selectedEstado) {
      return;
    }

    this.projectsService.changeEstado(this.selectedProject.id, this.selectedEstado).subscribe({
      next: () => {
        this.closeChangeEstadoModal();
        this.loadAllProjects();
      },
      error: (err) => {
        console.error('Error changing estado:', err);
        alert('Error al cambiar el estado.');
      }
    });
  }
}
