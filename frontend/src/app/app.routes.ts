import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then(m => m.Shell),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'recursos/:tipo',
        loadComponent: () => import('./pages/recurso-list/recurso-list').then(m => m.RecursoList),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/usuarios/usuarios').then(m => m.Usuarios),
        canActivate: [adminGuard],
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
