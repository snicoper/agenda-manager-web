/**
 * Define si se validan los horarios de disponibilidad de los recursos requeridos al crear una cita.
 * Los requisitos del servicio siempre se comprueban, pero la validación de los horarios puede ser opcional.
 */
export enum ResourceScheduleValidationStrategy {
  Validate = 1,
  Ignore = 2,
}

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

export const ResourceScheduleValidationUtils = {
  getCodeByType: (type: ResourceScheduleValidationStrategy): string => ResourceScheduleValidationInfo[type]?.code ?? '',

  getDescriptionByType: (type: ResourceScheduleValidationStrategy): string =>
    ResourceScheduleValidationInfo[type]?.description ?? '',

  isValidType: (type: ResourceScheduleValidationStrategy): boolean => type in ResourceScheduleValidationStrategy,
} as const;
