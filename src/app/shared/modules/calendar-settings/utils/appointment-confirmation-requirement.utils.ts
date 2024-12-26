import { AppointmentConfirmationRequirementInfo } from '../constants/appointment-confirmation-requirement.const';
import { AppointmentConfirmationRequirementStrategy } from '../enums/appointment-confirmation-requirement-strategy.enum';

export const AppointmentConfirmationRequirementUtils = {
  getCodeByType: (type: AppointmentConfirmationRequirementStrategy): string =>
    AppointmentConfirmationRequirementInfo[type]?.code ?? '',

  getDescriptionByType: (type: AppointmentConfirmationRequirementStrategy): string =>
    AppointmentConfirmationRequirementInfo[type]?.description ?? '',

  isValidType: (type: AppointmentConfirmationRequirementStrategy): boolean =>
    type in AppointmentConfirmationRequirementStrategy,
} as const;
