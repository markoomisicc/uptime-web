import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT, Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { LanguageCode } from '../models/user';

@Injectable({ providedIn: 'root' })
export class Language {
  private readonly transloco = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);

  set(language: LanguageCode): void {
    this.transloco.setActiveLang(language);
    this.document.documentElement.lang = language;
  }

  detect(): LanguageCode {
    return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
  }

  current(): LanguageCode {
    return this.transloco.getActiveLang() as LanguageCode;
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