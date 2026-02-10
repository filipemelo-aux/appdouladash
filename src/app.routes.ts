import { Routes } from '@angular/router';
import { authGuard } from './app/core/auth/auth.guard';
import { adminGuard } from './app/core/auth/admin.guard';
import { clientGuard } from './app/core/auth/client.guard';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./app/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'change-password',
    canActivate: [authGuard],
    loadComponent: () => import('./app/auth/change-password/change-password.component').then(c => c.ChangePasswordComponent)
  },
  // Admin Routes
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./app/admin/dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),
      },
      {
        path: 'clients',
        loadComponent: () => import('./app/admin/clients/clients.component').then(c => c.ClientsComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./app/admin/users/users.component').then(c => c.UsersComponent),
      },
      {
        path: 'agenda',
        loadComponent: () => import('./app/admin/agenda/agenda.component').then(c => c.AgendaComponent),
      },
      {
        path: 'finance',
        loadComponent: () => import('./app/admin/finance/finance.component').then(c => c.FinanceComponent),
      }
    ]
  },
  // Client Portal Routes
  {
    path: 'client',
    canActivate: [authGuard, clientGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./app/portal/home/home.component').then(c => c.HomeComponent),
      },
      {
        path: 'agenda',
        loadComponent: () => import('./app/portal/agenda/agenda.component').then(c => c.AgendaComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./app/portal/profile/profile.component').then(c => c.ProfileComponent),
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
