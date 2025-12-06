import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../../auth/services/login.service';
import { User } from '../../../core/model/user.model';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dropdown.component.html',
})
export class UserDropdownComponent {
  isOpen = false;

  private router = inject(Router);
  private loginService = inject(LoginService);

  currentUser: User | null = this.loginService.getCurrentUser();

  get userInitials(): string {
    if (!this.currentUser) return '?';
    const primerNombre = this.currentUser.primerNombre || this.currentUser.nombre || '';
    const segundoNombre = this.currentUser.segundoNombre || '';
    return `${primerNombre.charAt(0)}${segundoNombre.charAt(0)}`.toUpperCase();
  }

  get userFullName(): string {
    if (!this.currentUser) return 'Usuario';
    const primerNombre = this.currentUser.primerNombre || this.currentUser.nombre || '';
    const segundoNombre = this.currentUser.segundoNombre || '';
    return `${primerNombre} ${segundoNombre}`.trim() || 'Usuario';
  }

  get userRole(): string {
    return this.currentUser?.rol || 'Sin rol';
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
    this.closeDropdown();
  }

  // Cierra el dropdown si se hace clic fuera
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.closeDropdown();
    }
  }
}
