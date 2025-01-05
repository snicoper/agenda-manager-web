import { ResourceCategory } from '../../../../core/modules/resource-management/resource-category/resource-category.enum';

export interface ResourceTypeCreateRequest {
  name: string;
  description: string;
  category: ResourceCategory;
}
