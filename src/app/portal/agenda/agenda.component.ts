import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { LayoutComponent, NavItem } from '../../shared/components/layout/layout.component';
import { AuthService } from '../../core/auth/auth.service';
import { PORTAL_NAV_ITEMS } from '../portal.nav';
import { PortalService, Appointment } from '../portal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portal-agenda',
  standalone: true,
  imports: [LayoutComponent, CommonModule],
  templateUrl: './agenda.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendaComponent implements OnInit {
  authService = inject(AuthService);
  portalService = inject(PortalService);

  user = this.authService.currentUser;
  navItems: NavItem[] = PORTAL_NAV_ITEMS;
  
  upcomingAppointments = signal<Appointment[]>([]);
  pastAppointments = signal<Appointment[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.portalService.getAppointments().subscribe(appointments => {
      const now = new Date();
      this.upcomingAppointments.set(
        appointments
          .filter(a => new Date(a.date) >= now)
          .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      );
      this.pastAppointments.set(
         appointments
          .filter(a => new Date(a.date) < now)
          .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
      this.isLoading.set(false);
    });
  }
  
  logout(): void {
    this.authService.logout();
  }
}
