import { Component } from '@angular/core';
import { logInfo } from '../../../../core/errors/debug-logger';

@Component({
  selector: 'am-account-list',
  imports: [],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss',
})
export class AccountListComponent {
  constructor() {
    logInfo('AccountListComponent', 'constructor');
  }
}
