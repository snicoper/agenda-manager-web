import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { PageSimpleComponent } from '../../../../shared/components/layout/page-simple/page-simple.component';
import { VerifyEmailRequest } from '../../interfaces/requests/verify-email.request';
import { AccountApiService } from '../../services/api/account-api.service';

@Component({
  selector: 'am-verify-email',
  imports: [CommonModule, RouterLink, MatButtonModule, MatDivider, MatCardModule, PageSimpleComponent, AlertComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
  private readonly accountApiService = inject(AccountApiService);
  private readonly router = inject(ActivatedRoute);

  private readonly token = this.router.snapshot.queryParams['token'];

  readonly siteUrls = SiteUrls;

  alertType: 'success' | 'error' | undefined;
  isSuccess = false;
  message = '';

  constructor() {
    if (!this.token) {
      this.isSuccess = false;
      this.message = 'La confirmación de correo electrónico ha fallado o expiro.';
    }

    this.verifyToken();
  }

  private verifyToken(): void {
    const request: VerifyEmailRequest = {
      token: this.token,
    } as const;

    this.accountApiService.verifyEmail(request).subscribe({
      next: (isSuccess) => {
        this.isSuccess = isSuccess;

        this.message = isSuccess
          ? 'Correo electrónico verificado con éxito.'
          : 'La confirmación de correo electrónico ha fallado o expiro.';

        this.alertType = isSuccess ? 'success' : 'error';
      },
      error: () => {
        this.isSuccess = false;
        this.message = 'La confirmación de correo electrónico ha fallado o expiro.';
        this.alertType = 'error';
      },
    });
  }
}
