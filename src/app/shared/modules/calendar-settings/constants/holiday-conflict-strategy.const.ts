import { HolidayConflictStrategy } from '../enums/holiday-conflict-strategy.enum';

export const HolidayConflictInfo: Record<HolidayConflictStrategy, { code: string; description: string }> = {
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

export const HolidayConflictOptions = Object.entries(HolidayConflictInfo).map(([type, info]) => ({
  value: Number(type),
  code: info.code,
  description: info.description,
})) as { value: HolidayConflictStrategy; code: string; description: string }[];

export const HolidayConflictUtils = {
  getCodeByType: (type: HolidayConflictStrategy): string => HolidayConflictInfo[type]?.code ?? '',

  getDescriptionByType: (type: HolidayConflictStrategy): string => HolidayConflictInfo[type]?.description ?? '',

  isValidType: (type: HolidayConflictStrategy): boolean => type in HolidayConflictStrategy,
} as const;
