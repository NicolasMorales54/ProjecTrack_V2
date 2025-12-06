import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  GanttModule,
  EditService,
  SelectionService,
  ToolbarService,
  FilterService,
  SortService,
  ExcelExportService,
  PdfExportService,
  EditSettingsModel,
  ToolbarItem
} from '@syncfusion/ej2-angular-gantt';

import { ProjectsService } from '../../../core/services/projects.service';
import { ProjectMilestonesService, ProjectMilestone } from '../../../core/services/project-milestones.service';
import { LoginService } from '../../../auth/services/login.service';

interface GanttTask {
  TaskID: number;
  TaskName: string;
  StartDate: Date;
  EndDate: Date;
  Duration?: number;
  Progress: number;
  Priority?: string;
  Predecessor?: string;
  isMilestone?: boolean;
}

@Component({
  selector: 'app-cronograma',
  standalone: true,
  imports: [CommonModule, GanttModule],
  providers: [EditService, SelectionService, ToolbarService, FilterService, SortService, ExcelExportService, PdfExportService],
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CronogramaComponent implements OnInit {
  projectId: number | null = null;
  projectName: string = '';
  loading = true;

  public data: GanttTask[] = [];
  public taskSettings: object = {
    id: 'TaskID',
    name: 'TaskName',
    startDate: 'StartDate',
    endDate: 'EndDate',
    duration: 'Duration',
    progress: 'Progress',
    dependency: 'Predecessor'
  };

  public editSettings: EditSettingsModel = {
    allowEditing: true,
    allowAdding: false,
    allowDeleting: false,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true
  };

  public toolbar: ToolbarItem[] = [
    'ZoomIn',
    'ZoomOut',
    'ZoomToFit',
    'PrevTimeSpan',
    'NextTimeSpan',
    'ExcelExport',
    'PdfExport'
  ];

  public timelineSettings: object = {
    topTier: { unit: 'Month', format: 'MMM yyyy' },
    bottomTier: { unit: 'Week', format: 'dd' }
  };

  public splitterSettings: object = {
    columnIndex: 3
  };

  public labelSettings: object = {
    leftLabel: 'TaskName',
    rightLabel: 'Progress'
  };

  public columns: object[] = [
    { field: 'TaskID', headerText: 'ID', width: 80 },
    { field: 'TaskName', headerText: 'Nombre de Tarea', width: 250 },
    { field: 'StartDate', headerText: 'Fecha Inicio', width: 120 },
    { field: 'EndDate', headerText: 'Fecha Fin', width: 120 },
    { field: 'Progress', headerText: 'Progreso (%)', width: 120 }
  ];

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private projectMilestonesService: ProjectMilestonesService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let projectId: number | undefined;
      const possibleKeys = ['projectId', 'id', 'project'];
      for (const key of possibleKeys) {
        const val = params.get(key);
        if (val && !isNaN(Number(val))) {
          projectId = Number(val);
          break;
        }
      }

      if (!projectId) {
        const urlMatch = window.location.pathname.match(/\/project\/(\d+)\/cronograma/);
        if (urlMatch && urlMatch[1]) {
          projectId = Number(urlMatch[1]);
        }
      }

      this.projectId = projectId ?? null;

      if (!projectId) {
        console.error('No projectId found in route parameters');
        this.loading = false;
        return;
      }

      this.loadProjectTimeline(projectId);
    });
  }

  loadProjectTimeline(projectId: number): void {
    this.loading = true;

    // Load project info
    this.projectsService.findOne(projectId).subscribe({
      next: (project) => {
        this.projectName = project.nombre;
      },
      error: (err) => {
        console.error('Error loading project:', err);
        this.loading = false;
      }
    });

    // Load timeline data
    this.projectsService.getTimeline(projectId).subscribe({
      next: (timeline) => {
        console.log('Timeline response:', timeline);

        // Validar si hay tareas
        if (!timeline || !timeline.tasks) {
          console.warn('No tasks found in timeline');
          this.data = [];
          this.loading = false;
          return;
        }

        const tasks: GanttTask[] = timeline.tasks.map((task: any, index: number) => {
          const startDate = task.fechaInicio ? new Date(task.fechaInicio) : new Date();
          const endDate = task.fechaVencimiento ? new Date(task.fechaVencimiento) : new Date();

          // Calculate progress based on task status
          let progress = 0;
          if (task.estado === 'Completada') {
            progress = 100;
          } else if (task.estado === 'En Progreso') {
            progress = 50;
          } else if (task.estado === 'Bloqueada') {
            progress = 0;
          }

          return {
            TaskID: task.id || index + 1,
            TaskName: task.nombre || 'Sin nombre',
            StartDate: startDate,
            EndDate: endDate,
            Progress: progress,
            Priority: task.prioridad,
            isMilestone: false
          };
        });

        // Load milestones and add them to the timeline
        this.projectMilestonesService.findByProjectId(projectId).subscribe({
          next: (milestones) => {
            console.log('[Cronograma] Milestones loaded:', milestones);
            const milestoneTaskId = tasks.length + 1;

            if (milestones && milestones.length > 0) {
              milestones.forEach((milestone, index) => {
                const milestoneDate = milestone.fechaObjetivo ? new Date(milestone.fechaObjetivo) : new Date();

                tasks.push({
                  TaskID: milestoneTaskId + index,
                  TaskName: `🏁 ${milestone.nombre}`,
                  StartDate: milestoneDate,
                  EndDate: milestoneDate,
                  Duration: 0,
                  Progress: milestone.completado ? 100 : 0,
                  isMilestone: true
                });
              });
            }

            this.data = tasks;

            // Pequeño delay para asegurar que Syncfusion se inicialice correctamente
            setTimeout(() => {
              this.loading = false;
              this.cdr.detectChanges(); // Forzar detección de cambios
              console.log('[Cronograma] Final data:', this.data);
            }, 200);
          },
          error: (err) => {
            console.error('[Cronograma] Error loading milestones:', err);
            // Aún así, mostrar las tareas aunque fallen los milestones
            this.data = tasks;

            setTimeout(() => {
              this.loading = false;
              console.log('[Cronograma] Showing tasks without milestones');
            }, 100);
          }
        });
      },
      error: (err) => {
        console.error('Error loading timeline:', err);
        this.loading = false;
      }
    });
  }

  onTaskbarEdited(args: any): void {
    console.log('Taskbar edited:', args);
    // TODO: Update task dates in backend
    // const taskId = args.data.TaskID;
    // const newStartDate = args.data.StartDate;
    // const newEndDate = args.data.EndDate;
    // this.tasksService.update(taskId, { fechaInicio: newStartDate, fechaVencimiento: newEndDate }).subscribe();
  }

  onToolbarClick(args: any): void {
    console.log('Toolbar clicked:', args);
  }
}
