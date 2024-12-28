import { EnumUtils } from '../../../utils/enums/enum.utils';
import { BaseEnumInfo } from '../../../utils/interfaces/enum-utils.interface';
import { AppointmentOverlappingStrategy } from './appointment-overlapping-strategy.enum';

export const AppointmentOverlappingInfo: Record<AppointmentOverlappingStrategy, BaseEnumInfo> = {
  [AppointmentOverlappingStrategy.Allow]: {
    code: 'Allow',
    description: 'Permitir solapamientos',
  },
  [AppointmentOverlappingStrategy.Reject]: {
    code: 'Reject',
    description: 'Rechazar solapamientos',
  },
} as const;

export const AppointmentOverlappingUtils = new EnumUtils<AppointmentOverlappingStrategy, BaseEnumInfo>(
  AppointmentOverlappingInfo,
);
