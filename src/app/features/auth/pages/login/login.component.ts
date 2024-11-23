import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoginRequest } from '../../../../core/auth/models/login.request';
import { AuthApiService } from '../../../../core/auth/services/auth-api.service';
import { PageBaseComponent } from '../../../../shared/components/pages/page-base/page-base.component';

@Component({
  selector: 'am-login',
  imports: [CommonModule, PageBaseComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authApiService = inject(AuthApiService);

  constructor() {
    const loginRequest: LoginRequest = {
      email: 'alice@example.com',
      password: 'Password4!',
    };

    this.authApiService.login(loginRequest).subscribe((response) => {
      console.log(response);
    });
  }
}
