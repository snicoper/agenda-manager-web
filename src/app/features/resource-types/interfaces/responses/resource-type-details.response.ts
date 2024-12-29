import { ResourceCategory } from '../../../../core/modules/resource-management/resource-category/resource-category.enum';

export interface ResourceTypeDetailsResponse {
  responseTypeId: string;
  name: string;
  description: string;
  category: ResourceCategory;
}
