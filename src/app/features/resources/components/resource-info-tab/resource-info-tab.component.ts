import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { DotBackgroundColorComponent } from '../../../../shared/components/dots/dot-background-color/dot-background-color.component';
import { DateTimeFormatPipe } from '../../../../shared/pipes/date-time-format.pipe';
import { DeactivateResourceRequest } from '../../models/requests/deactivate-resource.request';
import { ResourceApiService } from '../../services/api/resource-api.service';
import { ResourceSelectedStateService } from '../../services/state/resource-selected-state.service';
import { ResourceDeactivationReasonDialogComponent } from '../resource-deactivation-reason-dialog/resource-deactivation-reason-dialog.component';
import { ResourceUpdateBladeComponent } from '../resource-update-blade/resource-update-blade.component';

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
  private readonly dialog = inject(MatDialog);

  readonly deactivationReason = signal('');
  readonly isLoading = signal(false);

  readonly siteUrls = SiteUrls;
  readonly resourceState = this.resourceSelectedStateService.state;

  handleChangeStateIsActive(): void {
    if (!this.resourceState.resource()?.isActive) {
      this.activateResource();

      return;
    }

    const dialogRef = this.dialog.open(ResourceDeactivationReasonDialogComponent, {
      data: { deactivationReason: this.deactivationReason() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deactivationReason.set(result);
        this.deactivateResource();

        return;
      }

      this.snackBarService.error('Debe indicar un motivo para desactivar el recurso');
      this.resourceSelectedStateService.refresh();
    });
  }

  handleOpenUpdateResourceBlade(): void {
    this.bladeService.open(ResourceUpdateBladeComponent);

    this.bladeService.result.subscribe((result) => {
      if (result) {
        this.resourceSelectedStateService.refresh();
      }
    });
  }

  private deactivateResource(): void {
    this.isLoading.set(true);

    const request: DeactivateResourceRequest = { deactivationReason: this.deactivationReason() };
    this.apiService
      .deactivateResource(this.resourceState.resourceId()!, request)
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Recurso desactivado correctamente');
          this.resourceSelectedStateService.refresh();
        },
      });
  }

  private activateResource(): void {
    this.isLoading.set(true);

    this.apiService
      .activateResource(this.resourceState.resourceId()!)
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Recurso activado correctamente');
          this.resourceSelectedStateService.refresh();
          this.deactivationReason.set('');
        },
      });
  }
}
