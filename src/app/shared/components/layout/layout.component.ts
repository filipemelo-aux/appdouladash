import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@supabase/supabase-js';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  icon: string; // SVG path data
  link: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  user = input<User | null>();
  title = input.required<string>();
  navItems = input.required<NavItem[]>();
  themeColor = input<'rose' | 'teal'>('rose');
  
  logout = output<void>();

  onLogout(): void {
    this.logout.emit();
  }
}
