import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { NgApexchartsModule, ChartComponent, ApexChart, ApexNonAxisChartSeries, ApexResponsive, ApexLegend, ApexDataLabels } from 'ng-apexcharts';

import { TasksService, Task } from '../../../core/services/tasks.service';
import { SubtasksService } from '../../../core/services/subtasks.service';
import { ProjectsService } from '../../../core/services/projects.service';
import { UsersService } from '../../../core/services/users.service';
import { LoginService } from '../../../auth/services/login.service';
import { ProjectResourcesService } from '../../../core/services/project-resources.service';
import { ProjectPlanningService, ProjectPlanning } from '../../../core/services/project-planning.service';
import { ProjectMilestonesService, ProjectMilestone } from '../../../core/services/project-milestones.service';
import { Subtask } from '../../../core/model/subtask.model';
import { User } from '../../../core/model/user.model';
import { ProjectResource } from '../../../core/model/project-resource.model';
import { ModalAddResourceComponent } from '../../modals/modal-add-resource/modal-add-resource.component';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from '../../components/calendar/calendar.component';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-resumen',
  standalone: true,
  templateUrl: './resumen.component.html',
  imports: [CommonModule, RouterLink, ModalAddResourceComponent, NgApexchartsModule, FormsModule, CalendarComponent],
  // Temporalmente sin OnPush para debug
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumenComponent implements OnInit {
  userName = '';
  projectName = '';
  projectCliente = 0;
  projectProgreso = 0;
  projectTiempoEstimado = '';
  projectMiembros: number[] = [];
  miembroNombres: { [id: number]: string } = {};
  projectDescripcion = '';
  tareasProximas: Task[] = [];
  allTasks: Task[] = [];
  userId = '';
  projectId: number | null = null;
  loading = true;
  downloadingReport = false;
  subtasksByTaskId = signal<{ [taskId: number]: Subtask[] }>({});

  // Tabs state
  activeTab: 'resumen' | 'recursos' | 'planificacion' = 'resumen';
  resourceTab: 'todos' | 'humano' | 'material' | 'financiero' = 'todos';

  // Resources state
  allResources: ProjectResource[] = [];
  loadingResources = false;
  showAddResourceModal = false;
  resourceToEdit: ProjectResource | null = null;

  // Planning state
  projectPlanning: ProjectPlanning | null = null;
  projectMilestones: ProjectMilestone[] = [];
  loadingPlanning = false;
  editingPlanning = false;
  newMilestone: Partial<ProjectMilestone> = {};
  showMilestoneForm = false;

  // Calendar state
  calendarTasks: any[] = [];
  userRole: string = 'admin';

  // Chart state
  @ViewChild('chart') chart?: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};

  // ─────────────────────────  computed properties ───────────────
  get roleBasePath(): string {
    const currentUser = this.loginService.getCurrentUser();
    const roleMap: { [key: string]: string } = {
      'Administrador': 'admin',
      'Líder de Proyecto': 'leader',
      'Empleado': 'employee',
      'Cliente': 'client'
    };
    return roleMap[currentUser?.rol || ''] || 'admin';
  }

  get canManageResources(): boolean {
    const user = this.loginService.getCurrentUser();
    return user?.rol !== 'Empleado' && user?.rol !== 'Cliente';
  }

  get canManagePlanning(): boolean {
    const user = this.loginService.getCurrentUser();
    return user?.rol !== 'Empleado' && user?.rol !== 'Cliente';
  }

  get canManageMilestones(): boolean {
    const user = this.loginService.getCurrentUser();
    return user?.rol !== 'Empleado' && user?.rol !== 'Cliente';
  }

  get canEditProject(): boolean {
    const user = this.loginService.getCurrentUser();
    return user?.rol === 'Administrador' || user?.rol === 'Líder de Proyecto';
  }

  get humanResources(): ProjectResource[] {
    return this.allResources.filter(r => r.tipo === 'humano');
  }

  get materialResources(): ProjectResource[] {
    return this.allResources.filter(r => r.tipo === 'material');
  }

  get financialResources(): ProjectResource[] {
    return this.allResources.filter(r => r.tipo === 'financiero');
  }

  get currentResources(): ProjectResource[] {
    switch (this.resourceTab) {
      case 'humano':
        return this.humanResources;
      case 'material':
        return this.materialResources;
      case 'financiero':
        return this.financialResources;
      default:
        return this.allResources;
    }
  }

  get totalCost(): number {
    const total = this.currentResources.reduce((sum, r) => {
      const cost = typeof r.costo === 'number' ? r.costo : 0;
      return sum + cost;
    }, 0);
    return Number(total) || 0;
  }

  get humanCost(): number {
    return this.humanResources.reduce((sum, r) => sum + (r.costo || 0), 0);
  }

  get materialCost(): number {
    return this.materialResources.reduce((sum, r) => sum + (r.costo || 0), 0);
  }

  get financialCost(): number {
    return this.financialResources.reduce((sum, r) => sum + (r.costo || 0), 0);
  }

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private tasksService: TasksService,
    private usersService: UsersService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private subtasksService: SubtasksService,
    private projectResourcesService: ProjectResourcesService,
    private projectPlanningService: ProjectPlanningService,
    private projectMilestonesService: ProjectMilestonesService
  ) {}

  ngOnInit() {
    // Get the logged-in user's ID from the login service
    const currentUserId = this.loginService.getCurrentUserId();
    this.userId = currentUserId ? currentUserId.toString() : '';

    // Set user role for calendar
    this.userRole = this.roleBasePath;

    this.route.paramMap.subscribe((params) => {
      // Use console.log to debug the URL and params

      // Try all possible param names
      let projectId: number | undefined;
      const possibleKeys = ['projectId', 'id', 'project'];
      for (const key of possibleKeys) {
        const val = params.get(key);
        if (val && !isNaN(Number(val))) {
          projectId = Number(val);
          break;
        }
      }

      // If no projectId found in params, try to extract it from URL
      if (!projectId) {
        const urlMatch = window.location.pathname.match(
          /\/project\/(\d+)\/resumen/
        );
        if (urlMatch && urlMatch[1]) {
          projectId = Number(urlMatch[1]);
        }
      }
      this.projectId = projectId ?? null;

      // Debug: log all route params

      if (!projectId) {
        console.error('No projectId found in route parameters');
        return;
      }

      // Load project resources
      this.loadProjectResources();

      // Load project planning
      this.loadProjectPlanning();

      // Fetch project details
      this.loading = true;
      this.projectsService
        .findOne(projectId)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.cdr.markForCheck(); // Mark component for change detection
          })
        )
        .subscribe({
          next: (project) => {
            this.projectName = project.nombre;
            this.projectCliente = project.creadoPorId || 0;
            this.projectProgreso = 25; // Placeholder
            this.projectTiempoEstimado = ''; // Placeholder
            this.projectDescripcion = project.descripcion || '';
            this.cdr.markForCheck(); // Mark component for change detection
          },
          error: (err) => {
            console.error('Error fetching project:', err);
            this.cdr.markForCheck();
          },
        });

      // Fetch all tasks for this project
      this.tasksService.findByProjectId(projectId).subscribe({
        next: (tasks) => {
          this.allTasks = tasks;
          // Sort by fechaVencimiento ascending, filter out completed
          this.tareasProximas = tasks
            .filter((t) => !t.completada)
            .sort((a, b) => {
              const aDate = a.fechaVencimiento
                ? new Date(a.fechaVencimiento).getTime()
                : Infinity;
              const bDate = b.fechaVencimiento
                ? new Date(b.fechaVencimiento).getTime()
                : Infinity;
              return aDate - bDate;
            })
            .slice(0, 3); // Show next 3 upcoming tasks

          // Prepare calendar tasks
          this.calendarTasks = tasks.map(task => ({
            id: task.id,
            nombre: task.nombre,
            descripcion: task.descripcion,
            fechaInicio: task.fechaInicio,
            fechaVencimiento: task.fechaVencimiento,
            prioridad: task.prioridad,
            estado: task.estado,
            projectId: projectId,
            projectName: this.projectName
          }));
          this.cdr.markForCheck();

          // Set miembros as the unique creators of the tasks
          const uniqueCreators = Array.from(
            new Set(tasks.map((t) => t.creadoPorId))
          );
          this.projectMiembros = uniqueCreators;

          // Fetch user names for each unique creator
          this.miembroNombres = {};
          let pendingRequests = uniqueCreators.length;

          if (pendingRequests === 0) {
            this.cdr.markForCheck();
          } else {
            uniqueCreators.forEach((userId) => {
              this.usersService.findOne(userId).subscribe({
                next: (user: User) => {
                  this.miembroNombres[userId] =
                    user.nombre || user.correoElectronico;
                  pendingRequests--;
                  if (pendingRequests === 0) {
                    this.cdr.markForCheck();
                  }
                },
                error: (err) => {
                  console.error(`Error fetching user ${userId}:`, err);
                  pendingRequests--;
                  if (pendingRequests === 0) {
                    this.cdr.markForCheck();
                  }
                },
              });
            });
          }

          // Fetch all subtasks for these tasks
          const taskIds = tasks.map((t) => t.id);
          let loaded = 0;
          const subtasksMap: { [taskId: number]: Subtask[] } = {};
          if (taskIds.length === 0) {
            this.subtasksByTaskId.set(subtasksMap);
          } else {
            taskIds.forEach((taskId) => {
              this.subtasksService.findByTaskId(taskId).subscribe({
                next: (subtasks: Subtask[]) => {
                  subtasksMap[taskId] = subtasks;
                  loaded++;
                  if (loaded === taskIds.length) {
                    this.subtasksByTaskId.set(subtasksMap);
                    this.cdr.markForCheck();
                  }
                },
                error: () => {
                  loaded++;
                  if (loaded === taskIds.length) {
                    this.subtasksByTaskId.set(subtasksMap);
                    this.cdr.markForCheck();
                  }
                },
              });
            });
          }

          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error fetching tasks:', err);
          this.cdr.markForCheck();
        },
      });
    });
  }

  daysLeft(date: string | Date): number {
    const now = new Date();
    const due = new Date(date);
    const diff = due.getTime() - now.getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  }

  getSubtaskProgressSignal(taskId: number) {
    return computed(() => {
      const subtasks = this.subtasksByTaskId()[taskId] || [];
      if (subtasks.length === 0) return null;
      const completed = subtasks.filter((s) => s.completada).length;
      return Math.round((completed / subtasks.length) * 100);
    });
  }

  // ============ FASE 3: Gestión de Recursos ============
  loadProjectResources() {
    if (!this.projectId) return;

    this.loadingResources = true;
    this.projectResourcesService.findByProjectId(this.projectId).subscribe({
      next: (resources) => {
        this.allResources = resources;
        this.loadingResources = false;
        this.updateCostChart();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading resources:', err);
        this.loadingResources = false;
        this.cdr.markForCheck();
      }
    });
  }

  updateCostChart() {
    // Calculate costs by type using getters
    const humanCost = this.humanCost;
    const materialCost = this.materialCost;
    const financialCost = this.financialCost;

    const total = humanCost + materialCost + financialCost;

    // Only show chart if there are resources with costs
    if (total === 0) {
      this.chartOptions = {};
      return;
    }

    this.chartOptions = {
      series: [humanCost, materialCost, financialCost],
      chart: {
        type: 'donut',
        height: 320,
        fontFamily: 'inherit',
      },
      labels: ['Recursos Humanos', 'Recursos Materiales', 'Recursos Financieros'],
      colors: ['#3b82f6', '#10b981', '#f59e0b'],
      legend: {
        position: 'bottom',
        fontSize: '14px',
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toFixed(1) + '%';
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  openAddResourceModal() {
    if (!this.projectId) {
      console.error('No se puede abrir el modal sin projectId');
      alert('Error: No se pudo identificar el proyecto. Por favor recarga la página.');
      return;
    }
    console.log('Abriendo modal, projectId:', this.projectId);
    this.resourceToEdit = null; // Modo creación
    this.showAddResourceModal = true;
    this.cdr.markForCheck();
  }

  openEditResourceModal(resource: ProjectResource) {
    console.log('Editando recurso:', resource);
    this.resourceToEdit = resource; // Modo edición
    this.showAddResourceModal = true;
    this.cdr.markForCheck();
  }

  closeAddResourceModal() {
    this.showAddResourceModal = false;
    this.resourceToEdit = null;
    this.cdr.markForCheck();
  }

  onResourceAdded() {
    // Reload resources after adding a new one
    this.loadProjectResources();
  }

  changeResourceTab(tab: 'todos' | 'humano' | 'material' | 'financiero') {
    console.log('=== CAMBIO DE TAB ===');
    console.log('Tab anterior:', this.resourceTab);
    console.log('Tab nuevo:', tab);
    console.log('Total recursos:', this.allResources.length);
    console.log('Humanos:', this.humanResources.length);
    console.log('Materiales:', this.materialResources.length);
    console.log('Financieros:', this.financialResources.length);

    this.resourceTab = tab;

    console.log('Recursos actuales después del cambio:', this.currentResources.length);
    console.log('============================');
  }

  formatCost(cost: number | null | undefined): string {
    if (cost === null || cost === undefined || isNaN(cost)) {
      return '0.00';
    }
    return cost.toFixed(2);
  }

  deleteResource(resourceId: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este recurso?')) {
      return;
    }

    this.projectResourcesService.remove(resourceId).subscribe({
      next: () => {
        // Remove from local array
        this.allResources = this.allResources.filter(r => r.id !== resourceId);
        this.updateCostChart();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error deleting resource:', err);
        alert('Error al eliminar el recurso. Por favor intenta de nuevo.');
      }
    });
  }

  // ============ FASE 3: Descargar reporte PDF ============
  downloadProjectReport() {
    if (!this.projectId || this.downloadingReport) {
      return;
    }

    this.downloadingReport = true;
    this.cdr.markForCheck();

    this.projectsService.downloadProjectReport(this.projectId)
      .pipe(
        finalize(() => {
          this.downloadingReport = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (blob: Blob) => {
          // Create a download link for the PDF blob
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `reporte-proyecto-${this.projectId}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error downloading project report:', err);
          alert('Error al descargar el reporte. Por favor intenta de nuevo.');
        }
      });
  }

  // ============ FASE 6: Gestión de Planificación ============
  createNewPlanning() {
    this.editingPlanning = true;
    this.projectPlanning = {
      projectId: this.projectId!,
      objetivos: '',
      alcance: '',
      presupuesto: 0,
      notas: ''
    } as any;
  }

  loadProjectPlanning() {
    if (!this.projectId) return;

    this.loadingPlanning = true;
    this.projectPlanningService.findByProjectId(this.projectId).subscribe({
      next: (planning) => {
        this.projectPlanning = planning;
        this.loadingPlanning = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading planning:', err);
        this.loadingPlanning = false;
        this.cdr.markForCheck();
      }
    });

    this.projectMilestonesService.findByProjectId(this.projectId).subscribe({
      next: (milestones) => {
        this.projectMilestones = milestones;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading milestones:', err);
      }
    });
  }

  savePlanning() {
    if (!this.projectId || !this.projectPlanning) return;

    const currentUserId = this.loginService.getCurrentUserId();

    // Preparar datos para enviar (convertir fechas si es necesario)
    const planningData: any = {
      objetivos: this.projectPlanning.objetivos,
      alcance: this.projectPlanning.alcance,
      presupuesto: this.projectPlanning.presupuesto,
      notas: this.projectPlanning.notas,
      fechaClaveInicio: this.projectPlanning.fechaClaveInicio ?
        (typeof this.projectPlanning.fechaClaveInicio === 'string' ?
          this.projectPlanning.fechaClaveInicio :
          this.projectPlanning.fechaClaveInicio.toISOString().split('T')[0]) :
        undefined,
      fechaClaveFin: this.projectPlanning.fechaClaveFin ?
        (typeof this.projectPlanning.fechaClaveFin === 'string' ?
          this.projectPlanning.fechaClaveFin :
          this.projectPlanning.fechaClaveFin.toISOString().split('T')[0]) :
        undefined
    };

    if (this.projectPlanning.id) {
      // Update existing
      this.projectPlanningService.update(this.projectPlanning.id, planningData).subscribe({
        next: (updated) => {
          this.projectPlanning = updated;
          this.editingPlanning = false;
          alert('Planificación actualizada correctamente');
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error updating planning:', err);
          alert('Error al actualizar la planificación');
        }
      });
    } else {
      // Create new
      const newPlanning: any = {
        ...planningData,
        projectId: this.projectId,
        creadoPorId: currentUserId
      };

      this.projectPlanningService.create(newPlanning).subscribe({
        next: (created) => {
          this.projectPlanning = created;
          this.editingPlanning = false;
          alert('Planificación creada correctamente');
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error creating planning:', err);
          alert('Error al crear la planificación');
        }
      });
    }
  }

  addMilestone() {
    if (!this.projectId || !this.newMilestone.nombre || !this.newMilestone.fechaObjetivo) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const milestone: any = {
      projectId: this.projectId,
      nombre: this.newMilestone.nombre,
      descripcion: this.newMilestone.descripcion || '',
      fechaObjetivo: this.newMilestone.fechaObjetivo,
      completado: false,
      orden: this.projectMilestones.length
    };

    this.projectMilestonesService.create(milestone).subscribe({
      next: (created) => {
        this.projectMilestones.push(created);
        this.newMilestone = {};
        this.showMilestoneForm = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error creating milestone:', err);
        alert('Error al crear el hito');
      }
    });
  }

  toggleMilestoneComplete(milestone: ProjectMilestone) {
    this.projectMilestonesService.complete(milestone.id).subscribe({
      next: (updated) => {
        const index = this.projectMilestones.findIndex(m => m.id === milestone.id);
        if (index !== -1) {
          this.projectMilestones[index] = updated;
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error completing milestone:', err);
        alert('Error al completar el hito');
      }
    });
  }

  deleteMilestone(milestoneId: number) {
    if (!confirm('¿Estás seguro de eliminar este hito?')) return;

    this.projectMilestonesService.remove(milestoneId).subscribe({
      next: () => {
        this.projectMilestones = this.projectMilestones.filter(m => m.id !== milestoneId);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error deleting milestone:', err);
        alert('Error al eliminar el hito');
      }
    });
  }
}
