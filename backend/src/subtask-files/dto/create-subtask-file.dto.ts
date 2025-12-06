export class CreateSubtaskFileDto {
  subtaskId: number;
  nombre: string;
  ruta: string;
  tipo?: string;
  tamano?: number;
  uploadedById?: number;
}
