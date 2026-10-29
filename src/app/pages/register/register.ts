import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthShell } from '../../components/auth-shell/auth-shell';
import { RegisterForm, RegisterFormValue } from '../../components/register-form/register-form';
import { LanguageCode } from '../../core/models/user';
import { Auth } from '../../core/services/auth';
import { Language } from '../../core/services/language';

@Component({
  selector: 'app-register',
  imports: [AuthShell, RegisterForm],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly language = inject(Language);

  readonly activeLanguage = this.language.active;

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly serverErrors = signal<Record<string, string>>({});

  onLanguageChange(language: LanguageCode): void {
    this.language.set(language);
  }

  onSubmit(value: RegisterFormValue): void {
    this.loading.set(true);
    this.error.set(null);
    this.serverErrors.set({});

    this.auth
      .register({
        ...value,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: this.language.current(),
      })
      .subscribe({
        next: () => this.router.navigate(['/check-email'], { queryParams: { email: value.email } }),
        error: (err: HttpErrorResponse) => {
          const fields = err.error?.fields as Record<string, { code: string }> | undefined;

          if (fields) {
            this.serverErrors.set(
              Object.fromEntries(Object.entries(fields).map(([field, e]) => [field, e.code])),
            );
          } else {
            this.error.set(this.language.translateError(err));
          }

          this.loading.set(false);
        },
      });
  }
}