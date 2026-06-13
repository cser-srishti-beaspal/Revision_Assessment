import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFacade } from '../../auth/services/auth.facade';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  private authFacade = inject(AuthFacade);
  user$ = this.authFacade.user$;

  logout(): void {
    this.authFacade.logout();
  }
}
