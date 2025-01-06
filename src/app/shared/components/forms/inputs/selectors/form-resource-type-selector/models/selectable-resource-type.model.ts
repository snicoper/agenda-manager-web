import { ResourceCategory } from '../../../../../../../core/modules/resource-management/resource-category/resource-category.enum';

export interface SelectableResourceType {
  resourceTypeId: string;
  name: string;
  category: ResourceCategory;
}
