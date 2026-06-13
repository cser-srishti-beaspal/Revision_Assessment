import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { UserDashboardComponent } from './dashboard/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { authGuard } from './auth/guards/auth.guard';
import { adminGuard } from './auth/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard/user', 
    component: UserDashboardComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'dashboard/admin', 
    component: AdminDashboardComponent, 
    canActivate: [authGuard, adminGuard] 
  },
  // Fallback route
  { path: '**', redirectTo: 'login' }
];
