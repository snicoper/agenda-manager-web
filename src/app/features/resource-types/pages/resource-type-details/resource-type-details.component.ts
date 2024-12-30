import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/models/breadcrumb-collection.model';
import { NavToolbarData } from '../../../../shared/components/layout/nav-toolbar/models/nav-toolbar-data.interface';
import { NavToolbarComponent } from '../../../../shared/components/layout/nav-toolbar/nav-toolbar.component';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ResourceTypeInfoTabComponent } from '../../components/resource-type-info-tab/resource-type-info-tab.component';
import { ResourceTypeSelectedStateService } from '../../services/state/resource-type-selected-state.service';

@Component({
  selector: 'am-resource-type-details',
  imports: [MatCardModule, PageBaseComponent, PageHeaderComponent, NavToolbarComponent],
  templateUrl: './resource-type-details.component.html',
  styleUrl: './resource-type-details.component.scss',
})
export class ResourceTypeDetailsComponent implements OnInit, OnDestroy {
  private readonly resourceTypeSelectedStateService = inject(ResourceTypeSelectedStateService);
  private readonly route = inject(ActivatedRoute);

  readonly resourceTypeId = this.route.snapshot.params['id'];
  readonly breadcrumb = new BreadcrumbCollection();
  readonly navData: NavToolbarData = {
    tabs: [
      {
        label: 'Detalles',
        icon: 'event_note',
        component: ResourceTypeInfoTabComponent,
      },
    ],
  };

  readonly resourceType = this.resourceTypeSelectedStateService.state.resourceType;

  ngOnInit(): void {
    if (!this.resourceTypeId) {
      return;
    }

    this.resourceTypeSelectedStateService.load(this.resourceTypeId);
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.resourceTypeSelectedStateService.clean();
  }

  private setBreadcrumb(): void {
    this.breadcrumb
      .add('Tipo de recursos', SiteUrls.resourceTypes.list)
      .add('Detalles', SiteUrls.resourceTypes.details, '', false);
  }
}
