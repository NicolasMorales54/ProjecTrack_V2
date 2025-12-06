import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Component,
  Input,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NotificationsService } from '../../../../core/services/notifications.service';
import { EmailsService } from '../../../../core/services/emails.service';
import { UsersService } from '../../../../core/services/users.service';
import { LoginService } from '../../../../auth/services/login.service';
import { User } from '../../../../core/model/user.model';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './send-email.component.html',
})
export class SendEmailComponent implements OnInit {
  @Input() userId!: number; // The sender's userId
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  users: User[] = [];
  currentUser: User | null = null;
  selectedUserId: number | null = null;
  roleBasePath = '';

  private fb = inject(FormBuilder);
  private emailsService = inject(EmailsService);
  private notificationsService = inject(NotificationsService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private loginService = inject(LoginService);
  private cdRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const user = this.loginService.getCurrentUser?.();

    // Determinar el roleBasePath basado en el rol del usuario
    if (user?.rol) {
      const roleMap: { [key: string]: string } = {
        'Administrador': 'admin',
        'Líder de Proyecto': 'leader',
        'Empleado': 'employee',
        'Cliente': 'client'
      };
      this.roleBasePath = roleMap[user.rol] || 'admin';
    }

    this.form = this.fb.group({
      asunto: ['', [Validators.required, Validators.maxLength(100)]],
      cuerpo: ['', [Validators.required, Validators.maxLength(1000)]],
      destinatarioId: [null, Validators.required],
    });
    this.usersService.findAll().subscribe({
      next: (users) => {
        this.users = users;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.error = 'Error cargando usuarios';
        this.cdRef.detectChanges();
      },
    });
    // Set userId from loginService if not provided
    if (!this.userId) {
      this.userId = user?.id ?? 0; // or handle the case when id is undefined as needed
      this.currentUser = user ?? null;
    }
  }

  goToInbox() {
    this.router.navigate([`/${this.roleBasePath}/inbox`]);
  }

  sendEmail() {
    // Debug: log form values and validity
    console.log('Form values:', this.form.value);
    console.log('Form valid:', this.form.valid);
    console.log('userId:', this.userId);
    if (this.form.invalid) {
      this.error = 'Formulario inválido';
      this.cdRef.detectChanges();
      return;
    }
    if (!this.userId) {
      this.error = 'Usuario no autenticado (userId no definido)';
      this.cdRef.detectChanges();
      return;
    }
    this.loading = true;
    this.cdRef.detectChanges();
    const { asunto, cuerpo, destinatarioId } = this.form.value;
    // Ensure IDs are numbers
    const payload = {
      remitenteId: Number(this.userId),
      destinatarioId: Number(destinatarioId),
      asunto: asunto,
      cuerpo: cuerpo,
    };
    console.log('Outgoing email payload:', payload);
    this.emailsService.create(payload).subscribe({
      next: (email: any) => {
        // Notificar al destinatario con el correo y la fecha/hora
        const fecha = new Date(email.fechaEnvio || Date.now());
        const fechaStr = fecha.toLocaleString('es-ES', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        const emisor =
          email.remitente?.correoElectronico || 'alguien de la plataforma';
        const notificationPayload = {
          userId: payload.destinatarioId, // <-- fix: use userId, not usuarioId
          mensaje: `Has recibido un correo de ${emisor} el ${fechaStr}`,
          tipo: 'email',
          leida: false,
        };
        console.log('Outgoing notification payload:', notificationPayload);
        this.notificationsService.create(notificationPayload).subscribe({
          next: () => {
            this.goToInbox();
          },
          error: (notifErr: any) => {
            this.error =
              'Error creando la notificación: ' +
              (notifErr?.error?.message || notifErr?.message || notifErr);
            this.loading = false;
            this.cdRef.detectChanges();
            console.error('Error creando la notificación:', notifErr);
            // Igual redirigimos aunque falle la notificación
            this.goToInbox();
          },
        });
      },
      error: (err: any) => {
        this.error =
          'Error enviando el correo: ' +
          (err?.error?.message || err?.message || err);
        this.loading = false;
        this.cdRef.detectChanges();
        console.error('Error enviando el correo:', err);
      },
    });
  }
}
