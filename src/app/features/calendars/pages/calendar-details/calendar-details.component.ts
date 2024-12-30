import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger';
import { SystemPermissions } from '../../../../core/modules/auth/constants/system-permissions.const';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/models/breadcrumb-collection.model';
import { NavToolbarData } from '../../../../shared/components/layout/nav-toolbar/interfaces/nav-toolbar-data.interface';
import { NavToolbarComponent } from '../../../../shared/components/layout/nav-toolbar/nav-toolbar.component';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CalendarInfoTabComponent } from '../../components/calendar-info-tab/calendar-info-tab.component';
import { CalendarSettingsTabComponent } from '../../components/calendar-settings-tab/calendar-settings-tab.component';
import { CalendarSelectedStateService } from '../../services/state/calendar-selected-state.service';

@Component({
  selector: 'am-calendar-details',
  imports: [MatCardModule, PageBaseComponent, PageHeaderComponent, NavToolbarComponent],
  templateUrl: './calendar-details.component.html',
  styleUrl: './calendar-details.component.scss',
})
export class CalendarDetailsComponent implements OnInit, OnDestroy {
  private readonly calendarSelectedStateService = inject(CalendarSelectedStateService);
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

  readonly calendar = this.calendarSelectedStateService.state.calendar;

  ngOnInit(): void {
    if (!this.calendarId) {
      logError('CalendarDetailsComponent.ngOnInit', 'Calendar id is not defined');

      return;
    }

    this.calendarSelectedStateService.load(this.calendarId);
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.calendarSelectedStateService.clean();
  }

  private setBreadcrumb(): void {
    this.breadcrumb.add('Calendarios', SiteUrls.calendars.list).add('Detalles', SiteUrls.calendars.details, '', false);
  }
}
