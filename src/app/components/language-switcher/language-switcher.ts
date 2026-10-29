import { Component, ElementRef, inject, input, output, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { LanguageCode } from '../../core/models/user';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslocoPipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'open.set(false)',
  },
})
export class LanguageSwitcher {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly current = input.required<LanguageCode>();
  readonly changed = output<LanguageCode>();

  readonly open = signal(false);

  readonly options: LanguageCode[] = ['en', 'de'];

  toggle(): void {
    this.open.update((value) => !value);
  }

  select(code: LanguageCode): void {
    this.open.set(false);
    if (code !== this.current()) {
      this.changed.emit(code);
    }
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}