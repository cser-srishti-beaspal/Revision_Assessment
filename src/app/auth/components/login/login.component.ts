import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthFacade } from '../../services/auth.facade';
import { take } from 'rxjs/operators';

interface DemoUser {
  email: string;
  password?: string;
  name: string;
  role: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authFacade = inject(AuthFacade);
  private http = inject(HttpClient);

  loginForm!: FormGroup;
  loading$ = this.authFacade.loading$;
  error$ = this.authFacade.error$;

  // Dynamic credentials to help testing
  demoAdmins: DemoUser[] = [];
  demoUsers: DemoUser[] = [];
  fetchingDemoUsers = false;

  ngOnInit(): void {
    this.initForm();
    this.fetchDemoAccounts();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authFacade.login(email, password);
  }

  autofill(email: string, role: string): void {
    // Look up the matched user in demo lists to fetch the active password
    const user = [...this.demoAdmins, ...this.demoUsers].find(u => u.email === email);
    
    this.loginForm.patchValue({
      email: email,
      password: user?.password || 'changeme'
    });
  }

  private fetchDemoAccounts(): void {
    this.fetchingDemoUsers = true;
    this.http.get<any[]>('https://api.escuelajs.co/api/v1/users').pipe(
      take(1)
    ).subscribe({
      next: (users) => {
        this.fetchingDemoUsers = false;
        // Keep the exact password property returned by the API
        this.demoAdmins = users
          .filter(u => u.role === 'admin')
          .slice(0, 2)
          .map(u => ({ email: u.email, name: u.name, role: u.role, password: u.password }));
          
        this.demoUsers = users
          .filter(u => u.role === 'customer' || u.role === 'user')
          .slice(0, 2)
          .map(u => ({ email: u.email, name: u.name, role: u.role, password: u.password }));

        this.addFallbacks();
      },
      error: () => {
        this.fetchingDemoUsers = false;
        this.addFallbacks();
      }
    });
  }

  private addFallbacks(): void {
    if (this.demoAdmins.length === 0) {
      this.demoAdmins = [{ email: 'admin@mail.com', name: 'Demo Admin', role: 'admin', password: 'admin' }];
    }
    if (this.demoUsers.length === 0) {
      this.demoUsers = [{ email: 'john@mail.com', name: 'Jhon Customer', role: 'customer', password: 'changeme' }];
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
