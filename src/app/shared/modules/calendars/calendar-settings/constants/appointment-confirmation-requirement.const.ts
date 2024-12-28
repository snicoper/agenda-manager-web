import { EnumUtils } from '../../../../../core/utils/enums/enum.utils';
import { BaseEnumInfo } from '../../../../../core/utils/interfaces/enum-utils.interface';
import { AppointmentConfirmationRequirementStrategy } from '../enums/appointment-confirmation-requirement-strategy.enum';

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
