import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { AuthFacade } from '../../auth/services/auth.facade';
import { take } from 'rxjs/operators';

interface ApiUser {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private authFacade = inject(AuthFacade);
  private authService = inject(AuthService); // Injecting AuthService instead of HttpClient

  user$ = this.authFacade.user$;
  systemUsers: ApiUser[] = [];
  loadingUsers = false;
  userError = '';

  ngOnInit(): void {
    this.fetchSystemUsers();
  }

  fetchSystemUsers(): void {
    this.loadingUsers = true;
    this.userError = '';
    // Query users via AuthService rather than direct HttpClient calls
    this.authService.getUsers().pipe(
      take(1)
    ).subscribe({
      next: (users) => {
        // Limit to 8 users for cleaner layout
        this.systemUsers = users.slice(0, 8);
        this.loadingUsers = false;
      },
      error: (err) => {
        this.userError = 'Failed to load system users from Platzi API.';
        this.loadingUsers = false;
      }
    });
  }

  deleteUser(userId: number): void {
    if (confirm(`Are you sure you want to delete user #${userId}? (Demo execution only)`)) {
      this.systemUsers = this.systemUsers.filter(u => u.id !== userId);
    }
  }
}
