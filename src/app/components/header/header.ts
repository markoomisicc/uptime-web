import { Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { LanguageCode, User } from '../../core/models/user';

@Component({
  selector: 'app-header',
  imports: [TranslocoPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly user = input.required<User>();
  readonly logout = output<void>();
  readonly languageChange = output<LanguageCode>();

  onLanguageChange(event: Event): void {
    this.languageChange.emit((event.target as HTMLSelectElement).value as LanguageCode);
  }
}