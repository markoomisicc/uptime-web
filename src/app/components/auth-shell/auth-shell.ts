import { Component, input, output } from '@angular/core';

import { LanguageCode } from '../../core/models/user';
import { PublicHeader } from '../public-header/public-header';
import { StatusBackdrop } from '../status-backdrop/status-backdrop';

@Component({
  selector: 'app-auth-shell',
  imports: [PublicHeader, StatusBackdrop],
  templateUrl: './auth-shell.html',
  styleUrl: './auth-shell.scss',
})
export class AuthShell {
  readonly language = input.required<LanguageCode>();
  readonly languageChange = output<LanguageCode>();
}