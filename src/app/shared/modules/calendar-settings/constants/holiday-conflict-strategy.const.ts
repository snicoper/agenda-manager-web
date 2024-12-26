import { HolidayConflictStrategy } from '../enums/holiday-conflict-strategy.enum';

export const HolidayConflictInfo: Record<HolidayConflictStrategy, { code: string; description: string }> = {
  [HolidayConflictStrategy.Allow]: {
    code: 'Allow',
    description: 'Allow overlapping',
  },
  [HolidayConflictStrategy.Reject]: {
    code: 'Reject',
    description: 'Reject overlapping',
  },
  [HolidayConflictStrategy.Cancel]: {
    code: 'Cancel',
    description: 'Cancel overlapping',
  },
} as const;

export const HolidayConflictOptions = Object.entries(HolidayConflictInfo).map(([type, info]) => ({
  value: Number(type),
  code: info.code,
  description: info.description,
})) as { value: HolidayConflictStrategy; code: string; description: string }[];
