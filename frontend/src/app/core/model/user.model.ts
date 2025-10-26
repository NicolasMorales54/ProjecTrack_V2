export interface User {
  id: number;
  nombre?: string;
  correoElectronico: string;
  rol?: 'Administrador' | 'Líder de Proyecto' | 'Empleado' | 'Cliente';
  createdAt?: string;
  updatedAt?: string;
  primerNombre?: string;
  segundoNombre?: string;
}

export interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

export interface TokenPayload {
  userId: number;
  email: string;
  rol?: 'Administrador' | 'Líder de Proyecto' | 'Empleado' | 'Cliente';
  iat: number;
  exp: number;
}
