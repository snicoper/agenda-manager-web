import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs';
import { ApiResult } from '../../../../core/api-result/api-result';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';
import { UserInRoleResponse } from '../../models/user-in-role.response';
import { AuthorizationApiService } from '../../services/authorization-api.service';

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

  roleId = input.required<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly displayedColumns = ['email', 'actions'];
  readonly fieldsFilter = ['email'];

  dataSource = new MatTableDataSource<UserInRoleResponse>();
  apiResult = new ApiResult<UserInRoleResponse>();
  loading = true;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.getUsersInRole();
    });
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.apiResult = this.apiResult.handlePageEvent(pageEvent);
    this.getUsersInRole();
  }

  handleFilterChange(apiResult: ApiResult<UserInRoleResponse>): void {
    this.apiResult = apiResult;
    this.getUsersInRole();
  }

  handleSortChange(sortState: Sort): void {
    this.apiResult.handleSortChange(sortState);
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
      .getUsersByRoleIdPaginated(this.roleId(), this.apiResult)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.apiResult = ApiResult.create<UserInRoleResponse>(response);
          this.dataSource.data = this.apiResult.items;

          if (this.sort && this.apiResult.order) {
            this.sort.active = this.apiResult.order.propertyName;
            this.sort.direction = this.apiResult.order.orderType.toLowerCase() as SortDirection;
          }
        },
        error: () => this.snackBarService.error('Error al obtener los usuarios.'),
      });
  }
}
