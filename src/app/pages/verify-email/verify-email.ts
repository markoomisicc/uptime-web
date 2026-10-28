import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { VerifyEmailStatus } from '../../components/verify-email-status/verify-email-status';
import { Auth } from '../../core/services/auth';
import { Language } from '../../core/services/language';

@Component({
  selector: 'app-verify-email',
  imports: [VerifyEmailStatus],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmail implements OnInit {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly language = inject(Language);

  readonly token = input('');
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.auth.verifyEmail(this.token()).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err: HttpErrorResponse) => this.error.set(this.language.translateError(err)),
    });
  }
}