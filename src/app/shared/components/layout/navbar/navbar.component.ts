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
import { CalendarSelectorComponent } from '../../selectors/calendar-selector/calendar-selector.component';
import { CalendarSelectorStateService } from '../../selectors/calendar-selector/services/state/calendar-selector-state.service';
import { LayoutService } from '../services/layout.service';
import { ThemeStateService } from '../services/theme.state.service';

@Component({
  selector: 'am-navbar',
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule, CalendarSelectorComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly layoutService = inject(LayoutService);
  private readonly authService = inject(AuthService);
  private readonly themeStateService = inject(ThemeStateService);
  private readonly calendarSelectorState = inject(CalendarSelectorStateService);

  readonly calendarState = this.calendarSelectorState.state;
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
