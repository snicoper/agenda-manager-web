import { EnumUtils } from '../../../../../core/utils/enums/enum.utils';
import { BaseEnumInfo } from '../../../../../core/utils/interfaces/enum-utils.interface';
import { ResourceScheduleValidationStrategy } from '../enums/resource-schedule-validation-strategy.enum';

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
