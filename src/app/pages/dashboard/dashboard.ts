import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Header } from '../../components/header/header';
import { Welcome } from '../../components/welcome/welcome';
import { LanguageCode } from '../../core/models/user';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [Header, Welcome],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly user = this.auth.user;

  onLogout(): void {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/login'));
  }

  onLanguageChange(language: LanguageCode): void {
    this.auth.updateLanguage(language).subscribe();
  }
}