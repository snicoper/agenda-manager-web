/**
 * Define cómo gestionar los conflictos cuando un día festivo se solapa con citas existentes:
 * permitir que coexistan, rechazar la operación, o cancelar automáticamente las citas afectadas.
 */
export enum HolidayConflictStrategy {
  Allow = 1,
  Reject = 2,
  Cancel = 3,
}

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

export const HolidayConflictUtils = {
  getCodeByType: (type: HolidayConflictStrategy): string => HolidayConflictInfo[type]?.code ?? '',

  getDescriptionByType: (type: HolidayConflictStrategy): string => HolidayConflictInfo[type]?.description ?? '',

  isValidType: (type: HolidayConflictStrategy): boolean => type in HolidayConflictStrategy,
} as const;
