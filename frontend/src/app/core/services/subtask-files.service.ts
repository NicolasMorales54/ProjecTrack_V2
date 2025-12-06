import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface SubtaskFile {
  id: number;
  subtaskId: number;
  nombre: string;
  ruta: string;
  tipo: string;
  tamano: number;
  uploadedById: number;
  fechaSubida: Date;
  uploadedBy?: {
    id: number;
    nombres?: string;
    apellidos?: string;
  };
}

export interface UploadProgress {
  progress: number;
  file?: SubtaskFile;
}

@Injectable({
  providedIn: 'root'
})
export class SubtaskFilesService {
  private apiUrl = `${environment.apiUrl}/subtask-files`;

  constructor(private http: HttpClient) {}

  uploadFile(subtaskId: number, file: File): Observable<UploadProgress> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(
      `${this.apiUrl}/upload/${subtaskId}`,
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    ).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * event.loaded / (event.total || event.loaded));
          return { progress };
        } else if (event.type === HttpEventType.Response) {
          return { progress: 100, file: event.body.file };
        }
        return { progress: 0 };
      })
    );
  }

  getFilesBySubtaskId(subtaskId: number): Observable<SubtaskFile[]> {
    return this.http.get<SubtaskFile[]>(`${this.apiUrl}/subtask/${subtaskId}`);
  }

  downloadFile(fileId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${fileId}/download`, {
      responseType: 'blob'
    });
  }

  deleteFile(fileId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${fileId}`);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getFileIcon(tipo: string): string {
    switch (tipo) {
      case 'pdf':
        return 'pdf';
      case 'imagen':
        return 'image';
      default:
        return 'file';
    }
  }
}
