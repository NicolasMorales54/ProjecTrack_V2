import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  @Input() text: string = '';
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray' = 'gray';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get badgeClasses(): string {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';

    const colorClasses = {
      primary: 'bg-primary-100 text-primary-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      danger: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700',
      gray: 'bg-gray-100 text-gray-700'
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base'
    };

    return `${baseClasses} ${colorClasses[this.color]} ${sizeClasses[this.size]}`;
  }
}
