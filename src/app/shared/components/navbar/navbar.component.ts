import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthFacade } from '../../../auth/services/auth.facade';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private authFacade = inject(AuthFacade);

  isAuthenticated$ = this.authFacade.isAuthenticated$;
  user$ = this.authFacade.user$;

  logout(): void {
    this.authFacade.logout();
  }
}
