import { AppointmentConfirmationRequirementStrategy } from '../enums/appointment-confirmation-requirement-strategy.enum';

export const AppointmentConfirmationRequirementInfo: Record<
  AppointmentConfirmationRequirementStrategy,
  { code: string; description: string }
> = {
  [AppointmentConfirmationRequirementStrategy.Require]: {
    code: 'Require',
    description: 'Requiere confirmación',
  },
  [AppointmentConfirmationRequirementStrategy.AutoAccept]: {
    code: 'AutoAccept',
    description: 'Auto aceptar',
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
