import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AppEnvironment } from '../../../../core/config/app-environment';
import { SiteUrls } from '../../../../core/config/site-urls';
import { ThemeColor } from '../../../../core/enums/theme-color.enum';
import { AuthService } from '../../../../core/modules/auth/services/auth.service';
import { LayoutService } from '../services/layout.service';
import { ThemeStateService } from '../services/theme.state.service';

@Component({
  selector: 'am-navbar',
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private themeStateService = inject(ThemeStateService);

  readonly navbarState = this.layoutService.layoutState.navbarState;
  readonly theme = this.themeStateService.value;

  readonly siteUrls = SiteUrls;
  readonly siteName = AppEnvironment.SiteName;
  readonly themeColor = ThemeColor;
  readonly userEmail = this.authService.getEmail();

  handleToggleTheme(): void {
    this.themeStateService.toggle();
  }

  handleToggleSidebar(): void {
    this.layoutService.sidebarToggle();
  }

  handleLogout(): void {
    this.authService.logout();
  }
}
