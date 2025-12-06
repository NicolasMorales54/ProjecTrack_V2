import { LucideAngularModule, Mail } from 'lucide-angular';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';

import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { SettingsDropdownComponent } from '../shared/components/settings-dropdown/settings-dropdown.component';
import { UserDropdownComponent } from '../shared/components/user-dropdown/user-dropdown.component';
import { NotificationsDropdownComponent } from '../shared/components/notifications-dropdown/notifications-dropdown.component';
import { ModalChangePasswordComponent } from '../shared/modals/modal-change-password/modal-change-password.component';


@Component({
  selector: 'app-client',
  standalone: true,
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
  templateUrl: './client.component.html',
})
export class ClientComponent {
  readonly mail = Mail;
  showChangePasswordModal = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  goToInbox() {
    this.router.navigate(['/client/inbox']);
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
