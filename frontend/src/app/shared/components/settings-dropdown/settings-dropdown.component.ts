import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-dropdown.component.html',
})
export class SettingsDropdownComponent {
  isOpen = false;

  @Output() openChangePassword = new EventEmitter<void>();

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  openChangePasswordModal(): void {
    this.closeDropdown();
    this.openChangePassword.emit();
  }

  // Cierra el dropdown si se hace clic fuera
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.settings-dropdown')) {
      this.closeDropdown();
    }
  }
}
