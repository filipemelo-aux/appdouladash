import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { LayoutComponent, NavItem } from '../../shared/components/layout/layout.component';
import { PortalService, ClientDetails, GestationalAge, Appointment } from '../portal.service';
import { PORTAL_NAV_ITEMS } from '../portal.nav';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portal-home',
  standalone: true,
  imports: [LayoutComponent, CommonModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  portalService = inject(PortalService);
  
  user = this.authService.currentUser;
  navItems: NavItem[] = PORTAL_NAV_ITEMS;

  clientDetails = signal<ClientDetails | null>(null);
  gestationalAge = computed<GestationalAge | null>(() => {
    const dpp = this.clientDetails()?.dpp;
    return dpp ? this.portalService.getGestationalAge(dpp) : null;
  });
  nextAppointment = signal<Appointment | null>(null);

  ngOnInit(): void {
    this.portalService.getClientDetails().subscribe(details => {
      this.clientDetails.set(details);
    });

    this.portalService.getAppointments().subscribe(appointments => {
        const upcoming = appointments
            .filter(a => a.status === 'Agendado' && new Date(a.date) >= new Date())
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        this.nextAppointment.set(upcoming[0] || null);
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
