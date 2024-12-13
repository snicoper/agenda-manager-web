import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/debug-logger';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumbItem';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { DateTimeFormatPipe } from '../../../../shared/pipes/date-time-format.pipe';
import { AccountDetailsResponse } from '../../models/account-details.response';
import { AccountApiService } from '../../services/account-api.service';

@Component({
  selector: 'am-account-details',
  imports: [MatCardModule, MatSlideToggleModule, PageBaseComponent, PageHeaderComponent, DateTimeFormatPipe],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  private readonly accountApi = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);

  readonly userId = this.route.snapshot.params['userId'];
  readonly breadcrumb = new BreadcrumbCollection();
  readonly siteUrls = SiteUrls;

  account: AccountDetailsResponse | undefined;
  loading = false;

  constructor() {
    if (!this.userId) {
      logError('User id is not defined');

      return;
    }

    this.setBreadcrumb();
    this.loadUserDetails();
  }

  private setBreadcrumb(): void {
    this.breadcrumb
      .push(new BreadcrumbItem('Accounts', SiteUrls.accounts.accounts))
      .push(new BreadcrumbItem('Account Details', SiteUrls.accounts.details, '', false));
  }

  private loadUserDetails(): void {
    this.loading = true;

    this.accountApi
      .getAccountDetails(this.userId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.account = response;
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
