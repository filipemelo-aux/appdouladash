import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { toObservable } from '@angular/core/rxjs-interop';

export const clientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.currentUser).pipe(
    take(1),
    map(user => {
      if (user?.role === 'client') {
        return true;
      } else {
        // Redireciona para o login se o usuário não for um cliente.
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
