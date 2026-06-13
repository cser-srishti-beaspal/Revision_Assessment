import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../models/user.model';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => !!state.token && !!state.user
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectUserRole = createSelector(
  selectUser,
  (user) => user ? user.role : null
);

export const selectIsAdmin = createSelector(
  selectUser,
  (user) => user ? user.role === 'admin' : false
);

// Demo Users Selectors
export const selectDemoUsers = createSelector(
  selectAuthState,
  (state) => state.demoUsers
);

export const selectDemoAdmins = createSelector(
  selectAuthState,
  (state) => state.demoAdmins
);

export const selectLoadingDemoUsers = createSelector(
  selectAuthState,
  (state) => state.loadingDemoUsers
);
