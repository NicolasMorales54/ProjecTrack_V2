import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubtaskFilesService, SubtaskFile } from '../../../core/services/subtask-files.service';

@Component({
  selector: 'app-subtask-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subtask-file-upload.component.html',
  styles: []
})
export class SubtaskFileUploadComponent implements OnInit {
  @Input() subtaskId!: number;

  files: SubtaskFile[] = [];
  uploading: boolean = false;
  uploadProgress: number = 0;
  error: string = '';
  dragOver: boolean = false;

  constructor(private subtaskFilesService: SubtaskFilesService) {}

  ngOnInit(): void {
    if (this.subtaskId) {
      this.loadFiles();
    }
  }

  loadFiles(): void {
    this.subtaskFilesService.getFilesBySubtaskId(this.subtaskId).subscribe({
      next: (files) => {
        this.files = files;
      },
      error: (err) => {
        console.error('Error loading files:', err);
        this.error = 'Error al cargar los archivos';
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  uploadFile(file: File): void {
    this.uploading = true;
    this.uploadProgress = 0;
    this.error = '';

    this.subtaskFilesService.uploadFile(this.subtaskId, file).subscribe({
      next: (progress) => {
        this.uploadProgress = progress.progress;
        if (progress.file) {
          this.files.push(progress.file);
          this.uploading = false;
          this.uploadProgress = 0;
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.error = err.error?.message || 'Error al subir el archivo';
        this.uploading = false;
        this.uploadProgress = 0;
      }
    });
  }

  downloadFile(file: SubtaskFile): void {
    this.subtaskFilesService.downloadFile(file.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.nombre;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download error:', err);
        this.error = 'Error al descargar el archivo';
      }
    });
  }

  deleteFile(file: SubtaskFile): void {
    if (confirm(`¿Estás seguro de eliminar el archivo "${file.nombre}"?`)) {
      this.subtaskFilesService.deleteFile(file.id).subscribe({
        next: () => {
          this.files = this.files.filter(f => f.id !== file.id);
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.error = 'Error al eliminar el archivo';
        }
      });
    }
  }

  formatFileSize(bytes: number): string {
    return this.subtaskFilesService.formatFileSize(bytes);
  }

  getFileIcon(tipo: string): string {
    return this.subtaskFilesService.getFileIcon(tipo);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
