import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../models/user.model';
import { AuthActions } from './auth.actions';

// Synchronous restoration on startup to prevent guards from redirecting before effects fire
const initialToken = localStorage.getItem('auth_token');
const initialUserStr = localStorage.getItem('auth_user');
let initialUser = null;

if (initialUserStr) {
  try {
    initialUser = JSON.parse(initialUserStr);
  } catch {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

export const initialAuthState: AuthState = {
  user: initialUser,
  token: initialToken,
  loading: false,
  error: null,
  demoUsers: [],
  demoAdmins: [],
  loadingDemoUsers: false
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
    user: null,
    token: null,
    loading: false,
    error: null
  })),
  
  // Load Demo Users Actions
  on(AuthActions.loadDemoUsers, (state) => ({
    ...state,
    loadingDemoUsers: true
  })),
  
  on(AuthActions.loadDemoUsersSuccess, (state, { demoAdmins, demoUsers }) => ({
    ...state,
    demoAdmins,
    demoUsers,
    loadingDemoUsers: false
  })),
  
  on(AuthActions.loadDemoUsersFailure, (state) => ({
    ...state,
    loadingDemoUsers: false
  })),
  
  // Logout Action (Preserves loaded demo users so the login page stays populated)
  on(AuthActions.logout, (state) => ({
    ...initialAuthState,
    demoAdmins: state.demoAdmins,
    demoUsers: state.demoUsers,
    user: null,
    token: null
  }))
);
