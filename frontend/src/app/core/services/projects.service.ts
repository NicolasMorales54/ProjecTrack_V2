import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Injectable } from '@angular/core';

import {
  CreateProjectDto,
  Project,
  UpdateProjectDto,
} from '../model/project.model';
import { LoginService } from '../../auth/services/login.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly apiUrl = `${environment.apiUrl}/projects`;
  private projectsChangedSubject = new Subject<void>();
  projectsChanged$ = this.projectsChangedSubject.asObservable();

  constructor(private http: HttpClient, private loginService: LoginService) {}

  create(dto: CreateProjectDto): Observable<Project> {
    // Assign current user ID to the project when creating
    const userId = this.loginService.getCurrentUserId();
    if (userId) {
      dto.creadoPorId = userId;
    }
    return this.http.post<Project>(this.apiUrl, dto).pipe(
      // Notify listeners after project creation
      tap(() => this.projectsChangedSubject.next())
    );
  }

  findAll(): Observable<Project[]> {
    const userId = this.loginService.getCurrentUserId();
    // If there's a userId, get only projects for that user
    if (userId) {
      return this.http.get<Project[]>(`${this.apiUrl}?userId=${userId}`);
    }
    return this.http.get<Project[]>(this.apiUrl);
  }

  findOne(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  update(id: number, dto: UpdateProjectDto): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}/${id}`, dto);
  }

  remove(id: number): Observable<Project> {
    return this.http.delete<Project>(`${this.apiUrl}/${id}`);
  }

  findByUserId(userId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateProjectUserRole(projectId: number, userId: number, rolEnProyecto: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${projectId}/user/${userId}/role`, { rolEnProyecto });
  }

  removeUserFromProject(projectId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}/user/${userId}`);
  }

  // ============ FASE 3: Nuevos métodos ============

  getProjectHistory(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${projectId}/history`);
  }

  downloadProjectReport(projectId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${projectId}/report`, {
      responseType: 'blob',
    });
  }

  // Phase 3: Soft delete
  softDelete(projectId: number): Observable<Project> {
    const usuarioId = this.loginService.getCurrentUserId();
    console.log('[ProjectsService] softDelete - usuarioId:', usuarioId);
    return this.http.patch<Project>(`${this.apiUrl}/${projectId}/soft-delete`, { usuarioId });
  }

  // Phase 3: Change project state
  changeEstado(projectId: number, estado: string): Observable<Project> {
    const usuarioId = this.loginService.getCurrentUserId();
    console.log('[ProjectsService] changeEstado - usuarioId:', usuarioId, 'estado:', estado);
    return this.http.patch<Project>(`${this.apiUrl}/${projectId}/change-estado`, { estado, usuarioId });
  }

  // FASE 6: Cronograma - Timeline
  getTimeline(projectId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${projectId}/timeline`);
  }
}
