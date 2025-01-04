import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { PageSimpleComponent } from '../../../../shared/components/layout/page-simple/page-simple.component';
import { ResendEmailConfirmation } from '../../models/requests/resend-email-confirmation.request';
import { AccountApiService } from '../../services/api/account-api.service';

@Component({
  selector: 'am-resend-email-confirmation',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    PageSimpleComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './resend-email-confirmation.component.html',
  styleUrl: './resend-email-confirmation.component.scss',
})
export class ResendEmailConfirmationComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly accountApiService = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);

  readonly isLoading = signal(false);
  readonly resultSuccess = signal(false);

  readonly email = this.route.snapshot.queryParams['email'];
  readonly siteUrls = SiteUrls;

  handleSendCode(): void {
    this.isLoading.set(true);
    this.resultSuccess.set(false);

    const request: ResendEmailConfirmation = {
      email: this.email,
    } as const;

    this.accountApiService
      .resendEmailConfirmation(request)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.resultSuccess.set(true);
          this.snackBarService.success('Se ha enviado un nuevo código de verificación a su correo.');
        },
        error: () => this.snackBarService.error('No se pudo enviar el código de verificación.'),
      });
  }
}
