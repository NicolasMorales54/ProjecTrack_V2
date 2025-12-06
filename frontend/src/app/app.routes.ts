import { Routes } from '@angular/router';

import { EmployeeComponent } from './employee/employee.component';
import { LeaderComponent } from './leader/leader.component';
import { ClientComponent } from './client/client.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.routes').then((m) => m.default),
  },
  {
    path: 'recover-password',
    loadComponent: () =>
      import('./auth/recover-password/recover-password.component').then(
        (m) => m.RecoverPasswordComponent
      ),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./admin/admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: 'main',
        loadComponent: () =>
          import('./admin/main-page/main-page.component').then(
            (m) => m.MainPageComponent
          ),
      },
      {
        path: 'all-users',
        loadComponent: () =>
          import('./admin/all-users/all-users.component').then(
            (m) => m.AllUsersComponent
          ),
      },
      {
        path: 'all-projects',
        loadComponent: () =>
          import('./admin/all-projects/all-projects.component').then(
            (m) => m.AllProjectsComponent
          ),
      },
      {
        path: 'create-project',
        loadComponent: () =>
          import('./admin/pages/create-project/create-project.component').then(
            (m) => m.CreateProjectComponent
          ),
      },
      {
        path: 'project/:projectId/resumen',
        loadComponent: () =>
          import('./shared/pages/resumen/resumen.component').then(
            (m) => m.ResumenComponent
          ),
      },
      {
        path: 'project/:projectId/kanban',
        loadComponent: () =>
          import('./shared/pages/kanban/kanban.component').then(
            (m) => m.KanbanComponent
          ),
      },
      {
        path: 'project/:projectId/create-task',
        loadComponent: () =>
          import('./admin/pages/create-task/create-task.component').then(
            (m) => m.CreateTaskComponent
          ),
      },
      {
        path: 'project/:projectId/task-detail/:taskId',
        loadComponent: () =>
          import('./admin/pages/task-detail/task-detail.component').then(
            (m) => m.TaskDetailComponent
          ),
      },
      {
        path: 'project/:projectId/users',
        loadComponent: () =>
          import('./admin/pages/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'project/:projectId/cronograma',
        loadComponent: () =>
          import('./shared/pages/cronograma/cronograma.component').then(
            (m) => m.CronogramaComponent
          ),
      },
      {
        path: 'inbox',
        loadComponent: () =>
          import('./shared/components/email/inbox/inbox.component').then(
            (m) => m.InboxComponent
          ),
      },
      {
        path: 'conversation/:id',
        loadComponent: () =>
          import(
            './shared/components/email/conversation/conversation.component'
          ).then((m) => m.ConversationComponent),
      },
      {
        path: 'send-email/:userId',
        loadComponent: () =>
          import('./shared/components/email/send-email/send-email.component').then(
            (m) => m.SendEmailComponent
          ),
      },
      {
        path: 'recover-password',
        loadComponent: () =>
          import(
            './admin/pages/recover-password/recover-password.component'
          ).then((m) => m.RecoverPasswordComponent),
      },
      {
        path: 'project/:projectId/edit-details',
        loadComponent: () =>
          import(
            './admin/pages/edit-project-details/edit-project-details.component'
          ).then((m) => m.EditProjectDetailsComponent),
      },
    ],
  },
  {
    path: 'leader',
    canActivate: [authGuard],
    component: LeaderComponent,
    children: [
      {
        path: 'main',
        loadComponent: () =>
          import('./leader/main-page/main-page.component').then(
            (m) => m.MainPageComponent
          ),
      },
      {
        path: 'project/:projectId/resumen',
        loadComponent: () =>
          import('./shared/pages/resumen/resumen.component').then(
            (m) => m.ResumenComponent
          ),
      },
      {
        path: 'project/:projectId/users',
        loadComponent: () =>
          import('./leader/pages/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'project/:projectId/kanban',
        loadComponent: () =>
          import('./shared/pages/kanban/kanban.component').then(
            (m) => m.KanbanComponent
          ),
      },
      {
        path: 'project/:projectId/create-task',
        loadComponent: () =>
          import('./leader/pages/create-task/create-task.component').then(
            (m) => m.CreateTaskComponent
          ),
      },
      {
        path: 'project/:projectId/task-detail/:taskId',
        loadComponent: () =>
          import('./leader/pages/task-detail/task-detail.component').then(
            (m) => m.TaskDetailComponent
          ),
      },
      {
        path: 'project/:projectId/cronograma',
        loadComponent: () =>
          import('./shared/pages/cronograma/cronograma.component').then(
            (m) => m.CronogramaComponent
          ),
      },
      {
        path: 'project/:projectId/users',
        loadComponent: () =>
          import('./leader/pages/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'inbox',
        loadComponent: () =>
          import('./shared/components/email/inbox/inbox.component').then(
            (m) => m.InboxComponent
          ),
      },
      {
        path: 'conversation/:id',
        loadComponent: () =>
          import(
            './shared/components/email/conversation/conversation.component'
          ).then((m) => m.ConversationComponent),
      },
      {
        path: 'send-email/:userId',
        loadComponent: () =>
          import('./shared/components/email/send-email/send-email.component').then(
            (m) => m.SendEmailComponent
          ),
      },
      {
        path: 'recover-password',
        loadComponent: () =>
          import(
            './leader/pages/recover-password/recover-password.component'
          ).then((m) => m.RecoverPasswordComponent),
      },
      {
        path: 'project/:projectId/edit-details',
        loadComponent: () =>
          import(
            './admin/pages/edit-project-details/edit-project-details.component'
          ).then((m) => m.EditProjectDetailsComponent),
      },
      // Add more leader-specific child routes here
    ],
  },
  {
    path: 'employee',
    canActivate: [authGuard],
    component: EmployeeComponent,
    children: [
      {
        path: 'main',
        loadComponent: () =>
          import('./employee/main-page/main-page.component').then(
            (m) => m.MainPageComponent
          ),
      },
      {
        path: 'project/:projectId/resumen',
        loadComponent: () =>
          import('./shared/pages/resumen/resumen.component').then(
            (m) => m.ResumenComponent
          ),
      },
      {
        path: 'project/:projectId/kanban',
        loadComponent: () =>
          import('./shared/pages/kanban/kanban.component').then(
            (m) => m.KanbanComponent
          ),
      },
      // Ruta de crear tarea deshabilitada para empleados
      // Los empleados no pueden crear tareas
      {
        path: 'project/:projectId/create-task',
        redirectTo: 'project/:projectId/kanban',
        pathMatch: 'full'
      },
      {
        path: 'project/:projectId/task-detail/:taskId',
        loadComponent: () =>
          import('./employee/pages/task-detail/task-detail.component').then(
            (m) => m.TaskDetailComponent
          ),
      },
      {
        path: 'project/:projectId/users',
        loadComponent: () =>
          import('./employee/pages/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'inbox',
        loadComponent: () =>
          import('./shared/components/email/inbox/inbox.component').then(
            (m) => m.InboxComponent
          ),
      },
      {
        path: 'conversation/:id',
        loadComponent: () =>
          import(
            './shared/components/email/conversation/conversation.component'
          ).then((m) => m.ConversationComponent),
      },
      {
        path: 'send-email/:userId',
        loadComponent: () =>
          import(
            './shared/components/email/send-email/send-email.component'
          ).then((m) => m.SendEmailComponent),
      },
      {
        path: 'recover-password',
        loadComponent: () =>
          import(
            './leader/pages/recover-password/recover-password.component'
          ).then((m) => m.RecoverPasswordComponent),
      },
      // Add more employee-specific child routes here
    ],
  },
  {
    path: 'client',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./client/client.component').then((m) => m.ClientComponent),
    children: [
      {
        path: 'main',
        loadComponent: () =>
          import('./client/main-page/main-page.component').then(
            (m) => m.MainPageComponent
          ),
      },
      {
        path: 'project/:projectId/resumen',
        loadComponent: () =>
          import('./shared/pages/resumen/resumen.component').then(
            (m) => m.ResumenComponent
          ),
      },
      {
        path: 'project/:projectId/kanban',
        loadComponent: () =>
          import('./shared/pages/kanban/kanban.component').then(
            (m) => m.KanbanComponent
          ),
      },
      // Los clientes no pueden crear tareas
      {
        path: 'project/:projectId/create-task',
        redirectTo: 'project/:projectId/kanban',
        pathMatch: 'full',
      },
      {
        path: 'project/:projectId/task-detail/:taskId',
        loadComponent: () =>
          import('./client/pages/task-detail/task-detail.component').then(
            (m) => m.TaskDetailComponent
          ),
      },
      {
        path: 'project/:projectId/users',
        loadComponent: () =>
          import('./client/pages/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'recover-password',
        loadComponent: () =>
          import(
            './client/pages/recover-password/recover-password.component'
          ).then((m) => m.RecoverPasswordComponent),
      },
      {
        path: 'inbox',
        loadComponent: () =>
          import('./shared/components/email/inbox/inbox.component').then(
            (m) => m.InboxComponent
          ),
      },
      {
        path: 'conversation/:id',
        loadComponent: () =>
          import(
            './shared/components/email/conversation/conversation.component'
          ).then((m) => m.ConversationComponent),
      },
      {
        path: 'send-email/:userId',
        loadComponent: () =>
          import('./shared/components/email/send-email/send-email.component').then(
            (m) => m.SendEmailComponent
          ),
      },
      // Add more client-specific child routes here
    ],
  },
  // Catch-all route
  {
    path: '**',
    redirectTo: 'login',
  },
];
