import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { filter, switchMap, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { ApiResultErrors } from '../../../../core/errors/api-result-errors';
import { SystemPermissions } from '../../../../core/modules/auth/constants/system-permissions.const';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { ConfirmationDialogService } from '../../../../shared/components/dialogs/confirmation-dialog/services/confirmation-dialog.service';
import { RequiredPermissionDirective } from '../../../../shared/directives/required-permission.directive';
import { BoolToIconPipe } from '../../../../shared/pipes/bool-to-icon.pipe';
import { AuthorizationApiService } from '../../services/api/authorization-api.service';
import { RoleSelectedStateService } from '../../services/state/role-selected-state.service';
import { RoleUpdateBladeComponent } from '../role-update-blade/role-update-blade.component';

@Component({
  selector: 'am-role-info-tab',
  imports: [MatProgressSpinnerModule, MatButtonModule, MatIconModule, BoolToIconPipe, RequiredPermissionDirective],
  templateUrl: './role-info-tab.component.html',
  styleUrl: './role-info-tab.component.scss',
})
export class RoleInfoTabComponent {
  private readonly apiService = inject(AuthorizationApiService);
  private readonly roleSelectedStateService = inject(RoleSelectedStateService);
  private readonly bladeService = inject(BladeService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly router = inject(Router);
  private readonly confirmationDialogService = inject(ConfirmationDialogService);

  readonly siteUrls = SiteUrls;
  readonly systemPermissions = SystemPermissions;
  readonly roleState = this.roleSelectedStateService.state;

  handleOpenUpdateRoleBlade(): void {
    this.bladeService.open(RoleUpdateBladeComponent);
  }

  handleDeleteRole(): void {
    this.confirmationDialogService
      .confirm({
        title: 'Eliminar rol',
        message: '¿Estás seguro de que quieres eliminar este rol?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      })
      .pipe(
        filter(Boolean),
        switchMap(() => this.apiService.deleteRole(this.roleState.roleId()!).pipe(take(1))),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('El rol ha sido eliminado com correctamente!');
          this.router.navigateByUrl(SiteUrls.roles.list);
        },
        error: (error: HttpErrorResponse) => {
          if (
            error.status === HttpStatusCode.Conflict &&
            error.error.code === ApiResultErrors.roles.roleHasUsersAssigned
          ) {
            this.snackBarService.error('No se puede eliminar el rol porque tiene usuarios asignados.');

            return;
          }

          this.snackBarService.error('Ha ocurrido un error al eliminar el rol.');
        },
      });
  }
}
