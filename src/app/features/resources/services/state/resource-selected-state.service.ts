import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { ResourceDetailsResponse } from '../../models/responses/resource-details.response';
import { ResourceSelectedState } from '../../models/state/resource-selected.state';
import { ResourceApiService } from '../api/resource-api.service';

@Injectable({ providedIn: 'root' })
export class ResourceSelectedStateService {
  private readonly apiService = inject(ResourceApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly router = inject(Router);

  private readonly resourceId$ = signal<string | null>(null);
  private readonly resource$ = signal<ResourceDetailsResponse | null>(null);
  private readonly loading$ = signal<boolean>(false);

  readonly state: ResourceSelectedState = {
    resourceId: computed(() => this.resourceId$()),
    resource: computed(() => this.resource$()),
    loading: computed(() => this.loading$()),
  };

  load(resourceId: string): void {
    if (this.resource$()) {
      return;
    }

    this.resourceId$.set(resourceId);
    this.loadResourceDetails();
  }

  refresh(): void {
    if (!this.resourceId$()) {
      logError('ResourceSelectedStateService.refresh', 'Resource id is not defined');

      return;
    }

    this.loadResourceDetails();
  }

  setLoadingState(isLoading: boolean): void {
    this.loading$.set(isLoading);
  }

  clean(): void {
    this.resourceId$.set(null);
    this.resource$.set(null);
  }

  private loadResourceDetails(): void {
    if (!this.resourceId$()) {
      logError('ResourceSelectedStateService.loadResourceDetails', 'Resource id is not defined');

      return;
    }

    this.loading$.set(true);

    this.apiService
      .getResourceById(this.resourceId$()!)
      .pipe(
        take(1),
        finalize(() => this.loading$.set(false)),
      )
      .subscribe({
        next: (response) => this.resource$.set(response),
        error: (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.NotFound) {
            this.snackBarService.error('No se encontró el recurso');
          } else {
            this.snackBarService.error('Error al cargar el recurso');
          }

          this.router.navigateByUrl(SiteUrls.resources.list);
        },
      });
  }
}
