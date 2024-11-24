import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { SiteUrls } from '../../../core/config/site-urls';
import { PageBaseComponent } from '../../../shared/components/pages/page-base/page-base.component';

@Component({
  selector: 'am-home',
  imports: [CommonModule, PageBaseComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = this.authService.getEmail();

  logout(): void {
    this.authService.logout();

    this.router.navigate([SiteUrls.auth.login], { queryParams: { returnUrl: this.router.url } });
  }
}
