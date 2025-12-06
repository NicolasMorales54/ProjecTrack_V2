import { LucideAngularModule, Mail, Menu } from 'lucide-angular';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { SettingsDropdownComponent } from '../shared/components/settings-dropdown/settings-dropdown.component';
import { UserDropdownComponent } from '../shared/components/user-dropdown/user-dropdown.component';
import { NotificationsDropdownComponent } from '../shared/components/notifications-dropdown/notifications-dropdown.component';
import { ModalChangePasswordComponent } from '../shared/modals/modal-change-password/modal-change-password.component';
import { SidebarService } from '../core/services/sidebar.service';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [
    SidebarComponent,
    RouterOutlet,
    NotificationsDropdownComponent,
    CommonModule,
    LucideAngularModule,
    SettingsDropdownComponent,
    UserDropdownComponent,
    ModalChangePasswordComponent,
  ],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  readonly mail = Mail;
  readonly menu = Menu;
  showChangePasswordModal = false;
  sidebarCollapsed = false;

  constructor(
    private router: Router,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    // Subscribe to sidebar state changes
    this.sidebarService.sidebarCollapsed$.subscribe((collapsed) => {
      this.sidebarCollapsed = collapsed;
    });
  }

  goToInbox() {
    this.router.navigate(['/admin/inbox']);
  }

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
