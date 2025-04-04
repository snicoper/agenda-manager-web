import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { AccountDetailsResponse } from '../../models/responses/account-details.response';
import { AccountSelectedState } from '../../models/state/account-selected.state';
import { AccountApiService } from '../api/account-api.service';

@Injectable({ providedIn: 'root' })
export class AccountSelectedStateService {
  private readonly accountApi = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly router = inject(Router);

  private readonly userId$ = signal<string | null>(null);
  private readonly account$ = signal<AccountDetailsResponse | null>(null);
  private readonly isLoading$ = signal<boolean>(false);

  readonly state: AccountSelectedState = {
    userId: computed(() => this.userId$()),
    account: computed(() => this.account$()),
    isLoading: computed(() => this.isLoading$()),
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
    this.isLoading$.set(isLoading);
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

    this.isLoading$.set(true);

    this.accountApi
      .getAccountById(this.userId$()!)
      .pipe(
        take(1),
        finalize(() => this.isLoading$.set(false)),
      )
      .subscribe({
        next: (response) => this.account$.set(response),
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
