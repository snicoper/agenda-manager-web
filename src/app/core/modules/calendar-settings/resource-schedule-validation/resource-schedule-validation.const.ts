import { BaseEnumInfo } from '../../../utils/enums/enum-utils.interface';
import { EnumUtils } from '../../../utils/enums/enum.utils';
import { ResourceScheduleValidationStrategy } from './resource-schedule-validation-strategy.enum';

export const ResourceScheduleValidationInfo: Record<ResourceScheduleValidationStrategy, BaseEnumInfo> = {
  [ResourceScheduleValidationStrategy.Validate]: {
    code: 'Validate',
    description: 'Validar horarios',
  },
  [ResourceScheduleValidationStrategy.Ignore]: {
    code: 'Ignore',
    description: 'Ignorar horarios',
  },
} as const;

export const ResourceScheduleValidationUtils = new EnumUtils<ResourceScheduleValidationStrategy, BaseEnumInfo>(
  ResourceScheduleValidationInfo,
);
