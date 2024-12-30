import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { ResourceCategoryUtils } from '../../../../core/modules/resource-management/resource-category/resource-category.const';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
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
}
