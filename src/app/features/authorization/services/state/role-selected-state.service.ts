import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { RoleDetailsResponse } from '../../models/responses/role-details.response';
import { AuthorizationApiService } from '../api/authorization-api.service';

@Injectable({ providedIn: 'root' })
export class RoleSelectedStateService {
  private readonly apiService = inject(AuthorizationApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly router = inject(Router);

  private readonly roleId$ = signal<string | null>(null);
  private readonly role$ = signal<RoleDetailsResponse | null>(null);
  private readonly isLoading$ = signal<boolean>(false);

  readonly state = {
    roleId: computed(() => this.roleId$()),
    role: computed(() => this.role$()),
    isLoading: computed(() => this.isLoading$()),
  };

  load(roleId: string): void {
    if (this.role$()) {
      return;
    }

    this.roleId$.set(roleId);
    this.loadRoleDetails();
  }

  refresh(): void {
    if (!this.roleId$()) {
      logError('RoleSelectedStateService.refresh', 'Role id is not defined');

      return;
    }

    this.loadRoleDetails();
  }

  setLoadingState(isLoading: boolean): void {
    this.isLoading$.update(() => isLoading);
  }

  clean(): void {
    this.roleId$.set(null);
    this.role$.set(null);
  }

  private loadRoleDetails(): void {
    if (!this.roleId$()) {
      logError('RoleSelectedStateService.loadRoleDetails', 'Role id is not defined');

      return;
    }

    this.isLoading$.set(true);

    this.apiService
      .getRoleById(this.state.roleId()!)
      .pipe(
        take(1),
        finalize(() => this.isLoading$.set(false)),
      )
      .subscribe({
        next: (response) => this.role$.set(response),
        error: (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.NotFound) {
            this.snackBarService.error('Role no encontrado');
          } else {
            this.snackBarService.error('Error al cargar el role');
          }

          this.router.navigateByUrl(SiteUrls.roles.list);
        },
      });
  }
}
