import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';
import { PaginatedResult } from '../../../../shared/paginated-result/paginated-result';
import { UserInRoleResponse } from '../../interfaces/responses/user-in-role.response';
import { AuthorizationApiService } from '../../services/api/authorization-api.service';

@Component({
  selector: 'am-role-assigned-users',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TableFilterComponent,
    PaginatorComponent,
  ],
  templateUrl: './role-assigned-users.component.html',
  styleUrl: './role-assigned-users.component.scss',
})
export class RoleAssignedUsersComponent implements AfterViewInit {
  private readonly apiService = inject(AuthorizationApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly router = inject(Router);

  roleId = input.required<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly displayedColumns = ['email', 'actions'];
  readonly fieldsFilter = ['email'];

  dataSource = new MatTableDataSource<UserInRoleResponse>();
  paginatedResult = new PaginatedResult<UserInRoleResponse>();
  loading = true;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.getUsersInRole();
    });
  }

  handleClickEmailField(userId: string): void {
    const url = UrlUtils.buildSiteUrl(SiteUrls.accounts.details, { id: userId });

    this.router.navigateByUrl(url);
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.paginatedResult = this.paginatedResult.handlePageEvent(pageEvent);
    this.getUsersInRole();
  }

  handleFilterChange(paginatedResult: PaginatedResult<UserInRoleResponse>): void {
    this.paginatedResult = paginatedResult;
    this.getUsersInRole();
  }

  handleSortChange(sortState: Sort): void {
    this.paginatedResult.handleSortChange(sortState);
    this.getUsersInRole();
  }

  handleUnAssignUserToRole(userId: string): void {
    this.loading = true;
    this.apiService
      .unAssignedUserFromRole(this.roleId(), userId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.snackBarService.success('Usuario excluido con éxito.');
          this.getUsersInRole();
        },
        error: () => this.snackBarService.error('Error al eliminar el usuario.'),
      });
  }

  private getUsersInRole(): void {
    this.loading = true;

    this.apiService
      .getUsersByRoleIdPaginated(this.roleId(), this.paginatedResult)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.paginatedResult = PaginatedResult.create<UserInRoleResponse>(response);
          this.dataSource.data = this.paginatedResult.items;

          if (this.sort && this.paginatedResult.order) {
            this.sort.active = this.paginatedResult.order.propertyName;
            this.sort.direction = this.paginatedResult.order.orderType.toLowerCase() as SortDirection;
          }
        },
        error: () => this.snackBarService.error('Error al obtener los usuarios.'),
      });
  }
}
