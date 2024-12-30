import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger';
import { SystemPermissions } from '../../../../core/modules/auth/constants/system-permissions.const';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/models/breadcrumb-collection.model';
import { NavToolbarData } from '../../../../shared/components/layout/nav-toolbar/models/nav-toolbar-data.interface';
import { NavToolbarComponent } from '../../../../shared/components/layout/nav-toolbar/nav-toolbar.component';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { AccountInfoTabComponent } from '../../components/account-info-tab/account-info-tab.component';
import { AccountRolesTabComponent } from '../../components/account-roles-tab/account-roles-tab.component';
import { AccountSelectedStateService } from '../../services/state/account-selected-state.service';

@Component({
  selector: 'am-account-details',
  imports: [MatCardModule, PageBaseComponent, PageHeaderComponent, NavToolbarComponent],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  private readonly accountSelectedStateService = inject(AccountSelectedStateService);
  private readonly route = inject(ActivatedRoute);

  readonly userId = this.route.snapshot.params['userId'];
  readonly breadcrumb = new BreadcrumbCollection();
  readonly navData: NavToolbarData = {
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
  };
  readonly account = this.accountSelectedStateService.state.account;

  ngOnInit(): void {
    if (!this.userId) {
      logError('AccountDetailsComponent.ngOnInit', 'User id is not defined');

      return;
    }

    this.accountSelectedStateService.load(this.userId);
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.accountSelectedStateService.clean();
  }

  private setBreadcrumb(): void {
    this.breadcrumb.add('Cuentas', SiteUrls.accounts.list).add('Detalles', SiteUrls.accounts.details, '', false);
  }
}
