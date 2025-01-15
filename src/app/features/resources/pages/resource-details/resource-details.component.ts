import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger';
import { SystemPermissions } from '../../../../core/modules/auth/constants/system-permissions.const';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/models/breadcrumb-collection.model';
import { NavToolbarData } from '../../../../shared/components/layout/nav-toolbar/models/nav-toolbar-data.model';
import { NavToolbarComponent } from '../../../../shared/components/layout/nav-toolbar/nav-toolbar.component';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ResourceCalendarTabComponent } from '../../components/resource-calendar-tab/resource-calendar-tab.component';
import { ResourceInfoTabComponent } from '../../components/resource-info-tab/resource-info-tab.component';
import { ResourceSchedulesTabComponent } from '../../components/resource-schedules-tab/resource-schedules-tab.component';
import { ResourceSelectedStateService } from '../../services/state/resource-selected-state.service';

@Component({
  selector: 'am-resource-details',
  imports: [MatCardModule, PageBaseComponent, PageHeaderComponent, NavToolbarComponent],
  templateUrl: './resource-details.component.html',
  styleUrl: './resource-details.component.scss',
})
export class ResourceDetailsComponent implements OnInit, OnDestroy {
  private readonly resourceSelectedStateService = inject(ResourceSelectedStateService);
  private readonly route = inject(ActivatedRoute);

  readonly resourceId = this.route.snapshot.params['resourceId'];
  readonly breadcrumb = new BreadcrumbCollection();
  readonly navData: NavToolbarData = {
    tabs: [
      {
        index: 0,
        name: 'info',
        label: 'Información',
        icon: 'info',
        permissions: [SystemPermissions.Resources.Read],
        component: ResourceInfoTabComponent,
      },
      {
        index: 1,
        name: 'calendar',
        label: 'Calendario',
        icon: 'calendar_today',
        permissions: [SystemPermissions.ResourceSchedules.Read],
        component: ResourceCalendarTabComponent,
      },
      {
        index: 2,
        name: 'schedules',
        label: 'Horarios',
        icon: 'schedule',
        permissions: [SystemPermissions.ResourceSchedules.Read],
        component: ResourceSchedulesTabComponent,
      },
    ],
  };
  readonly resource = this.resourceSelectedStateService.state.resource;

  ngOnInit(): void {
    if (!this.resourceId) {
      logError('ResourceDetailsComponent.ngOnInit', 'Resource id is not defined');

      return;
    }

    this.resourceSelectedStateService.load(this.resourceId);
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.resourceSelectedStateService.clean();
  }

  private setBreadcrumb(): void {
    this.breadcrumb.add('Recursos', SiteUrls.resources.list).add('Detalles', SiteUrls.resources.details, '', false);
  }
}
