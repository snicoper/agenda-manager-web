import { Component } from '@angular/core';
import { SiteUrls } from '../../../../core/config/site-urls';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/models/breadcrumb-collection.model';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';

@Component({
  selector: 'am-resource-types-list',
  imports: [PageBaseComponent, PageHeaderComponent],
  templateUrl: './resource-types-list.component.html',
  styleUrl: './resource-types-list.component.scss',
})
export class ResourceTypesListComponent {
  readonly breadcrumb = new BreadcrumbCollection();

  constructor() {
    this.setBreadcrumb();
  }

  protected setBreadcrumb(): void {
    this.breadcrumb.add('Tipo de recursos', SiteUrls.resourceTypes.list, '', false);
  }
}
