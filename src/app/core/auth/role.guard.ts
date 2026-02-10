import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { toObservable } from '@angular/core/rxjs-interop';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No roles required for this route
  }

  // Use toObservable to get the current value and any subsequent changes,
  // but take(1) ensures the guard only runs once per navigation.
  return toObservable(authService.currentUser).pipe(
    take(1),
    map(user => {
      if (user && requiredRoles.includes(user.role)) {
        return true;
      } else {
        // Redirect to login if user has wrong role or is not logged in.
        // authGuard should handle the not-logged-in case, but this is a safeguard.
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
