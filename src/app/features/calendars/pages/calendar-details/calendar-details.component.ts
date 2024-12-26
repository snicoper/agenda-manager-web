import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/debug-logger';
import { SystemPermissions } from '../../../../core/modules/auth/constants/system-permissions.const';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/models/breadcrumb-collection.model';
import { NavToolbarData } from '../../../../shared/components/layout/nav-toolbar/models/nav-toolbar-data.interface';
import { NavToolbarComponent } from '../../../../shared/components/layout/nav-toolbar/nav-toolbar.component';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CalendarInfoTabComponent } from '../../components/calendar-info-tab/calendar-info-tab.component';
import { CalendarSettingsTabComponent } from '../../components/calendar-settings-tab/calendar-settings-tab.component';
import { CalendarDetailsStateService } from '../../services/calendar-details-state.service';

@Component({
  selector: 'am-calendar-details',
  imports: [MatCardModule, NavToolbarComponent, PageBaseComponent, PageHeaderComponent],
  templateUrl: './calendar-details.component.html',
  styleUrl: './calendar-details.component.scss',
})
export class CalendarDetailsComponent implements OnInit, OnDestroy {
  private readonly calendarDetailsStateService = inject(CalendarDetailsStateService);
  private readonly route = inject(ActivatedRoute);

  readonly calendarId = this.route.snapshot.params['id'];
  readonly breadcrumb = new BreadcrumbCollection();
  readonly navData: NavToolbarData = {
    tabs: [
      {
        label: 'Información',
        icon: 'event_note',
        permissions: [SystemPermissions.Calendars.Read],
        component: CalendarInfoTabComponent,
      },
      {
        label: 'Configuración',
        icon: 'settings',
        permissions: [SystemPermissions.CalendarSettings.Read],
        component: CalendarSettingsTabComponent,
      },
    ],
  };

  calendar = this.calendarDetailsStateService.state.calendar;

  ngOnInit(): void {
    if (!this.calendarId) {
      logError('CalendarDetailsComponent.ngOnInit', 'Calendar id is not defined');

      return;
    }

    this.calendarDetailsStateService.load(this.calendarId);
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.calendarDetailsStateService.clean();
  }

  private setBreadcrumb(): void {
    this.breadcrumb.add('Calendarios', SiteUrls.calendars.list).add('Detalles', SiteUrls.calendars.details, '', false);
  }
}
