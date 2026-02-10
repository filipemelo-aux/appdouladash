import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

// Custom validator to check if passwords match
function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  return newPassword && confirmPassword && newPassword.value !== confirmPassword.value
    ? { passwordsMismatch: true }
    : null;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  changePasswordForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: passwordsMatchValidator });

  async onSubmit(): Promise<void> {
    if (this.changePasswordForm.invalid) {
      if (this.changePasswordForm.hasError('passwordsMismatch')) {
        this.errorMessage.set('As senhas não coincidem.');
      } else {
        this.errorMessage.set('Por favor, preencha a senha com no mínimo 8 caracteres.');
      }
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { newPassword } = this.changePasswordForm.value;

    const { error } = await this.authService.changePasswordAndActivate(newPassword!);

    if (error) {
      this.errorMessage.set(error.message || 'Ocorreu um erro ao atualizar sua senha.');
    }

    this.loading.set(false);
  }
}
