import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { PageSimpleComponent } from '../../../../shared/components/layout/page-simple/page-simple.component';
import { ConfirmEmailResentRequest } from '../../models/confirm-email-resent.request';
import { AccountApiService } from '../../services/account-api.service';

@Component({
  selector: 'am-confirm-email-resent',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, PageSimpleComponent, BtnLoadingComponent],
  templateUrl: './confirm-email-resent.component.html',
  styleUrl: './confirm-email-resent.component.scss',
})
export class ConfirmEmailResentComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly accountApiService = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);

  readonly email = this.route.snapshot.queryParams['email'];
  readonly siteUrls = SiteUrls;

  isLoading = false;
  resultSuccess = false;

  handleSendCode(): void {
    this.isLoading = true;
    this.resultSuccess = false;

    const request = {
      email: this.email,
    } as ConfirmEmailResentRequest;

    this.accountApiService
      .confirmEmailResent(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.resultSuccess = true;
          this.snackBarService.success('Se ha enviado un nuevo código de verificación a su correo.');
        },
        error: () => this.snackBarService.error('No se pudo enviar el código de verificación.'),
      });
  }
}
