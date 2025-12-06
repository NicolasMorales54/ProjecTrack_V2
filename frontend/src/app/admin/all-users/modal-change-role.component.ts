import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { User } from '../../core/model/user.model';

@Component({
  selector: 'app-modal-change-role',
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
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-800">Cambiar Rol de Usuario</h3>
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

        <!-- Usuario actual -->
        <div class="mb-5 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Usuario</p>
          <p class="font-semibold text-gray-800">{{ user?.nombre || user?.correoElectronico }}</p>
          <p class="text-sm text-gray-600 mt-2">Rol actual</p>
          <p class="font-semibold text-primary-600">{{ user?.rol }}</p>
        </div>

        <!-- Seleccionar nuevo rol -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Nuevo Rol <span class="text-red-500">*</span>
          </label>
          <select
            [(ngModel)]="selectedRole"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white"
          >
            <option value="" disabled>Seleccione un rol</option>
            <option *ngFor="let r of availableRoles" [value]="r">{{ r }}</option>
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
            (click)="confirm()"
            [disabled]="!selectedRole || selectedRole === user?.rol || loading"
            class="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 hover:shadow-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg *ngIf="loading" class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Cambiando...' : 'Cambiar Rol' }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ['/* Modal - Migrado a Tailwind CSS */'],
})
export class ModalChangeRoleComponent {
  @Input() user: User | null = null;
  @Output() roleChanged = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();

  selectedRole = '';
  loading = false;
  error: string | null = null;

  availableRoles = ['Administrador', 'Líder de Proyecto', 'Empleado', 'Cliente'];

  ngOnInit() {
    if (this.user?.rol) {
      this.selectedRole = this.user.rol;
    }
  }

  confirm() {
    if (this.selectedRole && this.selectedRole !== this.user?.rol) {
      this.roleChanged.emit(this.selectedRole);
    }
  }

  close() {
    this.closeModal.emit();
  }
}
