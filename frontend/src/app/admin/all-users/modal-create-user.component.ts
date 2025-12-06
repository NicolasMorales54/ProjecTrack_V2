import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateUserDto, UsersService } from '../../core/services/users.service';
import { User } from '../../core/model/user.model';

@Component({
  selector: 'app-modal-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] transition-opacity" (click)="close()"></div>

    <!-- Modal -->
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-[1001] w-[600px] max-w-[95vw] max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-5 border-b border-primary-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-primary-500 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800">Crear Nuevo Usuario</h3>
          </div>
          <button type="button" (click)="close()" class="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <!-- Error Message -->
        <div *ngIf="error" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Usuario -->
          <div class="mb-5">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de Usuario <span class="text-red-500">*</span>
            </label>
            <input
              formControlName="nombreUsuario"
              placeholder="Ej: jdoe123 (3-50 caracteres)"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              [class.border-red-500]="form.get('nombreUsuario')?.invalid && form.get('nombreUsuario')?.touched"
            />
            <p *ngIf="form.get('nombreUsuario')?.invalid && form.get('nombreUsuario')?.touched" class="mt-2 text-sm text-red-600">
              El nombre de usuario debe tener entre 3 y 50 caracteres
            </p>
          </div>

          <!-- Grid 2 columnas para nombres -->
          <div class="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Primer Nombre <span class="text-red-500">*</span>
              </label>
              <input
                formControlName="primerNombre"
                placeholder="Ej: Juan"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                [class.border-red-500]="form.get('primerNombre')?.invalid && form.get('primerNombre')?.touched"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Segundo Nombre
              </label>
              <input
                formControlName="segundoNombre"
                placeholder="Ej: Carlos (opcional)"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Grid 2 columnas para apellidos -->
          <div class="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Primer Apellido <span class="text-red-500">*</span>
              </label>
              <input
                formControlName="primerApellido"
                placeholder="Ej: Pérez"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                [class.border-red-500]="form.get('primerApellido')?.invalid && form.get('primerApellido')?.touched"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Segundo Apellido <span class="text-red-500">*</span>
              </label>
              <input
                formControlName="segundoApellido"
                placeholder="Ej: Gómez"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                [class.border-red-500]="form.get('segundoApellido')?.invalid && form.get('segundoApellido')?.touched"
              />
            </div>
          </div>

          <!-- Grid 2 columnas para correo y posición -->
          <div class="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                formControlName="correoElectronico"
                placeholder="ejemplo@correo.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                [class.border-red-500]="form.get('correoElectronico')?.invalid && form.get('correoElectronico')?.touched"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Posición
              </label>
              <input
                formControlName="posicion"
                placeholder="Ej: Desarrollador (opcional)"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Grid 2 columnas para contraseña y rol -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña <span class="text-red-500">*</span>
              </label>
              <input
                type="password"
                formControlName="contrasena"
                placeholder="••••••••"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                [class.border-red-500]="form.get('contrasena')?.invalid && form.get('contrasena')?.touched"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Rol <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="rol"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white"
                [class.border-red-500]="form.get('rol')?.invalid && form.get('rol')?.touched"
              >
                <option value="" disabled>Seleccione un rol</option>
                <option *ngFor="let r of roles" [value]="r">{{ r }}</option>
              </select>
            </div>
          </div>
        </form>
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
            type="submit"
            (click)="onSubmit()"
            [disabled]="form.invalid || loading"
            class="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 hover:shadow-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg *ngIf="loading" class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Creando...' : 'Crear Usuario' }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ['/* Modal - Migrado a Tailwind CSS */'],
})
export class ModalCreateUserComponent {
  @Output() userCreated = new EventEmitter<User>();
  @Output() closeModal = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  error: string | null = null;

  roles = ['Líder de Proyecto', 'Empleado', 'Cliente'];

  constructor(private fb: FormBuilder, private usersService: UsersService) {
    this.form = this.fb.group({
      nombreUsuario: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: ['', Validators.required],
      posicion: [''],
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      rol: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    const dto: CreateUserDto = this.form.value;
    this.usersService.create(dto).subscribe({
      next: (user: User) => {
        this.userCreated.emit(user);
        this.reset();
        this.close();
      },
      error: (err: any) => {
        this.error = 'Error al crear usuario';
        this.loading = false;
      },
    });
  }

  close() {
    this.closeModal.emit();
  }

  private reset() {
    this.form.reset({
      nombreUsuario: '',
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      posicion: '',
      correoElectronico: '',
      contrasena: '',
      rol: '',
    });
    this.loading = false;
    this.error = null;
  }
}
