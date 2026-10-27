import { Component, input, output } from '@angular/core';

import { User } from '../../core/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly user = input.required<User>();
  readonly logout = output<void>();
}