import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Tipos locais (evita erro de path e quebra de build)
 */

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'assistant' | 'client';
  is_active: boolean;
  created_at: string;
}

export interface UpdateUserPayload {
  userId: string;
  role?: 'admin' | 'assistant' | 'client';
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  // 👥 Listar usuários
  async getUsers(): Promise<AdminUser[]> {
    try {
      return await firstValueFrom(
        this.http.post<AdminUser[]>(
          `${environment.supabaseUrl}/functions/v1/admin-list-users`,
          {}
        )
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Não foi possível buscar a lista de usuários.');
    }
  }

  // ✏️ Atualizar role / status
  async updateUser(payload: UpdateUserPayload): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(
          `${environment.supabaseUrl}/functions/v1/admin-update-user`,
          payload
        )
      );
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Falha ao atualizar o usuário.');
    }
  }

  // 🔐 Resetar senha (gera link)
  async resetPassword(email: string): Promise<{ recoveryLink: string }> {
    try {
      return await firstValueFrom(
        this.http.post<{ recoveryLink: string }>(
          `${environment.supabaseUrl}/functions/v1/admin-reset-user-password`,
          { email }
        )
      );
    } catch (error) {
      console.error('Error resetting password:', error);
      throw new Error('Falha ao gerar link de recuperação de senha.');
    }
  }

  // 🚨 Forçar troca de senha
  async forcePasswordChange(userId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(
          `${environment.supabaseUrl}/functions/v1/admin-force-password-change`,
          { userId }
        )
      );
    } catch (error) {
      console.error('Error forcing password change:', error);
      throw new Error('Falha ao forçar a troca de senha do usuário.');
    }
  }
}
