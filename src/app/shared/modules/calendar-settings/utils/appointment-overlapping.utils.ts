import { AppointmentOverlappingInfo } from '../constants/appointment-overlapping-strategy.const';
import { AppointmentOverlappingStrategy } from '../enums/appointment-overlapping-strategy.enum';

export const AppointmentOverlappingUtils = {
  getCodeByType: (type: AppointmentOverlappingStrategy): string => AppointmentOverlappingInfo[type]?.code ?? '',

  getDescriptionByType: (type: AppointmentOverlappingStrategy): string =>
    AppointmentOverlappingInfo[type]?.description ?? '',

  isValidType: (type: AppointmentOverlappingStrategy): boolean => type in AppointmentOverlappingStrategy,
} as const;
