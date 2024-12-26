import { ResourceScheduleValidationStrategy } from '../enums/resource-schedule-validation-strategy.enum';

export const ResourceScheduleValidationInfo: Record<
  ResourceScheduleValidationStrategy,
  { code: string; description: string }
> = {
  [ResourceScheduleValidationStrategy.Validate]: {
    code: 'Validate',
    description: 'Validate schedule',
  },
  [ResourceScheduleValidationStrategy.Ignore]: {
    code: 'Ignore',
    description: 'Ignore schedule',
  },
} as const;

export const ResourceScheduleValidationOptions = Object.entries(ResourceScheduleValidationInfo).map(([type, info]) => ({
  value: Number(type),
  code: info.code,
  description: info.description,
})) as { value: ResourceScheduleValidationStrategy; code: string; description: string }[];
