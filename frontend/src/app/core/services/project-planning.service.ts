import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProjectPlanning {
  id: number;
  projectId: number;
  objetivos?: string;
  alcance?: string;
  presupuesto?: number;
  fechaClaveInicio?: string | Date;
  fechaClaveFin?: string | Date;
  notas?: string;
  creadoPorId?: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface CreateProjectPlanningDto {
  projectId: number;
  objetivos?: string;
  alcance?: string;
  presupuesto?: number;
  fechaClaveInicio?: string;
  fechaClaveFin?: string;
  notas?: string;
  creadoPorId?: number;
}

export interface UpdateProjectPlanningDto {
  objetivos?: string;
  alcance?: string;
  presupuesto?: number;
  fechaClaveInicio?: string;
  fechaClaveFin?: string;
  notas?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectPlanningService {
  private readonly apiUrl = `${environment.apiUrl}/project-planning`;

  constructor(private http: HttpClient) {}

  create(dto: CreateProjectPlanningDto): Observable<ProjectPlanning> {
    return this.http.post<ProjectPlanning>(this.apiUrl, dto);
  }

  findByProjectId(projectId: number): Observable<ProjectPlanning | null> {
    return this.http.get<ProjectPlanning | null>(`${this.apiUrl}/project/${projectId}`);
  }

  findOne(id: number): Observable<ProjectPlanning> {
    return this.http.get<ProjectPlanning>(`${this.apiUrl}/${id}`);
  }

  update(id: number, dto: UpdateProjectPlanningDto): Observable<ProjectPlanning> {
    return this.http.patch<ProjectPlanning>(`${this.apiUrl}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
