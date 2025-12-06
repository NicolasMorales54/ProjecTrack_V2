import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-delete-project',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] transition-opacity" (click)="close()"></div>

    <!-- Modal -->
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-[1001] w-[500px] max-w-[95vw] overflow-hidden">
      <!-- Header con icono de advertencia -->
      <div class="bg-gradient-to-r from-red-50 to-red-100 px-6 py-6 border-b border-red-200">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 bg-red-500 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">¿Eliminar Proyecto?</h3>
            <p class="text-gray-700 text-base leading-relaxed">
              Esta acción es <span class="font-semibold text-red-600">permanente</span> y no se puede deshacer.
            </p>
          </div>
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

        <!-- Confirmation message -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p class="text-gray-700 text-base">
            ¿Estás seguro de que deseas eliminar el proyecto
          </p>
          <p class="text-xl font-bold text-gray-900 mt-2 break-words">
            "{{ projectName }}"
          </p>
        </div>

        <!-- Warning box -->
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-sm text-yellow-800">
              <p class="font-semibold mb-1">Se eliminarán también:</p>
              <ul class="list-disc list-inside space-y-1">
                <li>Todas las tareas del proyecto</li>
                <li>Registros de tiempo asociados</li>
                <li>Asignaciones de usuarios</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div class="flex gap-3 justify-end">
          <button
            type="button"
            (click)="close()"
            class="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            (click)="confirm()"
            class="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Sí, Eliminar Proyecto</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ['/* Modal - Migrado a Tailwind CSS */'],
})
export class ModalDeleteProjectComponent {
  @Input() projectName: string = '';
  @Input() error: string | null = null;
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  confirm() {
    this.confirmDelete.emit();
  }

  close() {
    this.closeModal.emit();
  }
}
