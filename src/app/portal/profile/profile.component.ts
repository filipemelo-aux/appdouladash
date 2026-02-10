import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { LayoutComponent, NavItem } from '../../shared/components/layout/layout.component';
import { AuthService } from '../../core/auth/auth.service';
import { PORTAL_NAV_ITEMS } from '../portal.nav';
import { PortalService, ClientDetails, Plan } from '../portal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [LayoutComponent, CommonModule],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  portalService = inject(PortalService);
  
  user = this.authService.currentUser;
  navItems: NavItem[] = PORTAL_NAV_ITEMS;

  clientDetails = signal<ClientDetails | null>(null);
  plan = signal<Plan | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.portalService.getClientDetails().subscribe({
      next: (details) => {
        this.clientDetails.set(details);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    this.portalService.getPlanDetails().subscribe(planDetails => {
        this.plan.set(planDetails);
    });
  }
  
  logout(): void {
    this.authService.logout();
  }
}
