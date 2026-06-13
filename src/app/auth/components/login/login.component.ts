import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthFacade } from '../../services/auth.facade';

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

  loginForm!: FormGroup;
  loading$ = this.authFacade.loading$;
  error$ = this.authFacade.error$;

  // Select demo accounts from the store state using the Facade
  demoAdmins$ = this.authFacade.demoAdmins$;
  demoUsers$ = this.authFacade.demoUsers$;
  fetchingDemoUsers$ = this.authFacade.loadingDemoUsers$;

  ngOnInit(): void {
    this.initForm();
    // Dispatch the Load Demo Users action through the facade
    this.authFacade.loadDemoUsers();
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

  autofill(email: string, password?: string): void {
    this.loginForm.patchValue({
      email,
      password: password || 'changeme'
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
