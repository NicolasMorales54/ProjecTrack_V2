import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { EmailsService } from '../../../../core/services/emails.service';
import { LoginService } from '../../../../auth/services/login.service';
import { Email } from '../../../../core/model/email.model';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inbox.component.html',
})
export class InboxComponent implements OnInit {
  emails: Email[] = [];
  loading = true;
  error: string | null = null;
  myUserId: number | null = null;
  roleBasePath = '';
  private loginService = inject(LoginService);

  constructor(
    private emailsService: EmailsService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.myUserId = this.loginService.getCurrentUserId();
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

    this.emailsService.findMyEmails().subscribe({
      next: (emails) => {
        this.emails = emails;
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.error = 'Error cargando los correos';
        this.loading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  openEmail(email: Email) {
    this.router.navigate([`/${this.roleBasePath}/conversation`, email.id]);
  }
}
