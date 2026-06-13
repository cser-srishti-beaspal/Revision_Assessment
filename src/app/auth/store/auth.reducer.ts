import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../models/user.model';
import { AuthActions } from './auth.actions';

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialAuthState,
  
  // Login Actions
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AuthActions.loginSuccess, (state, { token }) => ({
    ...state,
    token,
    loading: true, // Remain in loading state while fetching profile
    error: null
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Profile Actions
  on(AuthActions.fetchProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  
  on(AuthActions.fetchProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Auto Login Actions
  on(AuthActions.autoLoginSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user,
    loading: false,
    error: null
  })),
  
  on(AuthActions.autoLoginFailure, (state) => ({
    ...state,
    ...initialAuthState
  })),
  
  // Logout Action
  on(AuthActions.logout, () => ({
    ...initialAuthState
  }))
);
