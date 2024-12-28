import { BaseEnumInfo } from '../../../utils/enums/enum-utils.interface';
import { EnumUtils } from '../../../utils/enums/enum.utils';
import { AppointmentConfirmationRequirementStrategy } from './appointment-confirmation-requirement-strategy.enum';

export const AppointmentConfirmationRequirementInfo: Record<AppointmentConfirmationRequirementStrategy, BaseEnumInfo> =
  {
    [AppointmentConfirmationRequirementStrategy.Require]: {
      code: 'Require',
      description: 'Requiere confirmación',
    },
    [AppointmentConfirmationRequirementStrategy.AutoAccept]: {
      code: 'AutoAccept',
      description: 'Auto aceptar',
    },
  } as const;

export const AppointmentConfirmationRequirementUtils = new EnumUtils<
  AppointmentConfirmationRequirementStrategy,
  BaseEnumInfo
>(AppointmentConfirmationRequirementInfo);
