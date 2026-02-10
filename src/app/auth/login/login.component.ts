import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    const { error } = await this.authService.signInWithPassword(email!, password!);

    if (error) {
      if (error.message.includes('inactive') || error.message.includes('inativa')) {
        this.errorMessage.set('Sua conta está inativa. Entre em contato com o administrador.');
      } else if (error.message.includes('Profile not found') || error.message.includes('Perfil não encontrado')) {
        this.errorMessage.set('Ocorreu um erro ao carregar seu perfil. Tente novamente mais tarde.');
      } else {
        this.errorMessage.set('Email ou senha inválidos.');
      }
    }
    
    this.loading.set(false);
  }
}
