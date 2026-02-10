import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SupabaseService } from '../supabase/supabase.service';
import { environment } from '../../../environments/environment';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const supabase = inject(SupabaseService).supabase;

  return from(supabase.auth.getSession()).pipe(
    switchMap(({ data }) => {
      console.log('🔥 INTERCEPTOR ATIVO:', req.url);

      const session = data.session;

      // ✅ INTERCEPTA APENAS EDGE FUNCTIONS
      if (
        session?.access_token &&
        req.url.includes('/functions/v1/')
      ) {
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${session.access_token}`,
            apikey: environment.supabaseKey, // anon key
          },
        });

        return next(clonedReq);
      }

      return next(req);
    })
  );
};
