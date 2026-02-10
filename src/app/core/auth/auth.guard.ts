import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { from } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // We get the session once to make the decision.
  return from(authService.getSession()).pipe(
      take(1),
      map(({ data: { session } }) => {
          if (session) {
              return true;
          } else {
              router.navigate(['/login']);
              return false;
          }
      })
  );
};
