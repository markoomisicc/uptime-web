import { Component, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, TranslocoPipe, RouterLink],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly submitted = output<LoginCredentials>();

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.getRawValue());
    }
  }
}