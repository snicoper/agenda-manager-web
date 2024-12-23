import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { UrlUtils } from '../../../../shared/utils/url/url.utils';
import { AvailableRolesByUserIdResponse } from '../../models/available-roles-by-user-id.response';
import { AccountDetailsService } from '../../services/account-details.service';
import { AccountRoleApiService } from '../../services/account-role-api.service';

@Component({
  selector: 'am-account-roles-tab',
  imports: [MatSlideToggleModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './account-roles-tab.component.html',
  styleUrl: './account-roles-tab.component.scss',
})
export class AccountRolesTabComponent implements OnInit {
  private readonly accountRoleApiService = inject(AccountRoleApiService);
  private readonly accountDetailsService = inject(AccountDetailsService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly router = inject(Router);

  accountState = this.accountDetailsService.state;
  roles: AvailableRolesByUserIdResponse[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadAccountRoles();
  }

  handleRoleChange(roleId: string, isAssigned: boolean): void {
    this.loading = true;

    if (isAssigned) {
      this.assignUserToRole(roleId);
    } else {
      this.unassignUserFromRole(roleId);
    }
  }

  handleNavigateToRolePermissions(roleId: string): void {
    const url = UrlUtils.buildSiteUrl(SiteUrls.roles.permissions, { id: roleId });

    this.router.navigateByUrl(url);
  }

  private assignUserToRole(roleId: string): void {
    this.accountRoleApiService
      .assignUserToRole(roleId, this.accountState.userId()!)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.snackBarService.success('Rol asignado correctamente');
          this.loadAccountRoles();
        },
        error: () => {
          this.snackBarService.error('Error al asignar el rol');
        },
      });
  }

  private unassignUserFromRole(roleId: string): void {
    this.accountRoleApiService
      .unAssignedUserFromRole(roleId, this.accountState.userId()!)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.snackBarService.success('Rol desasignado correctamente');
          this.loadAccountRoles();
        },
        error: () => {
          this.snackBarService.error('Error al desasignar el rol');
        },
      });
  }

  private loadAccountRoles(): void {
    this.accountDetailsService.setLoadingState(true);
    this.loading = true;

    this.accountRoleApiService
      .getAvailableRolesByUserId(this.accountState.userId()!)
      .pipe(
        finalize(() => {
          this.accountDetailsService.setLoadingState(false);
          this.loading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.roles = response;
        },
      });
  }
}
