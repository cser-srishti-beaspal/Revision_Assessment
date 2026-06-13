import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { authGuard } from './auth/guards/auth.guard';
import { adminGuard } from './auth/guards/admin.guard';
import { loginGuard } from './auth/guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  { 
    path: 'dashboard/user', 
    loadComponent: () => import('./dashboard/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'dashboard/admin', 
    loadComponent: () => import('./dashboard/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), 
    canActivate: [authGuard, adminGuard] 
  },
  // Fallback route
  { path: '**', redirectTo: 'login' }
];
