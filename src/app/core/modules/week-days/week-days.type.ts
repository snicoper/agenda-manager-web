import { WeekDays } from './week-days.const';

// Tipo que representa todos los valores posibles
export type WeekDay = (typeof WeekDays)[keyof typeof WeekDays];
