import { HolidayConflictInfo } from '../constants/holiday-conflict-strategy.const';
import { HolidayConflictStrategy } from '../enums/holiday-conflict-strategy.enum';

export const HolidayConflictUtils = {
  getCodeByType: (type: HolidayConflictStrategy): string => HolidayConflictInfo[type]?.code ?? '',

  getDescriptionByType: (type: HolidayConflictStrategy): string => HolidayConflictInfo[type]?.description ?? '',

  isValidType: (type: HolidayConflictStrategy): boolean => type in HolidayConflictStrategy,
} as const;
