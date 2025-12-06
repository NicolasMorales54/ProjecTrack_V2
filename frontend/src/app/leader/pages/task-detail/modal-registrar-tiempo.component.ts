import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-registrar-tiempo',
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
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-800">Registrar Tiempo</h3>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-6">
        <!-- Hora de inicio -->
        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Hora de Inicio <span class="text-red-500">*</span>
          </label>
          <input
            type="time"
            [(ngModel)]="start"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <!-- Hora de fin -->
        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Hora de Fin <span class="text-red-500">*</span>
          </label>
          <input
            type="time"
            [(ngModel)]="end"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <!-- Notas -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Notas (Opcional)
          </label>
          <input
            type="text"
            [(ngModel)]="notes"
            placeholder="Agrega notas adicionales..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
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
            (click)="register()"
            [disabled]="!start || !end"
            class="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 hover:shadow-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Registrar Tiempo</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ['/* Modal - Migrado a Tailwind CSS */'],
})
export class ModalRegistrarTiempoComponent {
  @Output() tiempoRegistrado = new EventEmitter<{
    start: string;
    end: string;
    notes: string;
  }>();
  @Output() cerrar = new EventEmitter<void>();
  start = '';
  end = '';
  notes = '';

  register() {
    if (this.start && this.end) {
      this.tiempoRegistrado.emit({
        start: this.start,
        end: this.end,
        notes: this.notes,
      });
      this.start = '';
      this.end = '';
      this.notes = '';
    }
  }

  close() {
    this.cerrar.emit();
  }
}
