import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  RolProyecto,
  CreateProjectUserDto,
} from '../../../core/model/project-user.model';
import { ProjectUsersService } from '../../../core/services/project-users.service';
import { UsersExtraService } from '../../../core/services/users-extra.service';
import { ProjectsService } from '../../../core/services/projects.service';
import { ModalAssignUserComponent } from './modal-assign-user.component';
import { UsersService } from '../../../core/services/users.service';
import { Project } from '../../../core/model/project.model';
import { User } from '../../../core/model/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ModalAssignUserComponent],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  projectId: number | null = null;
  projectName: string = '';

  showAssignModal = false;
  assignLoading = false;
  assignError: string | null = null;

  private usersService = inject(UsersService);
  private usersExtraService = inject(UsersExtraService);
  private projectUsersService = inject(ProjectUsersService);
  private projectsService = inject(ProjectsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const pid = params.get('projectId');
      this.projectId = pid ? +pid : null;
      if (this.projectId) {
        this.projectsService.findOne(this.projectId).subscribe({
          next: (project: Project) => {
            this.projectName = project.nombre;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error fetching project:', err);
            this.projectName = '';
            this.cdr.markForCheck();
          },
        });

        this.usersService.findByProjectId(this.projectId).subscribe({
          next: (users: any[]) => {
            this.users = users.map((u) => {
              // Fallback to available fields
              return {
                id: u.id,
                nombre: u.primerNombre || u.nombre || u.nombreUsuario || '',
                correoElectronico: u.correoElectronico || '',
                rol: u.rolEnProyecto || u.rol || '', // Use rolEnProyecto first (project role)
                createdAt: u.createdAt || u.fechaRegistro || '',
              };
            });
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error fetching users:', err);
            this.loading = false;
            this.cdr.markForCheck();
          },
        });
      }
    });
  }

  openAssignModal() {
    this.showAssignModal = true;
    this.assignLoading = false;
    this.cdr.markForCheck();
  }

  handleAssignUser(data: { usuarioId: number; rolEnProyecto: RolProyecto }) {
    if (!this.projectId) return;
    this.assignLoading = true;
    this.assignError = null;
    const dto: CreateProjectUserDto = {
      proyectoId: this.projectId,
      usuarioId: data.usuarioId,
      rolEnProyecto: data.rolEnProyecto,
    };
    this.projectUsersService.create(dto).subscribe({
      next: () => {
        this.showAssignModal = false;
        this.assignLoading = false;
        // Refresh users list
        this.usersService
          .findByProjectId(this.projectId!)
          .subscribe((users: any[]) => {
            this.users = users.map((u) => ({
              id: u.id,
              nombre: u.primerNombre || u.nombre || u.nombreUsuario || '',
              correoElectronico: u.correoElectronico || '',
              rol: u.rolEnProyecto || u.rol || '', // Use rolEnProyecto first
              createdAt: u.createdAt || u.fechaRegistro || '',
            }));
            this.cdr.markForCheck();
          });
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.assignError = 'No se pudo asignar el usuario.';
        this.assignLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  closeAssignModal() {
    this.showAssignModal = false;
    this.assignError = null;
  }

  contactUser(user: User) {
    // Navigate to send-email route for the selected user
    this.router.navigate(['/leader/send-email', user.id]);
  }
}
