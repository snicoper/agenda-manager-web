import { Signal } from '@angular/core';
import { ResourceTypeDetailsResponse } from '../responses/resource-type-details.response';

export interface ResourceTypeState {
  resourceTypeId: Signal<string | null>;
  resourceType: Signal<ResourceTypeDetailsResponse | null>;
  loading: Signal<boolean>;
}
