import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Effect to handle the Login action
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response) => {
            this.authService.saveToken(response.access_token);
            return AuthActions.loginSuccess({ token: response.access_token });
          }),
          catchError((error) => {
            // Platzi Fake Store API error format might differ, standardizing error message
            const errorMsg = error.error?.message || 'Login failed. Please check your credentials.';
            return of(AuthActions.loginFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  // Trigger profile fetch upon successful login
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => AuthActions.fetchProfile())
    )
  );

  // Fetch profile using the token (token is appended by HTTP interceptor)
  fetchProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.fetchProfile),
      mergeMap(() =>
        this.authService.getProfile().pipe(
          map((user) => {
            this.authService.saveUser(user);
            return AuthActions.fetchProfileSuccess({ user });
          }),
          catchError((error) => {
            const errorMsg = error.error?.message || 'Failed to retrieve profile details.';
            return of(AuthActions.fetchProfileFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  // Navigation upon profile success
  profileSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.fetchProfileSuccess),
        tap(({ user }) => {
          if (user.role === 'admin') {
            this.router.navigate(['/dashboard/admin']);
          } else {
            this.router.navigate(['/dashboard/user']);
          }
        })
      ),
    { dispatch: false }
  );

  // Auto-login to restore credentials from local storage
  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const token = this.authService.getToken();
        const user = this.authService.getUser();
        if (token && user) {
          return AuthActions.autoLoginSuccess({ token, user });
        }
        return AuthActions.autoLoginFailure();
      })
    )
  );

  // Clear session storage and route to login
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.clearStorage();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
