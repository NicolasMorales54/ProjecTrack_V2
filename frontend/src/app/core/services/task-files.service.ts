import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TaskFile {
  id: number;
  taskId: number;
  nombre: string;
  ruta: string;
  tipo: string;
  tamano: number;  // Changed from tamaño to tamano (Angular doesn't support ñ in templates)
  uploadedById: number;
  fechaSubida: Date;
  uploadedBy?: {
    id: number;
    nombres: string;
    apellidos: string;
  };
}

export interface UploadProgress {
  progress: number;
  file?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TaskFilesService {
  private apiUrl = 'http://localhost:3000/task-files';

  constructor(private http: HttpClient) {}

  uploadFile(taskId: number, file: File): Observable<UploadProgress> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload/${taskId}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
            return { progress };
          case HttpEventType.Response:
            return { progress: 100, file: event.body };
          default:
            return { progress: 0 };
        }
      })
    );
  }

  getFilesByTaskId(taskId: number): Observable<TaskFile[]> {
    return this.http.get<TaskFile[]>(`${this.apiUrl}/task/${taskId}`);
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
        return 'file-text';
      case 'imagen':
        return 'image';
      case 'documento':
        return 'file';
      default:
        return 'file';
    }
  }
}
