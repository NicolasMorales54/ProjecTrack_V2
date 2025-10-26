import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  SubtaskAssignment,
  CreateSubtaskAssignmentDto,
  UpdateSubtaskAssignmentDto,
} from '../model/subtask-assignment.model';
import { LoginService } from '../../auth/services/login.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubtaskAssignmentsService {
  private readonly apiUrl = `${environment.apiUrl}/subtask-assignments`;

  constructor(private http: HttpClient, private loginService: LoginService) {}

  create(dto: CreateSubtaskAssignmentDto): Observable<SubtaskAssignment> {
    return this.http.post<SubtaskAssignment>(this.apiUrl, dto);
  }

  findAll(): Observable<SubtaskAssignment[]> {
    return this.http.get<SubtaskAssignment[]>(this.apiUrl);
  }

  findOne(id: number): Observable<SubtaskAssignment> {
    return this.http.get<SubtaskAssignment>(`${this.apiUrl}/${id}`);
  }

  update(
    id: number,
    dto: UpdateSubtaskAssignmentDto
  ): Observable<SubtaskAssignment> {
    return this.http.patch<SubtaskAssignment>(`${this.apiUrl}/${id}`, dto);
  }

  remove(id: number): Observable<SubtaskAssignment> {
    return this.http.delete<SubtaskAssignment>(`${this.apiUrl}/${id}`);
  }

  findBySubtaskId(subtaskId: number): Observable<SubtaskAssignment[]> {
    return this.http.get<SubtaskAssignment[]>(
      `${this.apiUrl}/subtask/${subtaskId}`
    );
  }

  findByUserId(userId: number): Observable<SubtaskAssignment[]> {
    return this.http.get<SubtaskAssignment[]>(`${this.apiUrl}/user/${userId}`);
  }

  findMySubtaskAssignments(): Observable<SubtaskAssignment[]> {
    const userId = this.loginService.getCurrentUserId();
    if (userId) {
      return this.findByUserId(userId);
    }
    return this.findAll();
  }
}
