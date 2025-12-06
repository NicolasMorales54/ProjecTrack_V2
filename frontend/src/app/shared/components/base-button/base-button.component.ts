import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-button.component.html',
})
export class BaseButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Output() clicked = new EventEmitter<void>();

  get buttonClasses(): string {
    const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-500 focus:ring-primary-500',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]}`;
  }

  onClick() {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
