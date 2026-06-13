import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../store/auth.selectors';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectUser).pipe(
    take(1),
    map((user) => {
      if (user && user.role === 'admin') {
        return true;
      }
      
      if (user) {
        // Logged in but not an admin, redirect to standard user dashboard
        router.navigate(['/dashboard/user']);
      } else {
        // Not logged in at all, redirect to login
        router.navigate(['/login']);
      }
      return false;
    })
  );
};
