import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { PageSimpleComponent } from '../../../../shared/components/layout/page-simple/page-simple.component';
import { ConfirmEmailVerifyRequest } from '../../models/confirm-email-verify.request';
import { AccountApiService } from '../../services/account-api.service';

@Component({
  selector: 'am-confirm-email-verify',
  imports: [CommonModule, RouterLink, MatButtonModule, MatDivider, MatCardModule, PageSimpleComponent, AlertComponent],
  templateUrl: './confirm-email-verify.component.html',
  styleUrl: './confirm-email-verify.component.scss',
})
export class ConfirmEmailVerifyComponent {
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
    const request = {
      token: this.token,
    } as ConfirmEmailVerifyRequest;

    this.accountApiService.confirmEmailVerify(request).subscribe({
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
