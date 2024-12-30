import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { ResourceTypeDetailsResponse } from '../../interfaces/responses/resource-type-details.response';
import { ResourceTypeSelectedState } from '../../interfaces/state/resource-type-selected-state.interface';
import { ResourceTypeApiService } from '../api/resource-type-api.service';

@Injectable({ providedIn: 'root' })
export class ResourceTypeSelectedStateService {
  private readonly apiService = inject(ResourceTypeApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly router = inject(Router);

  private readonly resourceTypeId$ = signal<string | null>(null);
  private readonly resourceType$ = signal<ResourceTypeDetailsResponse | null>(null);
  private readonly loading$ = signal<boolean>(false);

  readonly state: ResourceTypeSelectedState = {
    resourceTypeId: computed(() => this.resourceTypeId$()),
    resourceType: computed(() => this.resourceType$()),
    loading: computed(() => this.loading$()),
  };

  load(resourceTypeId: string): void {
    if (this.resourceType$()) {
      return;
    }

    this.resourceTypeId$.set(resourceTypeId);
    this.loadResourceTypeDetails();
  }

  refresh(): void {
    if (!this.resourceTypeId$()) {
      logError('ResourceTypeDetailsStateService.refresh', 'Resource type id is not defined');

      return;
    }

    this.loadResourceTypeDetails();
  }

  setLoadingState(isLoading: boolean): void {
    this.loading$.update(() => isLoading);
  }

  clean(): void {
    this.resourceTypeId$.set(null);
    this.resourceType$.set(null);
  }

  private loadResourceTypeDetails(): void {
    if (!this.resourceTypeId$()) {
      logError('ResourceTypeDetailsStateService.loadResourceTypeDetails', 'Resource type id is not defined');

      return;
    }

    this.loading$.set(true);

    this.apiService
      .getResourceTypeById(this.resourceTypeId$()!)
      .pipe(
        take(1),
        finalize(() => this.loading$.set(false)),
      )
      .subscribe({
        next: (response) => this.resourceType$.set(response),
        error: (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.NotFound) {
            this.snackBarService.error('Tipo de recurso no encontrado');
          } else {
            this.snackBarService.error('Error al cargar los detalles del tipo de recurso');
          }

          this.router.navigateByUrl(SiteUrls.resourceTypes.list);
        },
      });
  }
}
