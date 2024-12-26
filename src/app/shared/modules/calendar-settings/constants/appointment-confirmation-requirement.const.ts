import { AppointmentConfirmationRequirementStrategy } from '../enums/appointment-confirmation-requirement-strategy.enum';

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
