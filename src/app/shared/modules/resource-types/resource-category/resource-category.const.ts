import { EnumUtils } from '../../../../core/utils/enums/enum.utils';
import { BaseEnumInfo } from '../../../../core/utils/interfaces/enum-utils.interface';
import { ResourceCategory } from './resource-category.enum';

export const ResourceCategoryDisplayInfo: Record<ResourceCategory, BaseEnumInfo> = {
  [ResourceCategory.Staff]: {
    code: 'Staff',
    description: 'Empleado de la empresa',
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

export const ResourceCategoryUtils = new EnumUtils<ResourceCategory, BaseEnumInfo>(
  ResourceCategory,
  ResourceCategoryDisplayInfo,
);
