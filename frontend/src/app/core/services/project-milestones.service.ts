import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProjectMilestone {
  id: number;
  projectId: number;
  nombre: string;
  descripcion?: string;
  fechaObjetivo: string | Date;
  completado: boolean;
  fechaCompletado?: string | Date | null;
  orden: number;
  fechaCreacion?: Date;
}

export interface CreateProjectMilestoneDto {
  projectId: number;
  nombre: string;
  descripcion?: string;
  fechaObjetivo: string;
  completado?: boolean;
  fechaCompletado?: string;
  orden?: number;
}

export interface UpdateProjectMilestoneDto {
  nombre?: string;
  descripcion?: string;
  fechaObjetivo?: string;
  completado?: boolean;
  fechaCompletado?: string;
  orden?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectMilestonesService {
  private readonly apiUrl = `${environment.apiUrl}/project-milestones`;

  constructor(private http: HttpClient) {}

  create(dto: CreateProjectMilestoneDto): Observable<ProjectMilestone> {
    return this.http.post<ProjectMilestone>(this.apiUrl, dto);
  }

  findByProjectId(projectId: number): Observable<ProjectMilestone[]> {
    return this.http.get<ProjectMilestone[]>(`${this.apiUrl}/project/${projectId}`);
  }

  findOne(id: number): Observable<ProjectMilestone> {
    return this.http.get<ProjectMilestone>(`${this.apiUrl}/${id}`);
  }

  update(id: number, dto: UpdateProjectMilestoneDto): Observable<ProjectMilestone> {
    return this.http.patch<ProjectMilestone>(`${this.apiUrl}/${id}`, dto);
  }

  complete(id: number): Observable<ProjectMilestone> {
    return this.http.patch<ProjectMilestone>(`${this.apiUrl}/${id}/complete`, {});
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
