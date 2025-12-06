import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFilesService, TaskFile } from '../../../core/services/task-files.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html'
})
export class FileUploadComponent implements OnInit {
  @Input() taskId!: number;

  files: TaskFile[] = [];
  uploading: boolean = false;
  uploadProgress: number = 0;
  error: string = '';
  dragOver: boolean = false;

  constructor(
    private taskFilesService: TaskFilesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('FileUploadComponent initialized with taskId:', this.taskId);
    if (this.taskId) {
      this.loadFiles();
    }
  }

  loadFiles() {
    console.log('Loading files for taskId:', this.taskId);
    this.taskFilesService.getFilesByTaskId(this.taskId).subscribe({
      next: (files) => {
        console.log('Files loaded:', files);
        this.files = files;
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      error: (err) => {
        console.error('Error al cargar archivos:', err);
      }
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile(input.files[0]);
    }
  }

  uploadFile(file: File) {
    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.error = 'El archivo es demasiado grande. Máximo 10MB.';
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;
    this.error = '';

    this.taskFilesService.uploadFile(this.taskId, file).subscribe({
      next: (progress) => {
        console.log('Upload progress event:', progress);
        this.uploadProgress = progress.progress;
        this.cdr.detectChanges(); // Actualizar la barra de progreso

        // Si llegó al 100% y tenemos el archivo en la respuesta
        if (progress.progress === 100 && progress.file) {
          console.log('Upload completed, reloading files...');
          setTimeout(() => {
            this.uploading = false;
            this.uploadProgress = 0;
            this.loadFiles();
          }, 300); // Pequeño delay para que se vea el 100%
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.uploading = false;
        this.uploadProgress = 0;
        this.error = err.error?.message || 'Error al subir el archivo';
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('Upload observable completed');
        // Por si acaso el observable se completa sin llegar al evento Response
        if (this.uploading) {
          setTimeout(() => {
            this.uploading = false;
            this.uploadProgress = 0;
            this.loadFiles();
          }, 300);
        }
      }
    });
  }

  downloadFile(file: TaskFile) {
    this.taskFilesService.downloadFile(file.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.nombre;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar archivo:', err);
        this.error = 'Error al descargar el archivo';
      }
    });
  }

  deleteFile(file: TaskFile) {
    if (!confirm(`¿Estás seguro de eliminar "${file.nombre}"?`)) {
      return;
    }

    this.taskFilesService.deleteFile(file.id).subscribe({
      next: () => {
        this.loadFiles();
      },
      error: (err) => {
        console.error('Error al eliminar archivo:', err);
        this.error = 'Error al eliminar el archivo';
      }
    });
  }

  formatFileSize(bytes: number): string {
    return this.taskFilesService.formatFileSize(bytes);
  }

  getFileIcon(tipo: string): string {
    return this.taskFilesService.getFileIcon(tipo);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
