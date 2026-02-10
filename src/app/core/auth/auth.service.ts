import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthError, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface AppUser extends SupabaseUser {
  role: string;
  must_change_password?: boolean;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase = inject(SupabaseService).supabase;
  private router = inject(Router);

  // 🔐 Sessão cacheada (USADA PELO INTERCEPTOR)
  private session$ = new BehaviorSubject<Session | null>(null);

  // 👤 Usuário com perfil (usado pela UI)
  currentUser = signal<AppUser | null>(null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {
    // 1️⃣ Listener global de autenticação
    this.supabase.auth.onAuthStateChange((event, session) => {
      // Atualiza sessão para o interceptor
      this.session$.next(session);

      if (session?.user) {
        this.fetchAndSetCurrentUser(session.user).catch(err => {
          console.error('onAuthStateChange profile fetch failed:', err.message);
        });
      } else {
        this.currentUser.set(null);
      }
    });

    // 2️⃣ Carrega sessão inicial (refresh / reload)
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.session$.next(session);

      if (session?.user) {
        this.fetchAndSetCurrentUser(session.user).catch(err => {
          console.error('Initial session profile fetch failed:', err.message);
        });
      }
    });
  }

  // ❌ NÃO usar no interceptor
  getSession(): Promise<{ data: { session: Session | null }; error: AuthError | null }> {
    return this.supabase.auth.getSession();
  }

  // ✅ USAR NO INTERCEPTOR (SÍNCRONO)
  getSessionSync(): Session | null {
    return this.session$.value;
  }

  private async fetchAndSetCurrentUser(user: SupabaseUser): Promise<AppUser> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('role, must_change_password, active')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      console.error('Error fetching user profile or profile not found:', error);
      await this.logout();
      throw new Error('Perfil não encontrado.');
    }

    if (!data.active) {
      console.error('Login attempt by inactive user:', user.id);
      await this.logout();
      throw new Error('Conta de usuário inativa.');
    }

    const appUser: AppUser = {
      ...user,
      role: data.role,
      must_change_password: data.must_change_password,
      active: data.active,
    };

    this.currentUser.set(appUser);
    return appUser;
  }

  async getProfile(): Promise<AppUser | null> {
    try {
      const { data: { session } } = await this.getSession();
      if (session?.user) {
        return await this.fetchAndSetCurrentUser(session.user);
      }
      this.currentUser.set(null);
      return null;
    } catch {
      this.currentUser.set(null);
      return null;
    }
  }

  async signInWithPassword(
    email: string,
    password: string
  ): Promise<{ error: AuthError | { message: string } | null }> {
    const { data: signInData, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !signInData.user) {
      return { error };
    }

    try {
      const userWithProfile = await this.fetchAndSetCurrentUser(signInData.user);

      if (userWithProfile.must_change_password) {
        this.router.navigate(['/change-password']);
      } else {
        this.redirectUser(userWithProfile.role);
      }

      return { error: null };
    } catch (profileError: any) {
      return { error: { message: profileError.message } };
    }
  }

  private redirectUser(role: string): void {
    if (role === 'admin' || role === 'assistant') {
      this.router.navigate(['/admin']);
    } else if (role === 'client') {
      this.router.navigate(['/client']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async changePasswordAndActivate(
    password: string
  ): Promise<{ error: { message: string } | null }> {
    const { error } = await this.supabase.auth.updateUser({ password });

    if (error) {
      return { error: { message: error.message } };
    }

    const { error: profileError } = await this.supabase
      .from('profiles')
      .update({ must_change_password: false })
      .eq('id', (await this.supabase.auth.getUser()).data.user?.id);

    if (profileError) {
      return { error: { message: 'Senha alterada, mas falha ao atualizar perfil.' } };
    }

    const updatedUser = await this.getProfile();

    if (updatedUser) {
      this.redirectUser(updatedUser.role);
    } else {
      await this.logout();
    }

    return { error: null };
  }

  async logout(): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.auth.signOut();
    if (!error) {
      this.session$.next(null);
      this.currentUser.set(null);
      this.router.navigate(['/login']);
    }
    return { error };
  }
}
