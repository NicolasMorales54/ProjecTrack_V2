import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../../core/services/tasks.service';

@Component({
  selector: 'app-modal-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-edit-task.component.html'
})
export class ModalEditTaskComponent implements OnInit {
  @Input() task: any;
  @Input() projectId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<any>();

  nombre: string = '';
  descripcion: string = '';
  fechaInicio: string = '';
  fechaVencimiento: string = '';
  prioridad: string = 'Media';
  categoria: string = '';
  estado: string = 'Por Hacer';

  loading: boolean = false;
  error: string = '';

  prioridades = ['Alta', 'Media', 'Baja'];
  estados = ['Por Hacer', 'En Progreso', 'Completada', 'Bloqueada'];

  constructor(
    private tasksService: TasksService
  ) {}

  ngOnInit() {
    if (this.task) {
      this.nombre = this.task.nombre || '';
      this.descripcion = this.task.descripcion || '';
      this.fechaInicio = this.task.fechaInicio ? this.formatDateForInput(this.task.fechaInicio) : '';
      this.fechaVencimiento = this.task.fechaVencimiento ? this.formatDateForInput(this.task.fechaVencimiento) : '';
      this.prioridad = this.task.prioridad || 'Media';
      this.categoria = this.task.categoria || '';
      this.estado = this.task.estado || 'Por Hacer';
    }

    // Removed loadProjectUsers() - not needed for basic task editing
  }

  formatDateForInput(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (!this.nombre.trim()) {
      this.error = 'El nombre de la tarea es requerido';
      return;
    }

    this.loading = true;
    this.error = '';

    const updateData: any = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      prioridad: this.prioridad,
      estado: this.estado,
      categoria: this.categoria
    };

    if (this.fechaInicio) {
      updateData.fechaInicio = this.fechaInicio;
    }

    if (this.fechaVencimiento) {
      updateData.fechaVencimiento = this.fechaVencimiento;
    }

    this.tasksService.updateTask(this.task.id, updateData).subscribe({
      next: (updatedTask) => {
        this.loading = false;
        this.taskUpdated.emit(updatedTask);
        this.onClose();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al actualizar la tarea';
        console.error(err);
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}
