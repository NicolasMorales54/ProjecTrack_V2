import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification } from '../model/notification.model';

// Re-export for backward compatibility
export type { Notification };

export interface TaskAssignedEvent {
  notification: Notification;
  taskId: number;
  taskName: string;
  assignedBy: string;
}

export interface TaskCompletedEvent {
  notification: Notification;
  taskId: number;
  taskName: string;
  completedBy: string;
}

export interface DeadlineNearEvent {
  notification: Notification;
  taskId: number;
  taskName: string;
  hoursLeft: number;
}

export interface ProjectUpdateEvent {
  notification: Notification;
  projectId: number;
  action: string;
  description: string;
}

export interface NewMessageEvent {
  notification: Notification;
  messageId: number;
  senderName: string;
  subject: string;
}

export interface SubtaskAssignedEvent {
  notification: Notification;
  subtaskId: number;
  subtaskTitle: string;
  taskName: string;
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  // Subjects para emitir eventos
  private notificationsSubject = new Subject<Notification>();
  private taskAssignedSubject = new Subject<TaskAssignedEvent>();
  private taskCompletedSubject = new Subject<TaskCompletedEvent>();
  private deadlineNearSubject = new Subject<DeadlineNearEvent>();
  private projectUpdateSubject = new Subject<ProjectUpdateEvent>();
  private newMessageSubject = new Subject<NewMessageEvent>();
  private subtaskAssignedSubject = new Subject<SubtaskAssignedEvent>();

  // Observables públicos
  public notifications$ = this.notificationsSubject.asObservable();
  public taskAssigned$ = this.taskAssignedSubject.asObservable();
  public taskCompleted$ = this.taskCompletedSubject.asObservable();
  public deadlineNear$ = this.deadlineNearSubject.asObservable();
  public projectUpdate$ = this.projectUpdateSubject.asObservable();
  public newMessage$ = this.newMessageSubject.asObservable();
  public subtaskAssigned$ = this.subtaskAssignedSubject.asObservable();

  constructor() {}

  /**
   * Conectar al servidor WebSocket y unirse al room del usuario
   */
  connect(userId: number): void {
    if (this.isConnected && this.socket) {
      console.log('WebSocket already connected');
      return;
    }

    // Determinar la URL del servidor
    const serverUrl = environment.production
      ? window.location.origin
      : 'http://localhost:3000';

    // Crear conexión
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    // Eventos de conexión
    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket?.id);
      this.isConnected = true;

      // Unirse al room del usuario
      this.socket?.emit('joinUserRoom', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
    });

    this.socket.on('joinedRoom', (data: any) => {
      console.log('Joined room:', data);
    });

    // Escuchar eventos de notificaciones
    this.socket.on('taskAssigned', (data: TaskAssignedEvent) => {
      console.log('Task assigned event received:', data);
      this.notificationsSubject.next(data.notification);
      this.taskAssignedSubject.next(data);
    });

    this.socket.on('taskCompleted', (data: TaskCompletedEvent) => {
      console.log('Task completed event received:', data);
      this.notificationsSubject.next(data.notification);
      this.taskCompletedSubject.next(data);
    });

    this.socket.on('deadlineNear', (data: DeadlineNearEvent) => {
      console.log('Deadline near event received:', data);
      this.notificationsSubject.next(data.notification);
      this.deadlineNearSubject.next(data);
    });

    this.socket.on('projectUpdate', (data: ProjectUpdateEvent) => {
      console.log('Project update event received:', data);
      this.notificationsSubject.next(data.notification);
      this.projectUpdateSubject.next(data);
    });

    this.socket.on('newMessage', (data: NewMessageEvent) => {
      console.log('New message event received:', data);
      this.notificationsSubject.next(data.notification);
      this.newMessageSubject.next(data);
    });

    this.socket.on('subtaskAssigned', (data: SubtaskAssignedEvent) => {
      console.log('Subtask assigned event received:', data);
      this.notificationsSubject.next(data.notification);
      this.subtaskAssignedSubject.next(data);
    });

    // Manejo de errores
    this.socket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
    });
  }

  /**
   * Desconectar del servidor WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('WebSocket disconnected manually');
    }
  }

  /**
   * Verificar si está conectado
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
