import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-card.component.html',
})
export class BaseCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() padding: 'sm' | 'md' | 'lg' = 'md';

  get cardClasses(): string {
    const baseClasses = 'bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200';

    const paddingClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    return `${baseClasses} ${paddingClasses[this.padding]}`;
  }
}
