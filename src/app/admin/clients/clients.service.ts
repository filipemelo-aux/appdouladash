import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SupabaseService } from '../../core/supabase/supabase.service';

/**
 * Tipos locais
 */
export interface Client {
  id: string;
  created_at: string;
  full_name: string;
  dpp: string;
  email: string;
}

export interface NewClientPayload {
  fullName: string;
  email: string;
  dpp: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(
    private http: HttpClient,
    private supabaseService: SupabaseService
  ) {}

  // 📋 Lista de gestantes
  async getClients(): Promise<Client[]> {
    const {
      data: { session },
    } = await this.supabaseService.supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('Usuário não autenticado');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${session.access_token}`,
      apikey: environment.supabaseKey,
    });

    try {
      return await firstValueFrom(
        this.http.post<Client[]>(
          `${environment.supabaseUrl}/functions/v1/admin-list-clients`,
          {},
          { headers }
        )
      );
    } catch (error) {
      console.error('admin-list-clients error:', error);
      throw new Error('Não foi possível buscar a lista de gestantes.');
    }
  }

  // 👶 Criar nova gestante + usuário
  async createClient(payload: NewClientPayload): Promise<void> {
    const {
      data: { session },
    } = await this.supabaseService.supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('Usuário não autenticado');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${session.access_token}`,
      apikey: environment.supabaseKey,
    });

    try {
      await firstValueFrom(
        this.http.post(
          `${environment.supabaseUrl}/functions/v1/admin-create-client-user`,
          {
            email: payload.email,
            full_name: payload.fullName,
            dpp: payload.dpp,
          },
          { headers }
        )
      );
    } catch (error) {
      console.error('admin-create-client-user error:', error);
      throw new Error('Falha ao criar nova gestante.');
    }
  }
}
