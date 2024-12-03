import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiResult } from '../../../../core/api-result/api-result';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';
import { UserNotInRoleResponse } from '../../models/user-not-in-role.response';
import { AuthorizationApiService } from '../../services/authorization-api.service';

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

  roleId = input.required<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly displayedColumns = ['email', 'actions'];
  readonly fieldsFilter = ['email'];

  dataSource = new MatTableDataSource<UserNotInRoleResponse>();
  apiResult = new ApiResult<UserNotInRoleResponse>();
  loading = true;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.getUsersNotInRole();
    });
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.apiResult = this.apiResult.handlePageEvent(pageEvent);
    this.getUsersNotInRole();
  }

  handleFilterChange(apiResult: ApiResult<UserNotInRoleResponse>): void {
    this.apiResult = apiResult;
    this.getUsersNotInRole();
  }

  handleSortChange(sortState: Sort): void {
    this.apiResult.handleSortChange(sortState);
    this.getUsersNotInRole();
  }

  handleUnAssignUserToRole(userId: string): void {
    this.loading = true;
    this.apiService.assignUserToRole(this.roleId(), userId).subscribe({
      next: () => {
        this.snackBarService.success('Usuario incluido con éxito.');
        this.getUsersNotInRole();
      },
      complete: () => (this.loading = false),
    });
  }

  private getUsersNotInRole(): void {
    this.loading = true;

    this.apiService.getUsersNotInRoleId(this.roleId(), this.apiResult).subscribe({
      next: (response) => {
        this.apiResult = ApiResult.create<UserNotInRoleResponse>(response);
        this.dataSource.data = this.apiResult.items;

        if (this.sort && this.apiResult.order) {
          this.sort.active = this.apiResult.order.propertyName;
          this.sort.direction = this.apiResult.order.orderType.toLowerCase() as SortDirection;
        }
      },
      complete: () => (this.loading = false),
    });
  }
}
