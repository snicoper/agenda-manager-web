import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { AccountDetailsResponse } from '../../interfaces/responses/account-details.response';
import { AccountDetailsState } from '../../interfaces/state/account-details-state.interface';
import { AccountApiService } from '../api/account-api.service';

@Injectable({ providedIn: 'root' })
export class AccountDetailsStateService {
  private readonly accountApi = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly router = inject(Router);

  private readonly userId$ = signal<string | null>(null);
  private readonly account$ = signal<AccountDetailsResponse | null>(null);
  private readonly loading$ = signal<boolean>(false);

  readonly state: AccountDetailsState = {
    userId: computed(() => this.userId$()),
    account: computed(() => this.account$()),
    loading: computed(() => this.loading$()),
  };

  load(userId: string): void {
    if (this.account$()) {
      return;
    }

    this.userId$.set(userId);
    this.loadUserDetails();
  }

  refresh(): void {
    if (!this.userId$()) {
      logError('AccountDetailsService.refresh', 'User id is not defined');

      return;
    }

    this.loadUserDetails();
  }

  setLoadingState(isLoading: boolean): void {
    this.loading$.set(isLoading);
  }

  clean(): void {
    this.userId$.set(null);
    this.account$.set(null);
  }

  private loadUserDetails(): void {
    if (!this.userId$()) {
      logError('AccountDetailsService.loadUserDetails', 'User id is not defined');

      return;
    }

    this.loading$.set(true);

    this.accountApi
      .getAccountDetails(this.userId$()!)
      .pipe(
        take(1),
        finalize(() => this.loading$.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.account$.set(response);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.NotFound) {
            this.snackBarService.error('No se encontró la cuenta');
          } else {
            this.snackBarService.error('Error al cargar los detalles de la cuenta');
          }

          this.router.navigateByUrl(SiteUrls.accounts.list);
        },
      });
  }
}
