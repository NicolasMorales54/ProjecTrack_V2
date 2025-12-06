import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProjectResourcesService } from '../../../core/services/project-resources.service';
import { TipoRecurso, CreateProjectResourceDto, ProjectResource, UpdateProjectResourceDto } from '../../../core/model/project-resource.model';
import { TasksService, Task } from '../../../core/services/tasks.service';
import { SubtasksService } from '../../../core/services/subtasks.service';
import { Subtask } from '../../../core/model/subtask.model';

@Component({
  selector: 'app-modal-add-resource',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-add-resource.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalAddResourceComponent implements OnInit {
  @Input() projectId!: number;
  @Input() resourceToEdit: ProjectResource | null = null; // Para modo edición
  @Output() resourceAdded = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  // Exponer el enum al template
  TipoRecurso = TipoRecurso;

  // Form fields
  tipo: TipoRecurso | '' = '';
  nombre = '';
  descripcion = '';
  cantidad: number | null = null;
  costo: number | null = null;
  assignmentType: 'proyecto' | 'tarea' | 'subtarea' = 'proyecto';
  tareaId: number | null = null;
  subtareaId: number | null = null;

  // Data for dropdowns
  tasks: Task[] = [];
  subtasks: Subtask[] = [];
  filteredSubtasks: Subtask[] = [];

  loading = false;
  error = '';

  get isEditMode(): boolean {
    return !!this.resourceToEdit;
  }

  get modalTitle(): string {
    return this.isEditMode ? 'Editar Recurso' : 'Agregar Recurso';
  }

  constructor(
    private projectResourcesService: ProjectResourcesService,
    private tasksService: TasksService,
    private subtasksService: SubtasksService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Load tasks for this project
    this.loadTasks();

    if (this.resourceToEdit) {
      // Pre-llenar el formulario con los datos del recurso a editar
      this.tipo = this.resourceToEdit.tipo;
      this.nombre = this.resourceToEdit.nombre;
      this.descripcion = this.resourceToEdit.descripcion || '';
      this.cantidad = this.resourceToEdit.cantidad || null;
      this.costo = this.resourceToEdit.costo || null;

      // Determinar tipo de asignación
      if (this.resourceToEdit.subtareaId) {
        this.assignmentType = 'subtarea';
        this.subtareaId = this.resourceToEdit.subtareaId;
        this.tareaId = this.resourceToEdit.tareaId || null;
      } else if (this.resourceToEdit.tareaId) {
        this.assignmentType = 'tarea';
        this.tareaId = this.resourceToEdit.tareaId;
      } else {
        this.assignmentType = 'proyecto';
      }

      this.cdr.markForCheck();
    }
  }

  loadTasks() {
    if (this.projectId) {
      this.tasksService.findByProjectId(this.projectId).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.loadAllSubtasks();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error loading tasks:', err);
        }
      });
    }
  }

  loadAllSubtasks() {
    // Load subtasks for all tasks
    const subtaskRequests = this.tasks.map(task =>
      this.subtasksService.findByTaskId(task.id)
    );

    Promise.all(subtaskRequests.map(req => req.toPromise()))
      .then(results => {
        this.subtasks = results.flat().filter(Boolean) as Subtask[];
        this.onAssignmentTypeChange();
        this.cdr.markForCheck();
      })
      .catch(err => {
        console.error('Error loading subtasks:', err);
      });
  }

  onAssignmentTypeChange() {
    if (this.assignmentType === 'proyecto') {
      this.tareaId = null;
      this.subtareaId = null;
      this.filteredSubtasks = [];
    } else if (this.assignmentType === 'tarea') {
      this.subtareaId = null;
      this.filteredSubtasks = [];
    } else if (this.assignmentType === 'subtarea') {
      this.filteredSubtasks = this.subtasks;
    }
    this.cdr.markForCheck();
  }

  onTaskChange() {
    if (this.tareaId) {
      this.filteredSubtasks = this.subtasks.filter(s => s.taskId === this.tareaId);
    } else {
      this.filteredSubtasks = [];
    }
    this.subtareaId = null;
    this.cdr.markForCheck();
  }

  close() {
    this.resetForm();
    this.closeModal.emit();
  }

  resetForm() {
    this.tipo = '';
    this.nombre = '';
    this.descripcion = '';
    this.cantidad = null;
    this.costo = null;
    this.assignmentType = 'proyecto';
    this.tareaId = null;
    this.subtareaId = null;
    this.error = '';
    this.loading = false;
  }

  submit() {
    console.log('Submit llamado');
    console.log('Datos del formulario:', { tipo: this.tipo, nombre: this.nombre, projectId: this.projectId });

    // Validaciones
    if (!this.tipo || !this.nombre.trim()) {
      this.error = 'Por favor completa los campos requeridos';
      this.cdr.markForCheck();
      return;
    }

    if (!this.projectId && !this.isEditMode) {
      console.error('ProjectId inválido:', this.projectId);
      this.error = 'ID de proyecto no válido';
      this.cdr.markForCheck();
      return;
    }

    console.log('Iniciando guardado...');
    this.loading = true;
    this.error = '';
    this.cdr.markForCheck();

    if (this.isEditMode && this.resourceToEdit) {
      // Modo edición
      const updateDto: UpdateProjectResourceDto = {
        tipo: this.tipo as TipoRecurso,
        nombre: this.nombre.trim(),
        descripcion: this.descripcion?.trim() || undefined,
        cantidad: this.cantidad || undefined,
        costo: this.costo || undefined,
        tareaId: this.assignmentType === 'tarea' || this.assignmentType === 'subtarea'
          ? (this.tareaId ? Number(this.tareaId) : undefined)
          : undefined,
        subtareaId: this.assignmentType === 'subtarea'
          ? (this.subtareaId ? Number(this.subtareaId) : undefined)
          : undefined,
      };

      this.projectResourcesService.update(this.resourceToEdit.id, updateDto).subscribe({
        next: (response) => {
          console.log('Recurso actualizado exitosamente:', response);
          this.loading = false;
          this.resourceAdded.emit();
          this.close();
        },
        error: (err) => {
          console.error('Error al actualizar recurso:', err);
          this.error = 'Error al actualizar el recurso. Por favor intenta de nuevo.';
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
    } else {
      // Modo creación
      const createDto: CreateProjectResourceDto = {
        proyectoId: this.projectId,
        tipo: this.tipo as TipoRecurso,
        nombre: this.nombre.trim(),
        descripcion: this.descripcion?.trim() || undefined,
        cantidad: this.cantidad || undefined,
        costo: this.costo || undefined,
        tareaId: this.assignmentType === 'tarea' || this.assignmentType === 'subtarea'
          ? (this.tareaId ? Number(this.tareaId) : undefined)
          : undefined,
        subtareaId: this.assignmentType === 'subtarea'
          ? (this.subtareaId ? Number(this.subtareaId) : undefined)
          : undefined,
      };

      this.projectResourcesService.create(createDto).subscribe({
        next: (response) => {
          console.log('Recurso creado exitosamente:', response);
          this.loading = false;
          this.resourceAdded.emit();
          this.close();
        },
        error: (err) => {
          console.error('Error al crear recurso:', err);
          this.error = 'Error al crear el recurso. Por favor intenta de nuevo.';
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
    }
  }
}
