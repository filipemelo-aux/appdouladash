import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  // FIX: Added `standalone: true`. As the root component of a standalone application,
  // it must be marked as standalone to use the `imports` property.
  standalone: true,
  template: `<router-outlet></router-outlet>`,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}