import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT, Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';

import { LanguageCode } from '../models/user';

const STORAGE_KEY = 'language';

@Injectable({ providedIn: 'root' })
export class Language {
  private readonly transloco = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);

  readonly active = toSignal(this.transloco.langChanges$ as Observable<LanguageCode>, {
    initialValue: this.transloco.getActiveLang() as LanguageCode,
  });

  set(language: LanguageCode): void {
    this.transloco.setActiveLang(language);
    this.document.documentElement.lang = language;

    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Storage can be unavailable (e.g. private mode); the choice then lasts for this visit only.
    }
  }

  current(): LanguageCode {
    return this.transloco.getActiveLang() as LanguageCode;
  }

  detect(): LanguageCode {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'de') {
        return saved;
      }
    } catch {
      // Fall back to the browser language.
    }

    return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
  }

  translateError(err: HttpErrorResponse): string {
    const code: string | undefined = err.error?.error;
    const message: string | undefined = err.error?.message;

    if (code) {
      const key = `errors.${code}`;
      const translated = this.transloco.translate(key);
      if (translated !== key) {
        return translated;
      }
    }

    return message ?? this.transloco.translate('errors.unknown');
  }
}