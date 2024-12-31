import { ResourceCategory } from '../../../../core/modules/resource-management/resource-category/resource-category.enum';

export interface ResourceTypePaginatedResponse {
  resourceTypeId: string;
  name: string;
  description: string;
  category: ResourceCategory;
}
