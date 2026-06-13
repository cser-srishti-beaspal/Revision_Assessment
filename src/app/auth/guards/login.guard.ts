import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../store/auth.selectors';
import { map, take } from 'rxjs/operators';

export const loginGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectUser).pipe(
    take(1),
    map((user) => {
      if (user) {
        // Authenticated user trying to access /login, redirect to their dashboard
        if (user.role === 'admin') {
          router.navigate(['/dashboard/admin']);
        } else {
          router.navigate(['/dashboard/user']);
        }
        return false;
      }
      return true;
    })
  );
};
