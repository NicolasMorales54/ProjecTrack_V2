import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalChangeRoleComponent } from './modal-change-role.component';
import { ModalEditUserComponent } from './modal-edit-user.component';
import { ModalCreateUserComponent } from './modal-create-user.component';
import { UsersService, UpdateUserDto } from '../../core/services/users.service';
import { User } from '../../core/model/user.model';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalCreateUserComponent,
    ModalEditUserComponent,
    ModalChangeRoleComponent,
  ],
  templateUrl: './all-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  loading = true;
  error: string | null = null;

  // Modals
  showCreateModal = false;
  showEditModal = false;
  showChangeRoleModal = false;
  selectedUser: User | null = null;

  // Filters and search
  searchTerm = '';
  selectedRoleFilter = '';
  availableRoles = ['Todos', 'Administrador', 'Líder de Proyecto', 'Empleado', 'Cliente'];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  private usersService = inject(UsersService);
  private cdr = inject(ChangeDetectorRef);

  // Expose Math for template
  Math = Math;

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading = true;
    this.usersService.findAll().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Error al cargar usuarios';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  applyFilters() {
    let result = [...this.users];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.nombre?.toLowerCase().includes(term) ||
          u.correoElectronico?.toLowerCase().includes(term) ||
          u.nombreUsuario?.toLowerCase().includes(term)
      );
    }

    // Apply role filter
    if (this.selectedRoleFilter && this.selectedRoleFilter !== 'Todos') {
      result = result.filter((u) => u.rol === this.selectedRoleFilter);
    }

    this.filteredUsers = result;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filters change
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
    this.cdr.markForCheck();
  }

  onSearchChange() {
    this.applyFilters();
  }

  onRoleFilterChange() {
    this.applyFilters();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  deleteUser(user: User) {
    if (user.rol === 'Administrador') {
      alert('No se puede eliminar un usuario Administrador');
      return;
    }
    if (!confirm(`¿Eliminar usuario ${user.nombre || user.correoElectronico}?`))
      return;
    this.usersService.remove(user.id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== user.id);
        this.applyFilters();
        this.cdr.markForCheck();
      },
      error: () => {
        alert('No se pudo eliminar el usuario');
      },
    });
  }

  // Modal handlers
  openCreateModal() {
    this.showCreateModal = true;
  }

  openEditModal(user: User) {
    this.selectedUser = user;
    this.showEditModal = true;
  }

  openChangeRoleModal(user: User) {
    this.selectedUser = user;
    this.showChangeRoleModal = true;
  }

  handleUserCreated(user: User) {
    this.users = [user, ...this.users];
    this.applyFilters();
    this.closeCreateModal();
    this.cdr.markForCheck();
  }

  handleUserUpdated(dto: UpdateUserDto) {
    if (!this.selectedUser) return;
    console.log('Intentando actualizar usuario:', this.selectedUser.id);
    console.log('DTO enviado:', dto);
    this.usersService.update(this.selectedUser.id, dto).subscribe({
      next: (updatedUser) => {
        console.log('Usuario actualizado exitosamente:', updatedUser);
        const index = this.users.findIndex((u) => u.id === this.selectedUser!.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.applyFilters();
        this.closeEditModal();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        console.error('Error completo:', JSON.stringify(err, null, 2));
        alert(`No se pudo actualizar el usuario: ${err.error?.message || err.message || 'Error desconocido'}`);
      },
    });
  }

  handleRoleChanged(newRole: string) {
    if (!this.selectedUser) return;
    this.usersService.updateRole(this.selectedUser.id, newRole).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex((u) => u.id === this.selectedUser!.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.applyFilters();
        this.closeChangeRoleModal();
        this.cdr.markForCheck();
      },
      error: () => {
        alert('No se pudo cambiar el rol del usuario');
      },
    });
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  closeChangeRoleModal() {
    this.showChangeRoleModal = false;
    this.selectedUser = null;
  }

  getUserAvatar(user: User): string {
    return '/avatar-placeholder.png';
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
