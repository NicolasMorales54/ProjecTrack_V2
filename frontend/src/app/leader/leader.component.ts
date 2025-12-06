import { LucideAngularModule, Mail } from 'lucide-angular';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { SettingsDropdownComponent } from '../shared/components/settings-dropdown/settings-dropdown.component';
import { UserDropdownComponent } from '../shared/components/user-dropdown/user-dropdown.component';
import { NotificationsDropdownComponent } from '../shared/components/notifications-dropdown/notifications-dropdown.component';
import { ModalChangePasswordComponent } from '../shared/modals/modal-change-password/modal-change-password.component';

@Component({
  selector: 'app-leader',
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
  templateUrl: './leader.component.html',
})
export class LeaderComponent {
  readonly mail = Mail;
  showChangePasswordModal = false;

  constructor(private router: Router) {}

  goToInbox() {
    this.router.navigate(['/leader/inbox']);
  }

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
  }
}
