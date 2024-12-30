import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { ApiResultErrors } from '../../../../core/errors/api-result-errors';
import { ResourceCategoryUtils } from '../../../../core/modules/resource-management/resource-category/resource-category.const';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { ResourceTypeApiService } from '../../services/api/resource-type-api.service';
import { ResourceTypeSelectedStateService } from '../../services/state/resource-type-selected-state.service';
import { ResourceTypeUpdateBladeComponent } from '../resource-type-update-blade/resource-type-update-blade.component';

@Component({
  selector: 'am-resource-type-info-tab',
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './resource-type-info-tab.component.html',
  styleUrl: './resource-type-info-tab.component.scss',
})
export class ResourceTypeInfoTabComponent {
  private readonly resourceTypeSelectedStateService = inject(ResourceTypeSelectedStateService);
  private readonly apiService = inject(ResourceTypeApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly router = inject(Router);
  private readonly bladeService = inject(BladeService);

  readonly siteUrls = SiteUrls;
  readonly resourceTypeState = this.resourceTypeSelectedStateService.state;
  readonly resourceCategoryUtils = ResourceCategoryUtils;

  handleOpenUpdateResourceTypeBlade(): void {
    this.bladeService.show(ResourceTypeUpdateBladeComponent);

    this.bladeService.result.pipe(take(1)).subscribe({
      next: () => {
        this.resourceTypeSelectedStateService.refresh();
      },
    });
  }

  handleDeleteResourceType(): void {
    this.apiService
      .deleteResourceType(this.resourceTypeState.resourceTypeId()!)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.snackBarService.success('Tipo de recurso eliminado correctamente');
          this.router.navigateByUrl(SiteUrls.resourceTypes.list);
        },
        error: (error: HttpErrorResponse) => {
          if (error.error === ApiResultErrors.resourceTypes.cannotDeleteResourceType) {
            this.snackBarService.error('No se puede eliminar el tipo de recurso porque tiene recursos asociados');

            return;
          }

          this.snackBarService.error('Error al eliminar el tipo de recurso');
        },
      });
  }
}
