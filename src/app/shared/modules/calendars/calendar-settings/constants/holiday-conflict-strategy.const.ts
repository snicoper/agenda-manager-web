import { EnumUtils } from '../../../../../core/utils/enums/enum.utils';
import { BaseEnumInfo } from '../../../../../core/utils/interfaces/enum-utils.interface';
import { HolidayConflictStrategy } from '../enums/holiday-conflict-strategy.enum';

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
