import { Component } from '@angular/core';
import { SiteUrls } from '../../../../core/config/site-urls';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumbItem';
import { PageBaseComponent } from '../../../../shared/components/pages/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/pages/page-header/page-header.component';

@Component({
  selector: 'am-role-create',
  imports: [PageBaseComponent, PageHeaderComponent],
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.scss',
})
export class RoleCreateComponent {
  readonly breadcrumb = new BreadcrumbCollection();

  constructor() {
    this.setBreadcrumb();
  }

  private setBreadcrumb(): void {
    this.breadcrumb
      .push(new BreadcrumbItem('Roles', SiteUrls.roles.list))
      .push(new BreadcrumbItem('Añadir rol', SiteUrls.roles.create, '', false));
  }
}
