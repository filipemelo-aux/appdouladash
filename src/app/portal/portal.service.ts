import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../core/supabase/supabase.service';
import { AuthService } from '../core/auth/auth.service';
import { of, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

export interface ClientDetails {
  id: string;
  full_name: string;
  dpp: string; // ISO date string
  user_id: string;
}

export interface GestationalAge {
  weeks: number;
  days: number;
}

export interface Appointment {
  id: string;
  date: string; // ISO date string
  title: string;
  status: 'Agendado' | 'Realizado';
}

export interface Plan {
    name: string;
    description: string;
    features: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  private supabase = inject(SupabaseService).supabase;
  private authService = inject(AuthService);

  getClientDetails() {
    return toObservable(this.authService.currentUser).pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('User not authenticated');
        }
        const promise = this.supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .single();
        return from(promise);
      }),
      map(({ data, error }) => {
        if (error) throw error;
        return data as ClientDetails;
      })
    );
  }

  getGestationalAge(dpp: string): GestationalAge {
    const dppDate = new Date(dpp);
    const today = new Date();
    
    // Set time to 0 to compare dates only
    dppDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    
    const totalGestationDays = 280; // 40 weeks
    const msInDay = 1000 * 60 * 60 * 24;

    const daysRemaining = Math.round((dppDate.getTime() - today.getTime()) / msInDay);
    const currentDayOfGestation = totalGestationDays - daysRemaining;

    const weeks = Math.floor(currentDayOfGestation / 7);
    const days = currentDayOfGestation % 7;

    return { weeks, days };
  }
  
  // Mocked data for UI development
  getAppointments() {
    const today = new Date();
    const mockAppointments: Appointment[] = [
        { id: '1', date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), title: 'Consulta de Pré-Natal', status: 'Agendado' },
        { id: '2', date: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(), title: 'Plano de Parto', status: 'Agendado' },
        { id: '3', date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), title: 'Introdução e Anamnese', status: 'Realizado' },
    ];
    return of(mockAppointments);
  }
  
  getPlanDetails() {
    const mockPlan: Plan = {
        name: 'Plano Acompanhamento Completo',
        description: 'Um acompanhamento integral desde a gestação até o pós-parto, garantindo apoio contínuo.',
        features: [
            'Encontros quinzenais',
            'Apoio durante o trabalho de parto',
            'Visitas pós-parto',
            'Suporte via WhatsApp 24/7'
        ]
    };
    return of(mockPlan);
  }
}
