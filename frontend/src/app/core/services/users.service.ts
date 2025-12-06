import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User } from '../model/user.model';

export interface CreateUserDto {
  nombreUsuario: string;
  correoElectronico: string;
  contrasena: string;
  rol: 'Líder de Proyecto' | 'Empleado' | 'Cliente';
  primerNombre: string;
  primerApellido: string;
  segundoNombre?: string;
  segundoApellido?: string;
  posicion?: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  create(createUserDto: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, createUserDto);
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  findOne(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  update(id: number, updateUserDto: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, updateUserDto);
  }

  remove(id: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${id}`);
  }

  findByProjectId(projectId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/by-project/${projectId}`);
  }

  changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/password`, {
      currentPassword,
      newPassword,
    });
  }

  findByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/by-role/${role}`);
  }

  updateRole(id: number, rol: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/role`, { rol });
  }
}
