import { AppointmentOverlappingStrategy } from '../enums/appointment-overlapping-strategy.enum';

export const AppointmentOverlappingInfo: Record<AppointmentOverlappingStrategy, { code: string; description: string }> =
  {
    [AppointmentOverlappingStrategy.Allow]: {
      code: 'Allow',
      description: 'Allow overlapping',
    },
    [AppointmentOverlappingStrategy.Reject]: {
      code: 'Reject',
      description: 'Reject overlapping',
    },
  } as const;

export const AppointmentOverlappingOptions = Object.entries(AppointmentOverlappingInfo).map(([type, info]) => ({
  value: Number(type),
  code: info.code,
  description: info.description,
})) as { value: AppointmentOverlappingStrategy; code: string; description: string }[];

export const AppointmentOverlappingUtils = {
  getCodeByType: (type: AppointmentOverlappingStrategy): string => AppointmentOverlappingInfo[type]?.code ?? '',

  getDescriptionByType: (type: AppointmentOverlappingStrategy): string =>
    AppointmentOverlappingInfo[type]?.description ?? '',

  isValidType: (type: AppointmentOverlappingStrategy): boolean => type in AppointmentOverlappingStrategy,
} as const;
