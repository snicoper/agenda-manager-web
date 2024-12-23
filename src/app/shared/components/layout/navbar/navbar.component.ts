import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { AppEnvironment } from '../../../../core/config/app-environment';
import { SiteUrls } from '../../../../core/config/site-urls';
import { ThemeState } from '../../../../core/states/theme.state';
import { ThemeColor } from '../../../../core/types/theme-color.enum';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'am-navbar',
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private themeState = inject(ThemeState);

  readonly navbarState = this.layoutService.layoutState.navbarState;
  readonly theme = this.themeState.value;

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
