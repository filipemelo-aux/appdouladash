import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent, NavItem } from '../../shared/components/layout/layout.component';
import { AuthService } from '../../core/auth/auth.service';
import { UsersService, AdminUser, UpdateUserPayload } from './users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  authService = inject(AuthService);
  usersService = inject(UsersService);

  user = this.authService.currentUser;
  isAdmin = this.authService.isAdmin;
  users = signal<AdminUser[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  // Rastreia alterações pendentes para cada usuário.
  userChanges = signal<{ [key: string]: Partial<UpdateUserPayload> & { userId: string } }>({});
  updatingUsers = signal<Set<string>>(new Set());
  
  // Sinais para ações de segurança
  isResettingPasswordFor = signal<string | null>(null);
  isForcingPasswordChangeFor = signal<string | null>(null);
  recoveryLink = signal<string | null>(null);
  isRecoveryLinkModalOpen = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6', link: '/admin/dashboard' },
    { label: 'Gestantes', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A10.99 10.99 0 0012 12.75a10.99 10.99 0 00-3-5.197m3 5.197a4 4 0 110-5.292', link: '/admin/clients' },
    { label: 'Usuários', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', link: '/admin/users' },
    { label: 'Agenda', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', link: '/admin/agenda' },
    { label: 'Financeiro', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', link: '/admin/finance' },
    { label: 'Configurações', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', link: '/admin' }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const users = await this.usersService.getUsers();
      this.users.set(users);
    } catch (err: any) {
      this.error.set(err.message || 'Falha ao carregar os usuários.');
    } finally {
      this.isLoading.set(false);
    }
  }
  
  private clearMessages(): void {
      this.error.set(null);
      this.successMessage.set(null);
  }
  
  private showSuccessMessage(message: string): void {
      this.successMessage.set(message);
      setTimeout(() => this.successMessage.set(null), 5000);
  }

  onRoleChange(userId: string, event: Event): void {
    const newRole = (event.target as HTMLSelectElement).value as 'admin' | 'assistant' | 'client';
    this.userChanges.update(changes => {
      const userChanges = changes[userId] || { userId };
      userChanges.role = newRole;
      return { ...changes, [userId]: userChanges };
    });
  }

  onStatusChange(userId: string, event: Event): void {
    const newStatus = (event.target as HTMLInputElement).checked;
     this.userChanges.update(changes => {
      const userChanges = changes[userId] || { userId };
      userChanges.is_active = newStatus;
      return { ...changes, [userId]: userChanges };
    });
  }

  isRowChanged(userId: string): boolean {
    return !!this.userChanges()[userId];
  }

  async onUpdateUser(userId: string): Promise<void> {
    const changes = this.userChanges()[userId];
    if (!changes) return;

    this.updatingUsers.update(s => s.add(userId));
    this.clearMessages();
    
    try {
      await this.usersService.updateUser(changes);
      
      this.users.update(users => users.map(u => u.id === userId ? {...u, ...changes} : u));
      
      this.userChanges.update(currentChanges => {
        const newChanges = { ...currentChanges };
        delete newChanges[userId];
        return newChanges;
      });
      this.showSuccessMessage(`Usuário ${changes.userId} atualizado com sucesso.`);
    } catch (err: any) {
      this.error.set(err.message || 'Falha ao atualizar o usuário.');
    } finally {
       this.updatingUsers.update(s => {
         s.delete(userId);
         return s;
       });
    }
  }

  async onResetPassword(user: AdminUser): Promise<void> {
    this.isResettingPasswordFor.set(user.id);
    this.clearMessages();
    try {
      const { recoveryLink } = await this.usersService.resetPassword(user.email);
      this.recoveryLink.set(recoveryLink);
      this.isRecoveryLinkModalOpen.set(true);
    } catch (err: any) {
      this.error.set(err.message);
    } finally {
      this.isResettingPasswordFor.set(null);
    }
  }

  async onForcePasswordChange(user: AdminUser): Promise<void> {
    this.isForcingPasswordChangeFor.set(user.id);
    this.clearMessages();
    try {
      await this.usersService.forcePasswordChange(user.id);
      this.showSuccessMessage(`O usuário ${user.full_name || user.email} precisará alterar a senha no próximo login.`);
    } catch (err: any) {
      this.error.set(err.message);
    } finally {
      this.isForcingPasswordChangeFor.set(null);
    }
  }
  
  closeRecoveryLinkModal(): void {
    this.isRecoveryLinkModalOpen.set(false);
    this.recoveryLink.set(null);
  }
}
