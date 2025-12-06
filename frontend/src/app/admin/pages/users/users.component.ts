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
import { ModalChangeProjectRoleComponent } from './modal-change-project-role.component';
import { ModalAssignUserComponent } from './modal-assign-user.component';
import { UsersService } from '../../../core/services/users.service';
import { Project } from '../../../core/model/project.model';
import { User } from '../../../core/model/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ModalAssignUserComponent,
    ModalChangeProjectRoleComponent,
  ],
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

  showChangeRoleModal = false;
  changeRoleLoading = false;
  selectedUser: User | null = null;
  selectedUserCurrentRole: string = '';

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
                rol: u.rolEnProyecto || u.rol || '', // Use rolEnProyecto first (project role), fallback to global role
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

  openChangeRoleModal(user: User) {
    this.selectedUser = user;
    this.selectedUserCurrentRole = user.rol || ''; // This is the project role
    this.showChangeRoleModal = true;
    this.changeRoleLoading = false;
    this.cdr.markForCheck();
  }

  handleChangeRole(newRole: string) {
    if (!this.selectedUser || !this.projectId) return;
    this.changeRoleLoading = true;
    this.projectsService
      .updateProjectUserRole(this.projectId, this.selectedUser.id, newRole)
      .subscribe({
        next: () => {
          this.showChangeRoleModal = false;
          this.changeRoleLoading = false;
          // Refresh users list
          if (this.projectId) {
            this.usersService
              .findByProjectId(this.projectId)
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
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.changeRoleLoading = false;
          alert('No se pudo cambiar el rol del usuario en el proyecto.');
          this.cdr.markForCheck();
        },
      });
  }

  closeChangeRoleModal() {
    this.showChangeRoleModal = false;
    this.selectedUser = null;
    this.selectedUserCurrentRole = '';
    this.cdr.markForCheck();
  }

  removeUserFromProject(user: User) {
    if (!this.projectId) return;

    if (!confirm(`¿Está seguro de remover a ${user.nombre || user.correoElectronico} del proyecto?`)) {
      return;
    }

    this.projectsService.removeUserFromProject(this.projectId, user.id).subscribe({
      next: () => {
        // Remove user from the list
        this.users = this.users.filter(u => u.id !== user.id);
        this.cdr.markForCheck();
      },
      error: (err) => {
        alert('No se pudo remover el usuario del proyecto.');
        console.error('Error removing user from project:', err);
      },
    });
  }

  contactUser(user: User) {
    // Navigate to send-email route for the selected user
    this.router.navigate([`/admin/send-email/${user.id}`]);
  }
}
