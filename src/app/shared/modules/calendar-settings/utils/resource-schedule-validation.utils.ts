import { ResourceScheduleValidationInfo } from '../constants/resource-schedule-validation.const';
import { ResourceScheduleValidationStrategy } from '../enums/resource-schedule-validation-strategy.enum';

export const ResourceScheduleValidationUtils = {
  getCodeByType: (type: ResourceScheduleValidationStrategy): string => ResourceScheduleValidationInfo[type]?.code ?? '',

  getDescriptionByType: (type: ResourceScheduleValidationStrategy): string =>
    ResourceScheduleValidationInfo[type]?.description ?? '',

  isValidType: (type: ResourceScheduleValidationStrategy): boolean => type in ResourceScheduleValidationStrategy,
} as const;
