import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
} from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail } from 'lucide-angular';

import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { SettingsDropdownComponent } from '../shared/components/settings-dropdown/settings-dropdown.component';
import { UserDropdownComponent } from '../shared/components/user-dropdown/user-dropdown.component';
import { NotificationsDropdownComponent } from '../shared/components/notifications-dropdown/notifications-dropdown.component';
import { ModalChangePasswordComponent } from '../shared/modals/modal-change-password/modal-change-password.component';

@Component({
  selector: 'app-employee',
  imports: [
    SidebarComponent,
    RouterOutlet,
    CommonModule,
    NotificationsDropdownComponent,
    LucideAngularModule,
    SettingsDropdownComponent,
    UserDropdownComponent,
    ModalChangePasswordComponent,
  ],
  templateUrl: './employee.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeComponent {
  readonly mail = Mail;
  sidebarOpen = false;
  isLargeScreen = window.innerWidth >= 1024;
  showChangePasswordModal = false;

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  @HostListener('window:resize', [])
  onResize() {
    this.isLargeScreen = window.innerWidth >= 1024;
    if (this.isLargeScreen) {
      this.sidebarOpen = false;
    }
  }

  goToInbox() {
    this.router.navigate(['/employee/inbox']);
  }

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
    this.cdRef.detectChanges();
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
    this.cdRef.detectChanges();
  }
}
