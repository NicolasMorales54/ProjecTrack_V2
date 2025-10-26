import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
} from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Bell, Mail } from 'lucide-angular';

import { NotificationsComponent } from './shared/notifications/notifications.component';
import { NotificationsService } from '../core/services/notifications.service';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-employee',
  imports: [SidebarComponent, RouterOutlet, CommonModule, NotificationsComponent, LucideAngularModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeComponent {
  readonly bell = Bell;
  readonly mail = Mail;
  sidebarOpen = false;
  isLargeScreen = window.innerWidth >= 1024;
  showNotifications = false;
  unreadCount = 0;

  constructor(
    private notificationsService: NotificationsService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUnreadCount();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isLargeScreen = window.innerWidth >= 1024;
    if (this.isLargeScreen) {
      this.sidebarOpen = false;
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.loadUnreadCount();
    }
    this.cdRef.detectChanges();
  }

  loadUnreadCount() {
    this.notificationsService
      .findMyNotifications()
      .subscribe((notifications) => {
        this.unreadCount = notifications.filter((n) => !n.leida).length;
        this.cdRef.detectChanges();
      });
  }

  goToInbox() {
    this.router.navigate(['/employee/inbox']);
  }
}
