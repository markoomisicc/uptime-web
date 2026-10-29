import { Component, input, output } from '@angular/core';

import { LanguageCode } from '../../core/models/user';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-public-header',
  imports: [Logo, LanguageSwitcher],
  templateUrl: './public-header.html',
  styleUrl: './public-header.scss',
})
export class PublicHeader {
  readonly language = input.required<LanguageCode>();
  readonly languageChange = output<LanguageCode>();
}