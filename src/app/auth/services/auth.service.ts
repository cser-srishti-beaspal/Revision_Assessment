import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse, UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.escuelajs.co/api/v1/auth';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password });
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  getDemoUsers(): Observable<any[]> {
    // Queries https://api.escuelajs.co/api/v1/users
    return this.http.get<any[]>(`https://api.escuelajs.co/api/v1/users`);
  }

  // Local Storage Helpers
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  saveUser(user: UserProfile): void {
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  getUser(): UserProfile | null {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as UserProfile;
    } catch {
      this.clearStorage();
      return null;
    }
  }

  clearStorage(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}
