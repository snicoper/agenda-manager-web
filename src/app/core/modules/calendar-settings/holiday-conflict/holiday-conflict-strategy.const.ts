import { BaseEnumInfo } from '../../../utils/enums/enum-utils.interface';
import { EnumUtils } from '../../../utils/enums/enum.utils';
import { HolidayConflictStrategy } from './holiday-conflict-strategy.enum';

export const HolidayConflictInfo: Record<HolidayConflictStrategy, BaseEnumInfo> = {
  [HolidayConflictStrategy.Allow]: {
    code: 'Allow',
    description: 'Permit solapamiento',
  },
  [HolidayConflictStrategy.Reject]: {
    code: 'Reject',
    description: 'Rechazar solapamiento',
  },
  [HolidayConflictStrategy.Cancel]: {
    code: 'Cancel',
    description: 'Cancelar citas',
  },
} as const;

export const HolidayConflictUtils = new EnumUtils<HolidayConflictStrategy, BaseEnumInfo>(HolidayConflictInfo);
