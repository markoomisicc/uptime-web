import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-verify-email-status',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './verify-email-status.html',
  styleUrl: './verify-email-status.scss',
})
export class VerifyEmailStatus {
  readonly error = input<string | null>(null);
}