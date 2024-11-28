import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { AppEnvironment } from '../../../core/config/app-environment';
import { SiteUrls } from '../../../core/config/site-urls';
import { LayoutService } from '../../../core/services/layout.service';
import { ThemeState } from '../../../core/states/theme.state';
import { ThemeColor } from '../../../core/types/theme-color.enum';

@Component({
  selector: 'am-navbar',
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private layoutService = inject(LayoutService);
  private themeState = inject(ThemeState);
  private authService = inject(AuthService);

  navbarState = computed(() => this.layoutService.navbarState());
  theme = computed(() => this.themeState.value());

  readonly siteUrls = SiteUrls;
  readonly siteName = AppEnvironment.SiteName;
  readonly themeColor = ThemeColor;
  readonly userEmail = this.authService.getEmail();

  handleToggleTheme(): void {
    this.themeState.toggle();
  }

  handleToggleSidebar(): void {
    this.layoutService.sidebarToggle();
  }

  handleLogout(): void {
    this.authService.logout();
  }
}
