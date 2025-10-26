import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  EstadoProyecto,
  Project,
  UpdateProjectDto,
} from '../../../core/model/project.model';
import { ProjectsService } from '../../../core/services/projects.service';

@Component({
  selector: 'app-edit-project-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-project-details.component.html',
  styleUrl: './edit-project-details.component.css',
})
export class EditProjectDetailsComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error: string | null = null;
  estadoProyecto = EstadoProyecto;
  estadoProyectoEntries: [keyof typeof EstadoProyecto, string][];
  projectId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.estadoProyectoEntries = Object.entries(EstadoProyecto) as [
      keyof typeof EstadoProyecto,
      string
    ][];
    this.form = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
        ],
      ],
      descripcion: [''],
      fechaInicio: [''],
      fechaFin: [''],
      estado: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('projectId');
      this.projectId = id ? +id : null;
      if (this.projectId) {
        this.loading = true;
        this.projectsService.findOne(this.projectId).subscribe({
          next: (project: Project) => {
            this.form.patchValue({
              nombre: project.nombre,
              descripcion: project.descripcion,
              fechaInicio: project.fechaInicio || '',
              fechaFin: project.fechaFin || '',
              estado: project.estado || '',
            });
            this.loading = false;
          },
          error: (err) => {
            this.error = 'No se pudo cargar el proyecto';
            this.loading = false;
          },
        });
      }
    });
  }

  submit() {
    if (this.form.invalid || !this.projectId) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = null;
    const dto: UpdateProjectDto = { ...this.form.value };
    this.projectsService.update(this.projectId, dto).subscribe({
      next: (_project: Project) => {
        this.loading = false;
        this.router.navigate(['/admin/main']); // Or redirect to kanban/project page
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al actualizar el proyecto';
      },
    });
  }

  get nombre() {
    return this.form.get('nombre');
  }
  get descripcion() {
    return this.form.get('descripcion');
  }
  get fechaInicio() {
    return this.form.get('fechaInicio');
  }
  get fechaFin() {
    return this.form.get('fechaFin');
  }
  get estado() {
    return this.form.get('estado');
  }
}
