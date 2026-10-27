import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-welcome',
  imports: [TranslocoPipe],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {
  readonly name = input.required<string>();
}