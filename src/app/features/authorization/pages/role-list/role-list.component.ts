import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiResult } from '../../../../core/api-result/api-result';
import { SiteUrls } from '../../../../core/config/site-urls';
import { ApiResultErrors } from '../../../../core/errors/api-result-errors';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { SystemPermissions } from '../../../../core/types/system-permissions';
import { CommonUtils } from '../../../../core/utils/common-utils';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumbItem';
import { PageBaseComponent } from '../../../../shared/components/pages/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/pages/page-header/page-header.component';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';
import { RequiredPermissionDirective } from '../../../../shared/directives/required-permission.directive';
import { BoolToIconPipe } from '../../../../shared/pipes/bool-to-icon.pipe';
import { RoleCreateDialogComponent } from '../../components/role-create-dialog/role-create-dialog.component';
import { RoleResponse } from '../../models/role.response';
import { AuthorizationApiService } from '../../services/authorization-api.service';

@Component({
  selector: 'am-role-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinner,
    MatButtonModule,
    MatIconModule,
    PageBaseComponent,
    PageHeaderComponent,
    TableFilterComponent,
    PaginatorComponent,
    BoolToIconPipe,
    RequiredPermissionDirective,
  ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
})
export class RoleListComponent implements AfterViewInit {
  private readonly apiService = inject(AuthorizationApiService);
  private readonly router = inject(Router);
  private readonly matDialog = inject(MatDialog);
  private readonly snackBarService = inject(SnackBarService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly breadcrumb = new BreadcrumbCollection();
  readonly displayedColumns = ['name', 'description', 'isEditable', 'actions'];
  readonly fieldsFilter = ['name', 'description'];
  readonly siteUrls = SiteUrls;
  readonly systemPermissions = SystemPermissions;

  dataSource = new MatTableDataSource<RoleResponse>();
  apiResult = new ApiResult<RoleResponse>();
  loading = true;

  constructor() {
    this.setBreadcrumb();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.loadRoles();
    });
  }

  handleSelectRow(role: RoleResponse): void {
    const url = CommonUtils.buildUrl(SiteUrls.roles.details, { id: role.id });
    this.router.navigateByUrl(url);
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.apiResult = this.apiResult.handlePageEvent(pageEvent);
    this.loadRoles();
  }

  handleFilterChange(apiResult: ApiResult<RoleResponse>): void {
    this.apiResult = apiResult;
    this.loadRoles();
  }

  handleSortChange(sortState: Sort): void {
    this.apiResult.handleSortChange(sortState);
    this.loadRoles();
  }

  handleOpenDialogCreateRole(): void {
    const dialogRef = this.matDialog.open(RoleCreateDialogComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        {
          this.loadRoles();
        }
      }
    });
  }

  handleDeleteRole(roleId: string): void {
    this.apiService.deleteRole(roleId).subscribe({
      next: () => {
        this.snackBarService.success('El role ha sido eliminado com éxito!');

        this.loadRoles();
      },
      error: (error: HttpErrorResponse) => {
        if (
          error.status === HttpStatusCode.Conflict &&
          error.error.code === ApiResultErrors.roles.roleHasUsersAssigned
        ) {
          this.snackBarService.error('No se puede eliminar el role porque tiene usuarios asignados.');

          return;
        }

        this.snackBarService.error('Ha ocurrido un error al eliminar el role.');
      },
    });
  }

  private setBreadcrumb(): void {
    this.breadcrumb.push(new BreadcrumbItem('Roles', SiteUrls.roles.list));
  }

  private loadRoles(): void {
    this.loading = true;

    this.apiService
      .getRolesPaginated(this.apiResult)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.apiResult = ApiResult.create<RoleResponse>(response);
          this.dataSource.data = this.apiResult.items;

          if (this.sort && this.apiResult.order) {
            this.sort.active = this.apiResult.order.propertyName;
            this.sort.direction = this.apiResult.order.orderType.toLowerCase() as SortDirection;
          }
        },
      });
  }
}
