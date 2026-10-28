import { Component, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

import { RegisterData } from '../../core/models/user';

export type RegisterFormValue = Omit<RegisterData, 'timezone' | 'language'>;

type FieldName = 'first_name' | 'last_name' | 'email' | 'username' | 'password' | 'phone';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, RouterLink, TranslocoPipe],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly serverErrors = input<Record<string, string>>({});
  readonly submitted = output<RegisterFormValue>();

  readonly form = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(100)]],
    last_name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]{3,30}$/)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    phone: ['', Validators.pattern(/^\+[1-9][0-9]{6,14}$/)],
  });

  readonly fields: { name: FieldName; type: string; autocomplete: string }[] = [
    { name: 'first_name', type: 'text', autocomplete: 'given-name' },
    { name: 'last_name', type: 'text', autocomplete: 'family-name' },
    { name: 'email', type: 'email', autocomplete: 'email' },
    { name: 'username', type: 'text', autocomplete: 'username' },
    { name: 'password', type: 'password', autocomplete: 'new-password' },
    { name: 'phone', type: 'tel', autocomplete: 'tel' },
  ];

  errorCode(field: FieldName): string | null {
    const control = this.form.controls[field];

    if (control.touched && control.errors) {
      if (control.errors['required']) {
        return 'required';
      }
      if (control.errors['minlength'] || (field === 'password' && control.errors['maxlength'])) {
        return 'invalid_length';
      }
      if (control.errors['maxlength']) {
        return 'too_long';
      }
      return 'invalid';
    }

    return this.serverErrors()[field] ?? null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.submitted.emit({ ...value, phone: value.phone.trim() || null });
  }
}