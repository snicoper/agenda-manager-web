import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { LoginRequest } from '../../../../core/auth/models/login.request';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { logInfo } from '../../../../core/errors/log-messages';
import { BadRequest } from '../../../../core/models/bad-request';
import { PageBaseComponent } from '../../../../shared/components/pages/page-base/page-base.component';

@Component({
  selector: 'am-login',
  imports: [CommonModule, PageBaseComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private badRequest: BadRequest | null = null;

  constructor() {
    const loginRequest: LoginRequest = {
      email: 'alice@example.com',
      password: 'Password4!',
    };

    this.authService.login(loginRequest).subscribe({
      next: (isLoggedIn) => {
        logInfo(String(isLoggedIn));
      },
      error: (error: HttpErrorResponse) => {
        this.badRequest = error.error as BadRequest;
      },
    });
  }
}
