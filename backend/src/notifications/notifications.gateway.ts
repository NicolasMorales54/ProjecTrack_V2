import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200', 'https://projectrackv2.netlify.app'],
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Mapa para trackear conexiones de usuarios
  private userSockets: Map<number, string> = new Map();

  constructor(private readonly notificationsService: NotificationsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remover del mapa de usuarios conectados
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  // Cliente se une a su room personal
  @SubscribeMessage('joinUserRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: number,
  ) {
    const roomName = `user-${userId}`;
    client.join(roomName);
    this.userSockets.set(userId, client.id);
    console.log(`User ${userId} joined room: ${roomName}`);
    return { event: 'joinedRoom', data: { userId, room: roomName } };
  }

  // Emitir notificación a un usuario específico
  async emitToUser(userId: number, event: string, data: any) {
    const roomName = `user-${userId}`;
    this.server.to(roomName).emit(event, data);
    console.log(`Emitted ${event} to user ${userId}:`, data);
  }

  // Evento: Tarea asignada
  async notifyTaskAssigned(
    userId: number,
    taskId: number,
    taskName: string,
    assignedBy: string,
  ) {
    const notification = await this.notificationsService.create({
      userId,
      mensaje: `Se te ha asignado la tarea: ${taskName}`,
      tipo: 'task_assigned',
    });

    await this.emitToUser(userId, 'taskAssigned', {
      notification,
      taskId,
      taskName,
      assignedBy,
    });
  }

  // Evento: Tarea completada
  async notifyTaskCompleted(
    userId: number,
    taskId: number,
    taskName: string,
    completedBy: string,
  ) {
    const notification = await this.notificationsService.create({
      userId,
      mensaje: `La tarea "${taskName}" ha sido completada por ${completedBy}`,
      tipo: 'task_completed',
    });

    await this.emitToUser(userId, 'taskCompleted', {
      notification,
      taskId,
      taskName,
      completedBy,
    });
  }

  // Evento: Deadline cercano (24 horas)
  async notifyDeadlineNear(
    userId: number,
    taskId: number,
    taskName: string,
    hoursLeft: number,
  ) {
    const notification = await this.notificationsService.create({
      userId,
      mensaje: `La tarea "${taskName}" vence en ${hoursLeft} horas`,
      tipo: 'deadline_near',
    });

    await this.emitToUser(userId, 'deadlineNear', {
      notification,
      taskId,
      taskName,
      hoursLeft,
    });
  }

  // Evento: Actualización de proyecto
  async notifyProjectUpdate(
    userId: number,
    projectId: number,
    action: string,
    description: string,
  ) {
    const notification = await this.notificationsService.create({
      userId,
      mensaje: description,
      tipo: 'project_update',
    });

    await this.emitToUser(userId, 'projectUpdate', {
      notification,
      projectId,
      action,
      description,
    });
  }

  // Evento: Nuevo mensaje interno
  async notifyNewMessage(
    userId: number,
    messageId: number,
    senderName: string,
    subject: string,
  ) {
    const notification = await this.notificationsService.create({
      userId,
      mensaje: `Nuevo mensaje de ${senderName}: ${subject}`,
      tipo: 'new_message',
    });

    await this.emitToUser(userId, 'newMessage', {
      notification,
      messageId,
      senderName,
      subject,
    });
  }

  // Evento: Subtarea asignada
  async notifySubtaskAssigned(
    userId: number,
    subtaskId: number,
    subtaskTitle: string,
    taskName: string,
  ) {
    const notification = await this.notificationsService.create({
      userId,
      mensaje: `Se te ha asignado la subtarea "${subtaskTitle}" de la tarea "${taskName}"`,
      tipo: 'subtask_assigned',
    });

    await this.emitToUser(userId, 'subtaskAssigned', {
      notification,
      subtaskId,
      subtaskTitle,
      taskName,
    });
  }

  @SubscribeMessage('createNotification')
  create(@MessageBody() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @SubscribeMessage('findAllNotifications')
  findAll() {
    return this.notificationsService.findAll();
  }

  @SubscribeMessage('findOneNotification')
  findOne(@MessageBody() id: number) {
    return this.notificationsService.findOne(id);
  }

  @SubscribeMessage('updateNotification')
  update(@MessageBody() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(
      updateNotificationDto.id,
      updateNotificationDto,
    );
  }

  @SubscribeMessage('removeNotification')
  remove(@MessageBody() id: number) {
    return this.notificationsService.remove(id);
  }
}
