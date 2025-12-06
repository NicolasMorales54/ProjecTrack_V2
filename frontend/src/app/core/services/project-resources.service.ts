import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ProjectResource,
  CreateProjectResourceDto,
  UpdateProjectResourceDto,
  ProjectResourcesSummary,
} from '../model/project-resource.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectResourcesService {
  private readonly apiUrl = `${environment.apiUrl}/project-resources`;

  constructor(private http: HttpClient) {}

  create(dto: CreateProjectResourceDto): Observable<ProjectResource> {
    return this.http.post<ProjectResource>(this.apiUrl, dto);
  }

  findByProjectId(projectId: number): Observable<ProjectResource[]> {
    return this.http.get<ProjectResource[]>(`${this.apiUrl}/project/${projectId}`);
  }

  getResourcesSummary(projectId: number): Observable<ProjectResourcesSummary> {
    return this.http.get<ProjectResourcesSummary>(`${this.apiUrl}/project/${projectId}/summary`);
  }

  findOne(id: number): Observable<ProjectResource> {
    return this.http.get<ProjectResource>(`${this.apiUrl}/${id}`);
  }

  update(id: number, dto: UpdateProjectResourceDto): Observable<ProjectResource> {
    return this.http.patch<ProjectResource>(`${this.apiUrl}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
