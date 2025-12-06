import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';
import { LoginService } from '../../../auth/services/login.service';
import { BaseModalComponent } from '../../components/base-modal/base-modal.component';

@Component({
  selector: 'app-modal-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseModalComponent],
  templateUrl: './modal-change-password.component.html',
})
export class ModalChangePasswordComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() passwordChanged = new EventEmitter<void>();

  passwordForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private loginService = inject(LoginService);

  constructor() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  get currentPassword() {
    return this.passwordForm.get('currentPassword');
  }

  get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  toggleShowPassword(field: 'current' | 'new' | 'confirm'): void {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    if (this.passwordForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const currentUser = this.loginService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.errorMessage = 'No se pudo identificar al usuario actual';
      this.isSubmitting = false;
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.usersService
      .changePassword(currentUser.id, currentPassword, newPassword)
      .subscribe({
        next: () => {
          this.successMessage = 'Contraseña cambiada exitosamente';
          this.isSubmitting = false;
          this.passwordForm.reset();

          // Cerrar el modal después de 2 segundos
          setTimeout(() => {
            this.passwordChanged.emit();
            this.close();
          }, 2000);
        },
        error: (error) => {
          console.error('Error al cambiar contraseña:', error);
          this.errorMessage =
            error.error?.message ||
            'Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.';
          this.isSubmitting = false;
        },
      });
  }

  close(): void {
    this.passwordForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.closeModal.emit();
  }
}
