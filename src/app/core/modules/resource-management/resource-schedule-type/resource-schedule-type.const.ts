import { BaseEnumInfo } from '../../../utils/enums/enum-utils.interface';
import { EnumUtils } from '../../../utils/enums/enum.utils';
import { ResourceScheduleType } from './resource-schedule-type.enum';

export const ResourceScheduleTypeDisplayInfo: Record<ResourceScheduleType, BaseEnumInfo> = {
  [ResourceScheduleType.Available]: {
    code: 'Available',
    description: 'Disponible',
  },
  [ResourceScheduleType.Unavailable]: {
    code: 'Unavailable',
    description: 'No disponible',
  },
} as const;

export const ResourceScheduleTypeUtils = new EnumUtils<ResourceScheduleType, BaseEnumInfo>(
  ResourceScheduleTypeDisplayInfo,
);
