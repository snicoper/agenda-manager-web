import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SiteUrls } from '../../../../core/config/site-urls';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumbItem';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';

@Component({
  selector: 'am-account-list',
  imports: [MatCardModule, PageBaseComponent, PageHeaderComponent, TableFilterComponent],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss',
})
export class AccountListComponent {
  readonly breadcrumb = new BreadcrumbCollection();

  constructor() {
    this.setBreadcrumb();
  }

  private setBreadcrumb(): void {
    this.breadcrumb.push(new BreadcrumbItem('Accounts', SiteUrls.accounts.accounts, '', false));
  }
}
