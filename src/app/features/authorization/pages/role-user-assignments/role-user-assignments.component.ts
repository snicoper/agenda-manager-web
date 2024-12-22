import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logWarning } from '../../../../core/errors/debug-logger';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { RoleAssignedUsersComponent } from '../../components/role-assigned-users/role-assigned-users.component';
import { RoleAvailableUsersComponent } from '../../components/role-available-users/role-available-users.component';
import { RoleResponse } from '../../models/role.response';
import { AuthorizationApiService } from '../../services/authorization-api.service';

@Component({
  selector: 'am-role-user-assignments',
  imports: [
    MatCardModule,
    MatTabsModule,
    MatDividerModule,
    PageBaseComponent,
    PageHeaderComponent,
    RoleAssignedUsersComponent,
    RoleAvailableUsersComponent,
  ],
  templateUrl: './role-user-assignments.component.html',
  styleUrl: './role-user-assignments.component.scss',
})
export class RoleUserAssignmentsComponent {
  private readonly authorizationApiService = inject(AuthorizationApiService);
  private readonly route = inject(ActivatedRoute);

  readonly breadcrumb = new BreadcrumbCollection();
  readonly roleId = this.route.snapshot.paramMap.get('id') ?? '';

  role: RoleResponse | null = null;
  loading = true;

  constructor() {
    if (!this.roleId) {
      logWarning('No se ha proporcionado un ID de rol válido.');

      return;
    }

    this.setBreadcrumb();
    this.loadRole();
  }

  private setBreadcrumb(): void {
    this.breadcrumb
      .add('Roles', SiteUrls.roles.list)
      .add('Asignación de usuarios', SiteUrls.roles.roleUserAssignments, '', false);
  }

  private loadRole(): void {
    this.loading = true;

    this.authorizationApiService
      .getRoleById(this.roleId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (role) => (this.role = role),
      });
  }
}
