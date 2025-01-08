import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SiteUrls } from '../../../../core/config/site-urls';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { DotBackgroundColorComponent } from '../../../../shared/components/dots/dot-background-color/dot-background-color.component';
import { DateTimeFormatPipe } from '../../../../shared/pipes/date-time-format.pipe';
import { ResourceApiService } from '../../services/api/resource-api.service';
import { ResourceSelectedStateService } from '../../services/state/resource-selected-state.service';

@Component({
  selector: 'am-resource-info-tab',
  imports: [
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    DateTimeFormatPipe,
    DotBackgroundColorComponent,
  ],
  templateUrl: './resource-info-tab.component.html',
  styleUrl: './resource-info-tab.component.scss',
})
export class ResourceInfoTabComponent {
  private readonly apiService = inject(ResourceApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly resourceSelectedStateService = inject(ResourceSelectedStateService);
  private readonly bladeService = inject(BladeService);

  readonly siteUrls = SiteUrls;
  readonly resourceState = this.resourceSelectedStateService.state;

  handleChangeStateIsActive(): void {
    // handle change state is active
  }

  handleOpenUpdateResourceBlade(): void {
    // hanel open update resource blade
  }
}
