import { BaseEnumInfo } from '../../../utils/enums/enum-utils.interface';
import { EnumUtils } from '../../../utils/enums/enum.utils';
import { ResourceCategory } from './resource-category.enum';

export const ResourceCategoryDisplayInfo: Record<ResourceCategory, BaseEnumInfo> = {
  [ResourceCategory.Staff]: {
    code: 'Staff',
    description: 'Empleado',
  },
  [ResourceCategory.Place]: {
    code: 'Place',
    description: 'Lugar físico',
  },
  [ResourceCategory.Equipment]: {
    code: 'Equipment',
    description: 'Equipo',
  },
} as const;

export const ResourceCategoryUtils = new EnumUtils<ResourceCategory, BaseEnumInfo>(ResourceCategoryDisplayInfo);
