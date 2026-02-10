import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutComponent, NavItem } from '../../shared/components/layout/layout.component';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [LayoutComponent],
  template: `
    <app-layout 
      [user]="user()" 
      title="Financeiro" 
      [navItems]="navItems"
      themeColor="rose"
      (logout)="logout()">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Controle Financeiro</h2>
        <p class="text-gray-600">Área para gerenciamento de pagamentos, faturas e controle de fluxo de caixa. Funcionalidade em desenvolvimento.</p>
         <div class="mt-4 h-96 bg-gray-100 rounded-md flex items-center justify-center">
            <span class="text-gray-400">Componente de Relatórios Financeiros</span>
        </div>
      </div>
    </app-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceComponent {
  authService = inject(AuthService);
  user = this.authService.currentUser;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6', link: '/admin/dashboard' },
    { label: 'Gestantes', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A10.99 10.99 0 0012 12.75a10.99 10.99 0 00-3-5.197m3 5.197a4 4 0 110-5.292', link: '/admin/clients' },
    { label: 'Usuários', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', link: '/admin/users' },
    { label: 'Agenda', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', link: '/admin/agenda' },
    { label: 'Financeiro', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', link: '/admin/finance' },
    { label: 'Configurações', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', link: '/admin' }
  ];

  logout(): void {
    this.authService.logout();
  }
}
