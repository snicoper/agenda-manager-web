import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/debug-logger';
import { SystemPermissions } from '../../../../core/types/system-permissions';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumbItem';
import { NavToolbarData } from '../../../../shared/components/layout/nav-toolbar/models/nav-toolbar-data.interface';
import { NavToolbarComponent } from '../../../../shared/components/layout/nav-toolbar/nav-toolbar.component';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { AccountInfoTabComponent } from '../../components/account-info-tab/account-info-tab.component';
import { AccountRolesTabComponent } from '../../components/account-roles-tab/account-roles-tab.component';
import { AccountDetailsService } from '../../services/account-details.service';

@Component({
  selector: 'am-account-details',
  imports: [MatCardModule, PageBaseComponent, PageHeaderComponent, NavToolbarComponent],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  private readonly accountDetailsService = inject(AccountDetailsService);
  private readonly route = inject(ActivatedRoute);

  readonly userId = this.route.snapshot.params['userId'];
  readonly breadcrumb = new BreadcrumbCollection();
  readonly navData = {
    tabs: [
      {
        label: 'Información',
        icon: 'person',
        permissions: [SystemPermissions.Users.Read],
        component: AccountInfoTabComponent,
      },
      {
        label: 'Roles',
        icon: 'assignment_ind',
        permissions: [SystemPermissions.Roles.Read],
        component: AccountRolesTabComponent,
      },
    ],
  } as NavToolbarData;

  account = this.accountDetailsService.state.account;

  ngOnInit(): void {
    if (!this.userId) {
      logError('User id is not defined');

      return;
    }

    this.accountDetailsService.load(this.userId);
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.accountDetailsService.clean();
  }

  private setBreadcrumb(): void {
    this.breadcrumb
      .push(new BreadcrumbItem('Accounts', SiteUrls.accounts.accounts))
      .push(new BreadcrumbItem('Account Details', SiteUrls.accounts.details, '', false));
  }
}
