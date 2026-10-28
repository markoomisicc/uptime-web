import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { LoginCredentials, LoginForm } from '../../components/login-form/login-form';
import { Auth } from '../../core/services/auth';
import { Language } from '../../core/services/language';

@Component({
  selector: 'app-login',
  imports: [LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly language = inject(Language);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  onSubmit({ email, password }: LoginCredentials): void {
    this.loading.set(true);
    this.error.set(null);

    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
            error: (err: HttpErrorResponse) => {
        if (err.error?.error === 'email_not_verified') {
          this.router.navigate(['/check-email'], { queryParams: { email } });
          return;
        }

        this.error.set(this.language.translateError(err));
        this.loading.set(false);
      },
    });
  }
}