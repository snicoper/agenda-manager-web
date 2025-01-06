import { Signal } from '@angular/core';
import { ResourceDetailsResponse } from '../responses/resource-details.response';

export interface ResourceSelectedState {
  resourceId: Signal<string | null>;
  resource: Signal<ResourceDetailsResponse | null>;
  loading: Signal<boolean>;
}
