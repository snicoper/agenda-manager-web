/**
 * Define cómo gestionar los conflictos temporales al crear o modificar citas:
 * permitir la creación aunque existan solapamientos con otras citas, o rechazarla.
 */
export enum AppointmentOverlappingStrategy {
  Allow = 1,
  Reject = 2,
}

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
