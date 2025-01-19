import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { filter, finalize, switchMap, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { ApiResultErrors } from '../../../../core/errors/api-result-errors';
import { SystemPermissions } from '../../../../core/modules/auth/constants/system-permissions.const';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { ConfirmationDialogService } from '../../../../shared/components/dialogs/confirmation-dialog/services/confirmation-dialog.service';
import { DotBackgroundColorComponent } from '../../../../shared/components/dots/dot-background-color/dot-background-color.component';
import { RequiredPermissionDirective } from '../../../../shared/directives/required-permission.directive';
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
    RequiredPermissionDirective,
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
  private readonly confirmationDialogService = inject(ConfirmationDialogService);
  private readonly router = inject(Router);

  readonly deactivationReason = signal('');
  readonly isLoading = signal(false);

  readonly resourceState = this.resourceSelectedStateService.state;
  readonly siteUrls = SiteUrls;
  readonly systemPermissions = SystemPermissions;

  handleChangeStateIsActive(): void {
    if (!this.resourceState.resource()?.isActive) {
      this.activateResource();

      return;
    }

    const dialogRef = this.dialog.open(ResourceDeactivationReasonDialogComponent, {
      data: { deactivationReason: this.deactivationReason() },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === undefined) {
        this.resourceSelectedStateService.refresh();

        return;
      }

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

  handleDeleteResource(): void {
    this.confirmationDialogService
      .confirm({
        title: 'Eliminar recurso',
        message: '¿Estás seguro de que quieres eliminar este recurso?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      })
      .pipe(
        filter(Boolean),
        switchMap(() => this.apiService.deleteResource(this.resourceState.resourceId()!).pipe(take(1))),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('El recurso ha sido eliminado correctamente');
          this.router.navigateByUrl(SiteUrls.resources.list);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.Conflict && error.error.code === ApiResultErrors.resources.cannotDelete) {
            this.snackBarService.error('No se puede eliminar el recurso porque tiene citas asociadas.');

            return;
          }

          this.snackBarService.error('Ha ocurrido un error al eliminar el recurso.');
        },
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
