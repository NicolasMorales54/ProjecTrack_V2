export enum TipoRecurso {
  HUMANO = 'humano',
  MATERIAL = 'material',
  FINANCIERO = 'financiero',
}

export interface ProjectResource {
  id: number;
  proyectoId: number;
  tipo: TipoRecurso;
  nombre: string;
  descripcion?: string;
  cantidad?: number;
  costo?: number;
  asignado: boolean;
  tareaId?: number;
  subtareaId?: number;
  tarea?: { id: number; nombre: string };
  subtarea?: { id: number; titulo: string };
  fechaCreacion: Date;
}

export interface CreateProjectResourceDto {
  proyectoId: number;
  tipo: TipoRecurso;
  nombre: string;
  descripcion?: string;
  cantidad?: number;
  costo?: number;
  tareaId?: number;
  subtareaId?: number;
}

export interface UpdateProjectResourceDto {
  tipo?: TipoRecurso;
  nombre?: string;
  descripcion?: string;
  cantidad?: number;
  costo?: number;
  asignado?: boolean;
  tareaId?: number;
  subtareaId?: number;
}

export interface ProjectResourcesSummary {
  humanos: ProjectResource[];
  materiales: ProjectResource[];
  financieros: ProjectResource[];
  costoTotal: number;
}
