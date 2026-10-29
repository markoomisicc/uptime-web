import { Component, computed, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  CountryCode,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

import { LanguageCode, RegisterData } from '../../core/models/user';

export type RegisterFormValue = Omit<RegisterData, 'timezone' | 'language'>;

type FieldName =
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'username'
  | 'password'
  | 'confirm_password'
  | 'phone';

interface FieldConfig {
  name: FieldName;
  type: string;
  autocomplete: string;
  half?: boolean;
  hint?: boolean;
}

function matchPassword(control: AbstractControl): ValidationErrors | null {
  const password = control.parent?.get('password')?.value;
  return control.value && control.value !== password ? { mismatch: true } : null;
}

function validPhone(control: AbstractControl): ValidationErrors | null {
  const value = (control.value as string).trim();
  if (!value) {
    return null;
  }

  const country = control.parent?.get('phone_country')?.value as CountryCode;
  return isValidPhoneNumber(value, country) ? null : { phone: true };
}

function detectCountry(): CountryCode {
  const supported = new Set(getCountries());

  for (const locale of navigator.languages) {
    const region = locale.split('-')[1]?.toUpperCase() as CountryCode | undefined;
    if (region && supported.has(region)) {
      return region;
    }
  }

  return 'DE';
}

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, RouterLink, TranslocoPipe],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly language = input.required<LanguageCode>();
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly serverErrors = input<Record<string, string>>({});
  readonly submitted = output<RegisterFormValue>();

  readonly showPassword = signal(false);

  readonly form = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(100)]],
    last_name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]{3,30}$/)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    confirm_password: ['', [Validators.required, matchPassword]],
    phone_country: [detectCountry()],
    phone: ['', validPhone],
  });

  readonly fields: FieldConfig[] = [
    { name: 'first_name', type: 'text', autocomplete: 'given-name', half: true },
    { name: 'last_name', type: 'text', autocomplete: 'family-name', half: true },
    { name: 'email', type: 'email', autocomplete: 'email' },
    { name: 'username', type: 'text', autocomplete: 'username', hint: true },
    { name: 'password', type: 'password', autocomplete: 'new-password', hint: true },
    { name: 'confirm_password', type: 'password', autocomplete: 'new-password' },
    { name: 'phone', type: 'tel', autocomplete: 'tel-national', hint: true },
  ];

  readonly countries = computed(() => {
    const language = this.language();
    const names = new Intl.DisplayNames([language], { type: 'region' });

    return getCountries()
      .map((code) => ({
        code,
        name: names.of(code) ?? code,
        dialCode: getCountryCallingCode(code),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, language));
  });

  constructor() {
    this.form.controls.password.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.controls.confirm_password.updateValueAndValidity());

    this.form.controls.phone_country.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.controls.phone.updateValueAndValidity());
  }

  inputType(field: FieldConfig): string {
    const isPassword = field.name === 'password' || field.name === 'confirm_password';
    return isPassword && this.showPassword() ? 'text' : field.type;
  }

  errorCode(field: FieldName): string | null {
    const control = this.form.controls[field];

    if (control.touched && control.errors) {
      if (control.errors['required']) {
        return 'required';
      }
      if (control.errors['mismatch']) {
        return 'mismatch';
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

    const { confirm_password, phone_country, phone, ...rest } = this.form.getRawValue();
    const parsedPhone = phone.trim() ? parsePhoneNumberFromString(phone, phone_country) : undefined;

    this.submitted.emit({ ...rest, phone: parsedPhone?.number ?? null });
  }
}