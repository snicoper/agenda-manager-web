import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { SystemPermissions } from '../../../../core/modules/auth/constants/system-permissions.const';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/models/breadcrumb-collection.model';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ResourceTypeApiService } from '../../services/api/resource-type-api.service';
import { ResourceTypePaginatedResponse } from '../../interfaces/responses/resource-type-paginated.response';

@Component({
  selector: 'am-resource-type-list',
  imports: [PageBaseComponent, PageHeaderComponent],
  templateUrl: './resource-type-list.component.html',
  styleUrl: './resource-type-list.component.scss',
})
export class ResourceTypeListComponent {
  private readonly router = inject(Router);
  private readonly apiService = inject(ResourceTypeApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly bladeService = inject(BladeService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly breadcrumb = new BreadcrumbCollection();
  readonly displayedColumns = ['name', 'description', 'category', 'actions'];
  readonly fieldsFilter = ['name', 'description'];
  readonly systemPermissions = SystemPermissions;

  dataSource = new MatTableDataSource<ResourceTypePaginatedResponse>();

  constructor() {
    this.setBreadcrumb();
  }

  protected setBreadcrumb(): void {
    this.breadcrumb.add('Tipo de recursos', SiteUrls.resourceTypes.list, '', false);
  }
}
