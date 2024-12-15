import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/debug-logger';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumbItem';
import { DateTimeFormatPipe } from '../../../../shared/pipes/date-time-format.pipe';
import { AccountApiService } from '../../services/account-api.service';
import { AccountDetailsService } from '../../services/account-details.service';
import { AccountUpdateBladeComponent } from '../account-update-blade/account-update-blade.component';

@Component({
  selector: 'am-account-info-tab',
  imports: [MatSlideToggleModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, DateTimeFormatPipe],
  templateUrl: './account-info-tab.component.html',
  styleUrl: './account-info-tab.component.scss',
})
export class AccountInfoTabComponent implements OnInit {
  private readonly accountApi = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly accountDetailsService = inject(AccountDetailsService);
  private readonly bladeService = inject(BladeService);

  readonly breadcrumb = new BreadcrumbCollection();
  readonly siteUrls = SiteUrls;

  accountState = this.accountDetailsService.state;

  ngOnInit(): void {
    this.setBreadcrumb();
  }

  handleChangeStateIsActive(): void {
    if (!this.accountState.account()) {
      return;
    }

    this.accountDetailsService.setLoadingState(true);

    this.accountApi
      .toggleIsActive(this.accountState.userId()!)
      .pipe(finalize(() => this.accountDetailsService.setLoadingState(false)))
      .subscribe({
        next: () => {
          this.snackBarService.success('Estado de la cuenta actualizado correctamente');
          this.accountDetailsService.load(this.accountState.userId()!);
        },
        error: (error: HttpErrorResponse) => {
          logError(error);

          this.snackBarService.error('Error al actualizar el estado de la cuenta');
        },
      });
  }

  handleConfirmEmail(): void {
    if (!this.accountState.account() || this.accountState.account()?.isEmailConfirmed) {
      return;
    }

    this.accountDetailsService.setLoadingState(true);

    this.accountApi
      .confirmEmail(this.accountState.userId()!)
      .pipe(finalize(() => this.accountDetailsService.setLoadingState(false)))
      .subscribe({
        next: () => {
          this.snackBarService.success('Correo electrónico confirmado correctamente');
          this.accountDetailsService.load(this.accountState.userId()!);
        },
        error: (error: HttpErrorResponse) => {
          logError(error);

          this.snackBarService.error('Error al confirmar el correo electrónico');
        },
      });
  }

  handleChangeStateIsCollaborator(): void {
    if (!this.accountState.account()) {
      return;
    }

    this.accountDetailsService.setLoadingState(true);

    this.accountApi
      .toggleIsCollaborator(this.accountState.userId()!)
      .pipe(finalize(() => this.accountDetailsService.setLoadingState(false)))
      .subscribe({
        next: () => {
          this.snackBarService.success('Usuario colaborador actualizado correctamente');
          this.accountDetailsService.load(this.accountState.userId()!);
        },
        error: (error: HttpErrorResponse) => {
          logError(error);

          this.snackBarService.error('Error al actualizar el usuario colaborador');
        },
      });
  }

  handleOpenUpdateAccountBlade(): void {
    this.bladeService.show(AccountUpdateBladeComponent);

    // this.bladeService.result.pipe(take(1)).subscribe({
    //   next: () => {
    //     this.accountDetailsService.load(this.accountState.userId()!);
    //   },
    // });
  }

  private setBreadcrumb(): void {
    this.breadcrumb
      .push(new BreadcrumbItem('Accounts', SiteUrls.accounts.accounts))
      .push(new BreadcrumbItem('Account Details', SiteUrls.accounts.details, '', false));
  }
}
