import { Component, EventEmitter, Output, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SubtaskAssignmentsService } from '../../../core/services/subtask-assignments.service';
import { SubtasksService } from '../../../core/services/subtasks.service';
import { LoginService } from '../../../auth/services/login.service';
import { UsersService } from '../../../core/services/users.service';
import { Subtask } from '../../../core/model/subtask.model';
import { User } from '../../../core/model/user.model';

@Component({
  selector: 'app-modal-agregar-subtarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] transition-opacity" (click)="close()"></div>

    <!-- Modal -->
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-[1001] w-[500px] max-w-[95vw] overflow-hidden">
      <!-- Header con icono -->
      <div class="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-5 border-b border-primary-200">
        <div class="flex items-center gap-3">
          <div class="bg-primary-500 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-800">Agregar Subtarea</h3>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-6">
        <!-- Error Message -->
        <div *ngIf="error" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- Título -->
        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Título de la Subtarea <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            [(ngModel)]="titulo"
            placeholder="Ingresa el título de la subtarea"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <!-- Descripción -->
        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Descripción (Opcional)
          </label>
          <textarea
            [(ngModel)]="texto"
            placeholder="Describe los detalles de la subtarea..."
            rows="3"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
          ></textarea>
        </div>

        <!-- Responsable -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Asignar Responsable <span class="text-red-500">*</span>
          </label>
          <select
            [(ngModel)]="selectedUserId"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option [value]="null">-- Seleccionar responsable --</option>
            <option *ngFor="let user of projectUsers" [value]="user.id">
              {{ user.primerNombre }} {{ user.primerApellido }}
              <span *ngIf="user.id === currentUserId">(Tú)</span>
            </option>
          </select>
        </div>

        <!-- Botones -->
        <div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <button
            type="button"
            (click)="close()"
            class="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            (click)="add()"
            [disabled]="!titulo.trim() || !selectedUserId || loading"
            class="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 hover:shadow-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg *ngIf="loading" class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Agregando...' : 'Agregar Subtarea' }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ['/* Modal - Migrado a Tailwind CSS */'],
})
export class ModalAgregarSubtareaComponent implements OnInit {
  @Input() taskId!: number;
  @Input() projectId!: number;
  @Output() subtareaAgregada = new EventEmitter<
    Subtask & { _assignment?: any }
  >();
  @Output() cerrar = new EventEmitter<void>();

  titulo = '';
  texto = '';
  loading = false;
  error: string | null = null;

  projectUsers: User[] = [];
  selectedUserId: number | null = null;
  currentUserId: number | null = null;

  constructor(
    private subtasksService: SubtasksService,
    private subtaskAssignmentsService: SubtaskAssignmentsService,
    private loginService: LoginService,
    private usersService: UsersService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUserId = this.loginService.getCurrentUserId();
    this.selectedUserId = this.currentUserId; // Pre-select current user
    this.loadProjectUsers();
  }

  loadProjectUsers() {
    if (this.projectId) {
      this.usersService.findByProjectId(this.projectId).subscribe({
        next: (users) => {
          this.projectUsers = users;
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Error loading project users:', err);
          this.error = 'No se pudieron cargar los usuarios del proyecto';
          this.cdRef.detectChanges();
        }
      });
    }
  }

  add() {
    if (this.titulo.trim() && this.taskId && this.selectedUserId) {
      this.loading = true;
      this.error = null;
      const createDto = {
        taskId: this.taskId,
        titulo: this.titulo.trim(),
        texto: this.texto.trim(),
        completada: false,
      };
      this.subtasksService.createForTask(this.taskId, createDto).subscribe({
        next: (subtask: Subtask) => {
          this.assignToSelectedUser(subtask);
        },
        error: (err: any) => {
          if (err.status === 400) {
            this.error = 'Error 400 - Reintentando con payload mínimo...';
            this.subtasksService
              .createForTaskMinimal(this.taskId, this.titulo.trim())
              .subscribe({
                next: (subtask: Subtask) => {
                  this.assignToSelectedUser(subtask);
                },
                error: (_fallbackErr: any) => {
                  this.error = `Error al agregar subtarea: ${err.status} ${err.statusText}. Reintento fallido.`;
                  this.loading = false;
                },
              });
          } else {
            this.error = `Error al agregar subtarea: ${err.status} ${err.statusText}`;
            this.loading = false;
          }
        },
      });
    }
  }

  private assignToSelectedUser(subtask: Subtask) {
    if (this.selectedUserId) {
      this.subtaskAssignmentsService
        .create({
          subtaskId: subtask.id,
          usuarioId: this.selectedUserId,
        })
        .subscribe({
          next: (assignment: any) => {
            this.subtareaAgregada.emit({ ...subtask, _assignment: assignment });
            this.resetForm();
            this.close();
          },
          error: (_err: any) => {
            this.error = 'Subtarea creada pero no se pudo asignar al usuario.';
            this.subtareaAgregada.emit(subtask);
            this.resetForm();
            this.close();
          },
        });
    } else {
      this.subtareaAgregada.emit(subtask);
      this.resetForm();
      this.close();
    }
  }

  private resetForm() {
    this.titulo = '';
    this.texto = '';
    this.selectedUserId = this.currentUserId;
    this.loading = false;
  }

  close() {
    this.cerrar.emit();
  }
}
