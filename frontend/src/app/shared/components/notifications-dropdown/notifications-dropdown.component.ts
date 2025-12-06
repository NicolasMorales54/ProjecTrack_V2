import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LucideAngularModule, Bell, Check, CheckCheck, X } from 'lucide-angular';

import { WebSocketService, Notification } from '../../../core/services/websocket.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { LoginService } from '../../../auth/services/login.service';

@Component({
  selector: 'app-notifications-dropdown',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './notifications-dropdown.component.html',
})
export class NotificationsDropdownComponent implements OnInit, OnDestroy {
  // Iconos de Lucide
  readonly Bell = Bell;
  readonly Check = Check;
  readonly CheckCheck = CheckCheck;
  readonly X = X;

  isOpen = false;
  notifications: Notification[] = [];
  unreadNotifications: Notification[] = [];
  currentTab: 'unread' | 'all' = 'unread';

  private destroy$ = new Subject<void>();
  private currentUserId: number | null = null;

  constructor(
    private webSocketService: WebSocketService,
    private notificationsService: NotificationsService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener usuario actual
    const user = this.loginService.getCurrentUser();
    if (user && user.id) {
      this.currentUserId = user.id;
      this.loadNotifications();
      this.subscribeToWebSocket();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar notificaciones del usuario
   */
  loadNotifications(): void {
    if (!this.currentUserId) return;

    this.notificationsService
      .getByUserId(this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notifications) => {
          this.notifications = notifications;
          this.updateUnreadNotifications();
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
        },
      });
  }

  /**
   * Suscribirse a notificaciones en tiempo real
   */
  subscribeToWebSocket(): void {
    this.webSocketService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notification) => {
          console.log('New notification received:', notification);
          // Agregar notificación al principio de la lista
          this.notifications.unshift(notification);
          this.updateUnreadNotifications();

          // Opcional: Reproducir sonido o mostrar toast
        },
        error: (error) => {
          console.error('WebSocket notification error:', error);
        },
      });
  }

  /**
   * Actualizar lista de no leídas
   */
  updateUnreadNotifications(): void {
    this.unreadNotifications = this.notifications.filter((n) => !n.leida);
  }

  /**
   * Obtener contador de no leídas
   */
  getUnreadCount(): number {
    return this.unreadNotifications.length;
  }

  /**
   * Toggle dropdown
   */
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  /**
   * Cerrar dropdown
   */
  closeDropdown(): void {
    this.isOpen = false;
  }

  /**
   * Cambiar tab
   */
  setTab(tab: 'unread' | 'all'): void {
    this.currentTab = tab;
  }

  /**
   * Marcar notificación como leída y navegar
   */
  handleNotificationClick(notification: Notification): void {
    // Marcar como leída si no lo está
    if (!notification.leida) {
      this.notificationsService
        .markAsRead(notification.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            notification.leida = true;
            this.updateUnreadNotifications();
          },
          error: (error) => {
            console.error('Error marking notification as read:', error);
          },
        });
    }

    // Navegar según el tipo de notificación
    this.navigateFromNotification(notification);

    // Cerrar dropdown
    this.closeDropdown();
  }

  /**
   * Navegar según el tipo de notificación
   */
  private navigateFromNotification(notification: Notification): void {
    const userRole = this.loginService.getCurrentUser()?.rol;
    if (!userRole) return;

    // Mapeo de roles a rutas
    const roleRouteMap: Record<string, string> = {
      'Administrador': 'admin',
      'Líder de Proyecto': 'leader',
      'Empleado': 'employee',
      'Cliente': 'client',
    };
    const roleRoute = roleRouteMap[userRole];

    if (!roleRoute) return;

    // Navegar según tipo de notificación
    switch (notification.tipo) {
      case 'task_assigned':
      case 'task_completed':
      case 'subtask_assigned':
        // Extraer taskId del mensaje (si es posible) o navegar a main
        this.router.navigate([`/${roleRoute}/main`]);
        break;
      case 'project_update':
        this.router.navigate([`/${roleRoute}/main`]);
        break;
      case 'new_message':
        this.router.navigate([`/${roleRoute}/inbox`]);
        break;
      case 'deadline_near':
        this.router.navigate([`/${roleRoute}/main`]);
        break;
      default:
        this.router.navigate([`/${roleRoute}/main`]);
    }
  }

  /**
   * Marcar todas como leídas
   */
  markAllAsRead(): void {
    if (!this.currentUserId) return;

    this.notificationsService
      .markAllAsRead(this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notifications.forEach((n) => (n.leida = true));
          this.updateUnreadNotifications();
        },
        error: (error) => {
          console.error('Error marking all as read:', error);
        },
      });
  }

  /**
   * Eliminar notificación
   */
  deleteNotification(event: Event, notificationId: number): void {
    event.stopPropagation();

    this.notificationsService
      .delete(notificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notifications = this.notifications.filter(
            (n) => n.id !== notificationId
          );
          this.updateUnreadNotifications();
        },
        error: (error) => {
          console.error('Error deleting notification:', error);
        },
      });
  }

  /**
   * Obtener ícono según tipo de notificación
   */
  getNotificationIcon(tipo: string): string {
    switch (tipo) {
      case 'task_assigned':
        return '📋';
      case 'task_completed':
        return '✅';
      case 'subtask_assigned':
        return '📝';
      case 'project_update':
        return '📁';
      case 'new_message':
        return '📧';
      case 'deadline_near':
        return '⚠️';
      default:
        return '🔔';
    }
  }

  /**
   * Obtener tiempo relativo (hace X minutos/horas/días)
   */
  getRelativeTime(date: Date): string {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return notifDate.toLocaleDateString();
  }

  /**
   * Obtener notificaciones según tab actual
   */
  getDisplayedNotifications(): Notification[] {
    const notifications =
      this.currentTab === 'unread' ? this.unreadNotifications : this.notifications;
    return notifications.slice(0, 10); // Mostrar máximo 10
  }
}
