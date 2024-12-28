import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger.co';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { IdentityDocumentUtils } from '../../../../shared/modules/users/identity-document/identity-document-display.const';
import { DateTimeFormatPipe } from '../../../../shared/pipes/date-time-format.pipe';
import { AccountDetailsService } from '../../services/account-details.service';
import { AccountApiService } from '../../services/api/account-api.service';
import { AccountUpdateBladeComponent } from '../account-update-blade/account-update-blade.component';

@Component({
  selector: 'am-account-info-tab',
  imports: [MatSlideToggleModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, DateTimeFormatPipe],
  templateUrl: './account-info-tab.component.html',
  styleUrl: './account-info-tab.component.scss',
})
export class AccountInfoTabComponent {
  private readonly accountApi = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly accountDetailsService = inject(AccountDetailsService);
  private readonly bladeService = inject(BladeService);

  readonly siteUrls = SiteUrls;
  readonly accountState = this.accountDetailsService.state;

  handleChangeStateIsActive(): void {
    if (!this.accountState.account()) {
      logError('AccountInfoTabComponent.handleChangeStateIsActive', 'Account is not loaded');

      return;
    }

    this.accountDetailsService.setLoadingState(true);

    this.accountApi
      .toggleIsActive(this.accountState.userId()!)
      .pipe(
        take(1),
        finalize(() => this.accountDetailsService.setLoadingState(false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Estado de la cuenta actualizado correctamente');
          this.accountDetailsService.refresh();
        },
        error: () => {
          this.snackBarService.error('Error al actualizar el estado de la cuenta');
        },
      });
  }

  handleConfirmEmail(): void {
    if (!this.accountState.account() || this.accountState.account()?.isEmailConfirmed) {
      logError('AccountInfoTabComponent.handleConfirmEmail', 'Account is not loaded or email is already confirmed');

      return;
    }

    this.accountDetailsService.setLoadingState(true);

    this.accountApi
      .confirmEmail(this.accountState.userId()!)
      .pipe(
        take(1),
        finalize(() => this.accountDetailsService.setLoadingState(false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Correo electrónico confirmado correctamente');
          this.accountDetailsService.refresh();
        },
        error: () => {
          this.snackBarService.error('Error al confirmar el correo electrónico');
        },
      });
  }

  getIdentityDocumentDescriptionByType(): string {
    const type = this.accountState.account()?.identityDocument?.type;

    if (!this.accountState.account()?.identityDocument?.type) {
      return '';
    }

    return IdentityDocumentUtils.getDescriptionByValue(type!);
  }

  handleOpenUpdateAccountBlade(): void {
    this.bladeService.show(AccountUpdateBladeComponent);

    this.bladeService.result.pipe(take(1)).subscribe({
      next: () => {
        this.accountDetailsService.refresh();
      },
    });
  }
}
