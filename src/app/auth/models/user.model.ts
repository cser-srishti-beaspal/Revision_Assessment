export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'customer' | string;
  avatar: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  demoUsers: any[];
  demoAdmins: any[];
  loadingDemoUsers: boolean;
}
