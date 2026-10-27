import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';

import { API } from '../api/endpoints';
import { LanguageCode, User } from '../models/user';
import { Language } from './language';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly language = inject(Language);

  readonly user = signal<User | null>(null);
  readonly isLoggedIn = computed(() => this.user() !== null);

  loadCurrentUser(): Observable<User | null> {
    return this.http.get<User>(API.auth.me).pipe(
      tap((user) => this.setUser(user)),
      catchError(() => {
        this.user.set(null);
        return of(null);
      }),
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(API.auth.login, { email, password })
      .pipe(tap((user) => this.setUser(user)));
  }

  logout(): Observable<void> {
    return this.http.post<void>(API.auth.logout, {}).pipe(tap(() => this.user.set(null)));
  }

  updateLanguage(language: LanguageCode): Observable<User> {
    return this.http
      .patch<User>(API.auth.me, { language })
      .pipe(tap((user) => this.setUser(user)));
  }

  private setUser(user: User): void {
    this.user.set(user);
    this.language.set(user.language);
  }
}