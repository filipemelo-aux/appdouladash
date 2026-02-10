import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { toObservable } from '@angular/core/rxjs-interop';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.currentUser).pipe(
    take(1),
    map(user => {
      // Permite o acesso se o usuário for 'admin' OU 'assistant'.
      if (user && (user.role === 'admin' || user.role === 'assistant')) {
        return true;
      } else {
        // Redireciona para o login se o usuário não tiver o perfil adequado.
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
