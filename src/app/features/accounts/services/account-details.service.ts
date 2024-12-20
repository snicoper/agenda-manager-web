import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../core/config/site-urls';
import { logError } from '../../../core/errors/debug-logger';
import { SnackBarService } from '../../../core/services/snackbar.service';
import { AccountDetailsResponse } from '../models/account-details.response';
import { AccountDetailsState } from '../models/account-details.state';
import { AccountApiService } from './account-api.service';

@Injectable({ providedIn: 'root' })
export class AccountDetailsService {
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
    this.userId$.set(userId);
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
      logError('User id is not defined');

      return;
    }

    this.loading$.set(true);

    this.accountApi
      .getAccountDetails(this.userId$()!)
      .pipe(finalize(() => this.loading$.set(false)))
      .subscribe({
        next: (response) => {
          this.account$.set(response);
        },
        error: (error: HttpErrorResponse) => {
          logError(error);

          if (error.status === HttpStatusCode.NotFound) {
            this.snackBarService.error('No se encontró la cuenta');
          } else {
            this.snackBarService.error('Error al cargar los detalles de la cuenta');
          }

          this.router.navigateByUrl(SiteUrls.accounts.accounts);
        },
      });
  }
}
