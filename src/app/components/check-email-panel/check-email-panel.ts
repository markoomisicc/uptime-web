import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-check-email-panel',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './check-email-panel.html',
  styleUrl: './check-email-panel.scss',
})
export class CheckEmailPanel {
  readonly email = input('');
  readonly sending = input(false);
  readonly sent = input(false);
  readonly cooldown = input(0);
  readonly error = input<string | null>(null);
  readonly resend = output<void>();
}