import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, input, signal } from '@angular/core';

import { CheckEmailPanel } from '../../components/check-email-panel/check-email-panel';
import { Auth } from '../../core/services/auth';
import { Language } from '../../core/services/language';

@Component({
  selector: 'app-check-email',
  imports: [CheckEmailPanel],
  templateUrl: './check-email.html',
  styleUrl: './check-email.scss',
})
export class CheckEmail {
  private readonly auth = inject(Auth);
  private readonly language = inject(Language);

  readonly email = input('');

  readonly sending = signal(false);
  readonly sent = signal(false);
  readonly cooldown = signal(0);
  readonly error = signal<string | null>(null);

  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  onResend(): void {
    this.sending.set(true);
    this.sent.set(false);
    this.error.set(null);

    this.auth.resendVerification(this.email()).subscribe({
      next: () => {
        this.sending.set(false);
        this.sent.set(true);
        this.startCooldown(60);
      },
      error: (err: HttpErrorResponse) => {
        this.sending.set(false);

        if (err.status === 429) {
          this.startCooldown(Number(err.headers.get('Retry-After')) || 60);
          return;
        }

        this.error.set(this.language.translateError(err));
      },
    });
  }

  private startCooldown(seconds: number): void {
    clearInterval(this.timer);
    this.cooldown.set(seconds);

    this.timer = setInterval(() => {
      this.cooldown.update((value) => value - 1);
      if (this.cooldown() <= 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }
}