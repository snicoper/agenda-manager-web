import { DateTime } from 'luxon';
import { WeekDays } from './week-days.const';
import { WeekDay } from './week-days.type';

// Funciones helper para trabajar con los flags de WeekDays.
export class WeekDaysUtils {
  // Valores compuestos predefinidos.
  static WeekDaysCombinations = {
    WorkDays: WeekDays.Monday | WeekDays.Tuesday | WeekDays.Wednesday | WeekDays.Thursday | WeekDays.Friday,
    WeekendDays: WeekDays.Saturday | WeekDays.Sunday,
    All:
      WeekDays.Monday |
      WeekDays.Tuesday |
      WeekDays.Wednesday |
      WeekDays.Thursday |
      WeekDays.Friday |
      WeekDays.Saturday |
      WeekDays.Sunday,
  } as const;

  // Verifica si un flag específico está presente.
  static hasFlag(value: number, flag: WeekDay): boolean {
    return (value & flag) === flag;
  }

  // Agrega uno o más flags.
  static addFlags(value: number, ...flags: WeekDay[]): number {
    return flags.reduce((acc, flag) => acc | flag, value);
  }

  // Remueve uno o más flags
  static removeFlags(value: number, ...flags: WeekDay[]): number {
    return flags.reduce((acc, flag) => acc & ~flag, value);
  }

  // Convierte el valor numérico a un array de nombres de días.
  static toArray(value: number): string[] {
    return Object.entries(WeekDays)
      .filter(([, flag]) => typeof flag === 'number' && this.hasFlag(value, flag) && flag !== 0)
      .map(([key]) => key);
  }

  // Función helper para convertir el día de Luxon a nuestro WeekDays.
  static fromLuxonWeekday(weekday: number): WeekDay {
    return (1 << (weekday - 1)) as WeekDay;
  }

  static isWorkDay(luxonDate: DateTime): boolean {
    const dayFlag = this.fromLuxonWeekday(luxonDate.weekday);

    return this.hasFlag(WeekDaysUtils.WeekDaysCombinations.WorkDays, dayFlag);
  }

  static isWeekendDay(luxonDate: DateTime): boolean {
    const dayFlag = this.fromLuxonWeekday(luxonDate.weekday);

    return this.hasFlag(WeekDaysUtils.WeekDaysCombinations.WeekendDays, dayFlag);
  }
}

export const debugWeekDays = (value: number): string => {
  return `
    Valor: ${value}
    Binario: ${value.toString(2).padStart(7, '0')}
    Días activos: ${WeekDaysUtils.toArray(value).join(', ')}
    `;
};

/*
// Ejemplo de uso:
const myWeekDays = WeekDaysUtils.addFlags(WeekDays.None, WeekDays.Monday, WeekDays.Wednesday, WeekDays.Friday);

// Ejemplos de uso
console.log(WeekDaysUtils.hasFlag(myWeekDays, WeekDays.Monday)); // true
console.log(WeekDaysUtils.hasFlag(myWeekDays, WeekDays.Tuesday)); // false
console.log(WeekDaysUtils.toArray(myWeekDays)); // ['Monday', 'Wednesday', 'Friday']
console.log(WeekDaysUtils.toArray(WeekDaysUtils.WeekDaysCombinations.WorkDays)); // ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

// Ejemplo de manipulación de flags
let schedule = WeekDaysUtils.WeekDaysCombinations.WorkDays; // Días laborables
schedule = WeekDaysUtils.removeFlags(schedule, WeekDays.Friday); // Remover viernes
schedule = WeekDaysUtils.addFlags(schedule, WeekDays.Saturday); // Agregar sábado
console.log(WeekDaysUtils.toArray(schedule)); // ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday']
*/
