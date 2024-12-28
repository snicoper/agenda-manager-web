import { BaseEnumInfo } from '../../../utils/enums/enum-utils.interface';
import { EnumUtils } from '../../../utils/enums/enum.utils';
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
