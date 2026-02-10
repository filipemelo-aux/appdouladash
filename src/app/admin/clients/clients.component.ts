import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LayoutComponent, NavItem } from '../../shared/components/layout/layout.component';
import { AuthService } from '../../core/auth/auth.service';
import { ClientsService, Client } from './clients.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LayoutComponent],
  templateUrl: './clients.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent implements OnInit {
  // FIX: Explicitly type `fb` as `FormBuilder` to fix `Property 'group' does not exist on type 'unknown'` error.
  private fb: FormBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  clientsService = inject(ClientsService);

  user = this.authService.currentUser;
  clients = signal<Client[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  isModalOpen = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6', link: '/admin/dashboard' },
    { label: 'Gestantes', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A10.99 10.99 0 0012 12.75a10.99 10.99 0 00-3-5.197m3 5.197a4 4 0 110-5.292', link: '/admin/clients' },
    { label: 'Usuários', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', link: '/admin/users' },
    { label: 'Agenda', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', link: '/admin/agenda' },
    { label: 'Financeiro', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', link: '/admin/finance' },
    { label: 'Configurações', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', link: '/admin' }
  ];

  clientForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dpp: ['', Validators.required], // Data Provável do Parto
  });

  ngOnInit(): void {
    this.loadClients();
  }

  async loadClients(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const clients = await this.clientsService.getClients();
      this.clients.set(clients);
    } catch (err: any) {
      this.error.set(err.message || 'Falha ao carregar as gestantes.');
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal(): void {
    this.isModalOpen.set(true);
    this.clientForm.reset();
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  async onSubmit(): Promise<void> {
    if (this.clientForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const { fullName, email, dpp } = this.clientForm.value;

    try {
      await this.clientsService.createClient({
        fullName: fullName!,
        email: email!,
        dpp: dpp!
      });
      this.closeModal();
      await this.loadClients(); // Refresh the list
    } catch (err: any) {
      this.error.set(err.message || 'Ocorreu um erro ao cadastrar a gestante.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
