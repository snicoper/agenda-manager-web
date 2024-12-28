import { ResourceCategory } from '../../../../shared/modules/resource-types/resource-category/resource-category.enum';

export interface ResourceTypePaginatedResponse {
  resourceTypeId: string;
  name: string;
  description: string;
  category: ResourceCategory;
}
