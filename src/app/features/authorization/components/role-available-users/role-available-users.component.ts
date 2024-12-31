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
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { PaginatedResult } from '../../../../core/modules/paginated-result/paginated-result';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';
import { AuthorizationApiService } from '../../services/api/authorization-api.service';
import { UserNotInRoleResponse } from '../../models/responses/user-not-in-role.response';

@Component({
  selector: 'am-role-available-users',
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
  templateUrl: './role-available-users.component.html',
  styleUrl: './role-available-users.component.scss',
})
export class RoleAvailableUsersComponent implements AfterViewInit {
  private readonly apiService = inject(AuthorizationApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly router = inject(Router);

  roleId = input.required<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly displayedColumns = ['email', 'actions'];
  readonly fieldsFilter = ['email'];

  dataSource = new MatTableDataSource<UserNotInRoleResponse>();
  paginatedResult = new PaginatedResult<UserNotInRoleResponse>();
  loading = true;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.getUsersNotInRole();
    });
  }

  handleClickEmailField(userId: string): void {
    const url = UrlUtils.buildSiteUrl(SiteUrls.accounts.details, { id: userId });

    this.router.navigateByUrl(url);
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.paginatedResult = this.paginatedResult.handlePageEvent(pageEvent);
    this.getUsersNotInRole();
  }

  handleFilterChange(paginatedResult: PaginatedResult<UserNotInRoleResponse>): void {
    this.paginatedResult = paginatedResult;
    this.getUsersNotInRole();
  }

  handleSortChange(sortState: Sort): void {
    this.paginatedResult.handleSortChange(sortState);
    this.getUsersNotInRole();
  }

  handleAssignUserToRole(userId: string): void {
    this.loading = true;
    this.apiService
      .assignUserToRole(this.roleId(), userId)
      .pipe(
        take(1),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Usuario incluido con éxito.');
          this.getUsersNotInRole();
        },
        error: () => this.snackBarService.error('Error al asignar el usuario.'),
      });
  }

  private getUsersNotInRole(): void {
    this.loading = true;

    this.apiService
      .getUsersNotInRoleIdPaginated(this.roleId(), this.paginatedResult)
      .pipe(
        take(1),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: (response) => {
          this.paginatedResult = PaginatedResult.create<UserNotInRoleResponse>(response);
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
