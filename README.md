# Projectrack

Sistema completo de gestión de proyectos con control de acceso basado en roles (RBAC), seguimiento de tiempo, notificaciones en tiempo real y tableros Kanban.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Arquitectura](#arquitectura)
- [Roles y Permisos](#roles-y-permisos)
- [API Endpoints](#api-endpoints)
- [Despliegue](#despliegue)
- [Desarrollo](#desarrollo)
- [Licencia](#licencia)

## Características

- **Gestión de Proyectos**: Creación, seguimiento y administración completa de proyectos
- **Sistema de Tareas**: Tareas con prioridades, estados y asignaciones múltiples
- **Tablero Kanban**: Visualización interactiva del flujo de trabajo
- **Control de Roles**: 4 roles con permisos específicos (Admin, Líder, Empleado, Cliente)
- **Registro de Tiempo**: Seguimiento detallado del tiempo dedicado a cada tarea
- **Notificaciones en Tiempo Real**: WebSockets para actualizaciones instantáneas
- **Correo Interno**: Sistema de mensajería entre usuarios del sistema
- **Reportes y Estadísticas**: Visualización de métricas con gráficos interactivos
- **Responsive Design**: Interfaz adaptable a dispositivos móviles y escritorio

## Tecnologías

### Backend
- **Framework**: NestJS 10.x
- **Lenguaje**: TypeScript 5.x
- **ORM**: TypeORM 0.3.x
- **Base de Datos**: MySQL 8.x
- **Autenticación**: Passport.js (JWT + Local Strategy)
- **Real-time**: Socket.IO para WebSockets
- **Validación**: class-validator + class-transformer

### Frontend
- **Framework**: Angular 19 (Standalone Components)
- **Lenguaje**: TypeScript 5.x
- **Estilos**: Tailwind CSS 3.x + DaisyUI + Flowbite
- **Componentes UI**:
  - Syncfusion (Grids, Calendarios)
  - Preline UI
  - ApexCharts (Visualización de datos)
- **Iconos**: Lucide Angular
- **HTTP**: Angular HttpClient con interceptores

### DevOps
- **Contenedores**: Docker + Docker Compose
- **Control de Versiones**: Git
- **Deploy**:
  - Backend: Google Cloud VM
  - Frontend: Netlify
  - Database: MySQL en Docker

## Requisitos Previos

- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **MySQL**: >= 8.x
- **Git**: >= 2.x
- **Docker** (opcional): >= 20.x
- **Docker Compose** (opcional): >= 2.x

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/projectrack.git
cd projectrack
```

### 2. Configurar la Base de Datos

#### Opción A: MySQL Local

```bash
# Conectarse a MySQL
mysql -u root -p

# Crear la base de datos
CREATE DATABASE yofer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Salir de MySQL
exit;

# Importar el esquema
mysql -u root -p yofer < BD_mysql.sql
```

#### Opción B: Docker

```bash
# Levantar MySQL en Docker
docker-compose up -d mysql
```

### 3. Configurar el Backend

```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
# Editar app.module.ts si necesitas cambiar la configuración de BD
```

### 4. Configurar el Frontend

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install
```

## Uso

### Desarrollo Local

#### Iniciar el Backend

```bash
cd backend
npm run start:dev
```

El backend estará disponible en: `http://localhost:3000`

#### Iniciar el Frontend

```bash
cd frontend
npm start
```

El frontend estará disponible en: `http://localhost:4200`

### Credenciales de Prueba

El sistema incluye usuarios de prueba para cada rol:

**Administrador:**
- Email: `mariafernandacabarico@ufps.edu.co`
- Contraseña: `maria`

**Líder de Proyecto:**
- Email: `danielstiven@ufps.edu.co`
- Contraseña: `Daniel`

**Empleado:**
- Email: `yofernicolasmc@ufps.edu.co`
- Contraseña: `nicolas`

**Cliente:**
- Email: `cliente@ufps.edu.co`
- Contraseña: `cliente`

### Comandos Útiles

#### Backend

```bash
# Desarrollo con hot-reload
npm run start:dev

# Build de producción
npm run build

# Ejecutar producción
npm run start:prod

# Tests
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage

# Linting y formato
npm run lint
npm run format
```

#### Frontend

```bash
# Servidor de desarrollo
npm start

# Build de producción
npm run build

# Tests
npm test

# Generar componente
ng generate component nombre-componente

# Generar servicio
ng generate service nombre-servicio
```

## Arquitectura

### Estructura del Proyecto

```
projectrack/
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── auth/              # Autenticación (JWT, Guards)
│   │   ├── users/             # Gestión de usuarios
│   │   ├── projects/          # Gestión de proyectos
│   │   ├── tasks/             # Gestión de tareas
│   │   ├── subtasks/          # Gestión de subtareas
│   │   ├── time-register/     # Registro de tiempo
│   │   ├── notifications/     # Notificaciones WebSocket
│   │   ├── emails/            # Correo interno
│   │   ├── app.module.ts      # Módulo principal
│   │   └── main.ts            # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # SPA Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/          # Login y recuperación
│   │   │   ├── admin/         # Módulo de administrador
│   │   │   ├── leader/        # Módulo de líder
│   │   │   ├── employee/      # Módulo de empleado
│   │   │   ├── client/        # Módulo de cliente
│   │   │   ├── core/          # Servicios, guards, interceptores
│   │   │   └── shared/        # Componentes compartidos
│   │   ├── assets/
│   │   └── index.html
│   ├── package.json
│   └── angular.json
│
├── BD_mysql.sql               # Esquema de base de datos
├── docker-compose.yml         # Configuración Docker
├── CLAUDE.md                  # Documentación de desarrollo
├── DEPLOYMENT.md              # Guía de despliegue
└── README.md                  # Este archivo
```

### Flujo de Autenticación

```
┌─────────┐        ┌─────────┐        ┌──────────┐
│ Cliente │        │ Backend │        │   MySQL  │
└────┬────┘        └────┬────┘        └────┬─────┘
     │                  │                   │
     │ POST /auth/login │                   │
     ├─────────────────>│                   │
     │                  │ Validar usuario   │
     │                  ├──────────────────>│
     │                  │                   │
     │                  │<──────────────────┤
     │                  │ Generar JWT       │
     │      JWT Token   │                   │
     │<─────────────────┤                   │
     │                  │                   │
     │ GET /projects    │                   │
     │ Header: Bearer   │                   │
     ├─────────────────>│                   │
     │                  │ Validar JWT       │
     │                  │                   │
     │      Datos       │                   │
     │<─────────────────┤                   │
```

### Base de Datos

El sistema utiliza las siguientes tablas principales:

- `usuarios` - Información de usuarios y roles
- `proyectos` - Proyectos con estados
- `tareas` - Tareas vinculadas a proyectos
- `subtareas` - Subtareas de las tareas
- `asignaciones_tareas` - Relación muchos-a-muchos usuarios-tareas
- `asignaciones_subtareas` - Relación muchos-a-muchos usuarios-subtareas
- `registros_tiempo` - Seguimiento de tiempo
- `notificaciones` - Notificaciones del sistema
- `correos_internos` - Mensajes entre usuarios

Ver [BD_mysql.sql](BD_mysql.sql) para el esquema completo.

## Roles y Permisos

### Administrador
- Acceso completo al sistema
- Gestión de usuarios (crear, editar, eliminar)
- Gestión de proyectos (todos los proyectos)
- Asignación de roles
- Visualización de estadísticas globales

### Líder de Proyecto
- Crear y gestionar proyectos propios
- Crear y asignar tareas
- Ver y editar información del proyecto
- Gestionar miembros del equipo en sus proyectos
- Ver reportes de sus proyectos

### Empleado
- Ver proyectos asignados
- Ver y actualizar tareas asignadas
- Registrar tiempo de trabajo
- Cambiar estado de sus tareas
- Ver notificaciones

### Cliente
- Ver proyectos asociados (solo lectura)
- Ver tareas del proyecto (solo lectura)
- Ver progreso del proyecto
- Recibir notificaciones de cambios

## API Endpoints

### Autenticación
```
POST   /auth/login          - Iniciar sesión
POST   /auth/logout         - Cerrar sesión
GET    /auth/profile        - Obtener perfil del usuario
```

### Usuarios
```
GET    /users               - Listar usuarios
GET    /users/:id           - Obtener usuario
POST   /users               - Crear usuario
PATCH  /users/:id           - Actualizar usuario
DELETE /users/:id           - Eliminar usuario
```

### Proyectos
```
GET    /projects            - Listar proyectos
GET    /projects/:id        - Obtener proyecto
POST   /projects            - Crear proyecto
PATCH  /projects/:id        - Actualizar proyecto
DELETE /projects/:id        - Eliminar proyecto
GET    /projects/:id/stats  - Estadísticas del proyecto
```

### Tareas
```
GET    /tasks               - Listar tareas
GET    /tasks/:id           - Obtener tarea
POST   /tasks               - Crear tarea
PATCH  /tasks/:id           - Actualizar tarea
DELETE /tasks/:id           - Eliminar tarea
POST   /tasks/:id/assign    - Asignar tarea a usuario
```

### Registro de Tiempo
```
GET    /time-register       - Listar registros
POST   /time-register       - Crear registro
PATCH  /time-register/:id   - Actualizar registro
DELETE /time-register/:id   - Eliminar registro
```

### Notificaciones (WebSocket)
```
WS     /notifications       - Conexión WebSocket
Event: notification         - Recibir notificación
Event: read                 - Marcar como leída
```

## Despliegue

### Producción con Docker

```bash
# Construir y levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Despliegue en la Nube

Para instrucciones detalladas de despliegue en Google Cloud y Netlify, consulta [DEPLOYMENT.md](DEPLOYMENT.md).

## Desarrollo

### Estructura de Código

#### Backend (NestJS)

```typescript
// Ejemplo de controlador
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }
}
```

#### Frontend (Angular)

```typescript
// Ejemplo de componente standalone
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-list.component.html'
})
export class ProjectListComponent {
  // Component logic
}
```

### Agregar un Nuevo Módulo Backend

```bash
cd backend
nest generate resource nombre-modulo
```

Esto creará:
- Controlador
- Servicio
- Módulo
- DTOs
- Entidad

### Agregar un Nuevo Componente Frontend

```bash
cd frontend
ng generate component ruta/nombre-componente
```

### Convenciones de Código

#### Backend
- Nombres de entidades: PascalCase (ej: `User`, `Project`)
- Nombres de columnas DB: snake_case (ej: `created_at`, `user_id`)
- DTOs: `CreateUserDto`, `UpdateUserDto`
- Servicios: `UsersService`
- Controladores: `UsersController`

#### Frontend
- Componentes: kebab-case (ej: `project-list.component.ts`)
- Servicios: kebab-case (ej: `auth.service.ts`)
- Clases: PascalCase (ej: `ProjectModel`)
- Constantes: UPPER_SNAKE_CASE (ej: `API_URL`)

## Tests

### Backend

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend

```bash
cd frontend

# Unit tests
npm test

# E2E tests (Karma)
ng e2e
```

## Troubleshooting

### Error: Cannot connect to database

**Solución:**
1. Verificar que MySQL esté corriendo
2. Revisar credenciales en `app.module.ts`
3. Verificar puerto 3306

### Error: CORS policy

**Solución:**
1. Verificar `FRONTEND_URL` en `main.ts`
2. Agregar dominio permitido en configuración CORS

### Error: Port already in use

**Solución:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

## Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## Licencia

Este proyecto es privado y confidencial.

## Contacto

Para preguntas o soporte:
- Email: soporte@projectrack.com
- Documentación: Ver [CLAUDE.md](CLAUDE.md) para detalles de desarrollo

## Changelog

### v1.0.0 (2025-01-26)
- Lanzamiento inicial
- Sistema completo de gestión de proyectos
- 4 roles con permisos diferenciados
- Notificaciones en tiempo real
- Tablero Kanban
- Registro de tiempo
- Sistema de correo interno
