import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { PageSimpleComponent } from '../../../../shared/components/layout/page-simple/page-simple.component';
import { VerifyEmailRequest } from '../../models/requests/verify-email.request';
import { AccountApiService } from '../../services/api/account-api.service';

@Component({
  selector: 'am-verify-email',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatDivider,
    MatCardModule,
    MatIconModule,
    PageSimpleComponent,
    AlertComponent,
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
  private readonly accountApiService = inject(AccountApiService);
  private readonly router = inject(ActivatedRoute);

  private readonly token = this.router.snapshot.queryParams['token'];

  readonly siteUrls = SiteUrls;

  readonly alertType = signal<'success' | 'error' | undefined>(undefined);
  readonly isSuccess = signal(false);
  readonly message = signal('');

  constructor() {
    if (!this.token) {
      this.isSuccess.set(false);
      this.message.set('La confirmación de correo electrónico ha fallado o expiro.');
    }

    this.verifyToken();
  }

  private verifyToken(): void {
    const request: VerifyEmailRequest = {
      token: this.token,
    } as const;

    this.accountApiService.verifyEmail(request).subscribe({
      next: () => {
        this.message.set('Correo electrónico verificado con éxito.');
        this.alertType.set('success');
      },
      error: () => {
        this.isSuccess.set(false);
        this.message.set('La confirmación de correo electrónico ha fallado o expiro.');
        this.alertType.set('error');
      },
    });
  }
}
