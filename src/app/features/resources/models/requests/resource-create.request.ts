import { ResourceCategory } from '../../../../core/modules/resource-management/resource-category/resource-category.enum';

export interface ResourceCreateRequest {
  name: string;
  description: string;
  textColor: string;
  backgroundColor: string;
  resourceType: ResourceCategory;
}
