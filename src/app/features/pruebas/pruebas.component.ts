import { Component } from '@angular/core';
import { logInfo } from '../../core/errors/logger/logger';
import { AccountSelectorComponent } from '../../shared/components/selectors/account-selector/account-selector.component';
import { AccountSelectorResponse } from '../../shared/components/selectors/account-selector/models/responses/account-selecter.response';

@Component({
  selector: 'am-pruebas',
  imports: [AccountSelectorComponent],
  templateUrl: './pruebas.component.html',
  styleUrl: './pruebas.component.scss',
})
export class PruebasComponent {
  handleUserSelected(account: AccountSelectorResponse): void {
    logInfo('User selected', account);
  }
}
