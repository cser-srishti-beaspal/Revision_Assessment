import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '../store/auth.actions';
import { 
  selectUser, 
  selectToken, 
  selectIsAuthenticated, 
  selectAuthLoading, 
  selectAuthError, 
  selectUserRole, 
  selectIsAdmin,
  selectDemoUsers,
  selectDemoAdmins,
  selectLoadingDemoUsers
} from '../store/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private store = inject(Store);

  // Exposing state selectors as observables
  user$ = this.store.select(selectUser);
  token$ = this.store.select(selectToken);
  isAuthenticated$ = this.store.select(selectIsAuthenticated);
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);
  role$ = this.store.select(selectUserRole);
  isAdmin$ = this.store.select(selectIsAdmin);

  // Demo Users Selectors
  demoUsers$ = this.store.select(selectDemoUsers);
  demoAdmins$ = this.store.select(selectDemoAdmins);
  loadingDemoUsers$ = this.store.select(selectLoadingDemoUsers);

  // Exposing simple methods to dispatch actions
  login(email: string, password: string): void {
    this.store.dispatch(AuthActions.login({ email, password }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  autoLogin(): void {
    this.store.dispatch(AuthActions.autoLogin());
  }

  loadDemoUsers(): void {
    this.store.dispatch(AuthActions.loadDemoUsers());
  }
}
