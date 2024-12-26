/**
 * Define el estado inicial de las citas al ser creadas.
 */
export enum AppointmentConfirmationRequirementStrategy {
  Require = 1,
  AutoAccept = 2,
}

export const AppointmentConfirmationRequirementInfo: Record<
  AppointmentConfirmationRequirementStrategy,
  { code: string; description: string }
> = {
  [AppointmentConfirmationRequirementStrategy.Require]: {
    code: 'Require',
    description: 'Require confirmation',
  },
  [AppointmentConfirmationRequirementStrategy.AutoAccept]: {
    code: 'AutoAccept',
    description: 'Auto accept',
  },
} as const;

export const AppointmentConfirmationRequirementOptions = Object.entries(AppointmentConfirmationRequirementInfo).map(
  ([type, info]) => ({
    value: Number(type),
    code: info.code,
    description: info.description,
  }),
) as { value: AppointmentConfirmationRequirementStrategy; code: string; description: string }[];

export const AppointmentConfirmationRequirementUtils = {
  getCodeByType: (type: AppointmentConfirmationRequirementStrategy): string =>
    AppointmentConfirmationRequirementInfo[type]?.code ?? '',

  getDescriptionByType: (type: AppointmentConfirmationRequirementStrategy): string =>
    AppointmentConfirmationRequirementInfo[type]?.description ?? '',

  isValidType: (type: AppointmentConfirmationRequirementStrategy): boolean =>
    type in AppointmentConfirmationRequirementStrategy,
} as const;
