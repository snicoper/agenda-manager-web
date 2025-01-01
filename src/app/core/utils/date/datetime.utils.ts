import { DateTime, Interval } from 'luxon';
import { WeekDay } from '../../modules/week-days/week-days.type';
import { WeekDaysUtils } from '../../modules/week-days/week-days.utils';

export abstract class DateTimeUtils {
  /**
   * Obtener un DateTime a partir de una fecha en formato ISO.
   *
   * @param dateString Fecha en formato ISO.
   * @returns DateTime o null si la fecha es null.
   */
  static fromApi(dateString: string | DateTime | null | undefined): DateTime | null {
    return dateString ? DateTime.fromISO(dateString.toString()) : null;
  }

  /**
   * Convertir un DateTime a un formato ISO.
   *
   * @param dateTime Fecha DateTime a convertir.
   * @returns Un string con la fecha en formato ISO.
   */
  static toApiIsoString(dateTime: DateTime | null): string {
    return dateTime ? dateTime.toUTC().toString() : '';
  }

  /**
   * Obtener un array con un intervalo de días desde start a end con DateTime.
   *
   * @param start Fecha de inicio.
   * @param end Fecha final.
   * @returns Un array de DateTime con el intervalo de días.
   */
  static dayDateTimeInterval(start: DateTime, end: DateTime): (DateTime | null)[] {
    if (start > end) {
      throw new Error('Start date cannot be after end date');
    }

    return Interval.fromDateTimes(start.startOf('day'), end.endOf('day'))
      .splitBy({ day: 1 })
      .map((date: Interval) => date.start);
  }

  /**
   * Obtener en minutos la diferencia entre dos DateTime.
   *
   * @param start DateTime de inicio.
   * @param end DateTime final.
   * @returns Diferencia en minutos de las fechas pasadas.
   */
  static duration(start: DateTime, end: DateTime): number {
    const result = end.diff(start, ['minutes']).minutes;

    return Math.abs(Math.round(result));
  }

  /**
   * Obtiene todos los días del año que coinciden con los días de la semana especificados.
   *
   * @param date Fecha utilizada para determinar el año a procesar.
   * @param weekDayFlags Banderas de días de la semana (ej: WeekDays.Monday | WeekDays.Friday).
   * @returns Array de fechas que coinciden con los días especificados.
   *
   * @example
   * // Obtener todos los lunes y viernes del año.
   * const dates = WeekDaysUtils.weekDaysFromYear(
   *   DateTime.now(),
   *   WeekDays.Monday | WeekDays.Friday
   * );
   */
  static weekDaysFromYear(date: DateTime, weekDayFlags: WeekDay | number): DateTime[] {
    const result: DateTime[] = [];
    const start = date.startOf('year');
    const end = date.endOf('year');

    const interval = Interval.fromDateTimes(start, end);
    const subIntervals = interval.splitBy({ days: 1 });

    subIntervals.forEach((subInt) => {
      const dt = subInt.start;

      if (dt) {
        const dayFlag = WeekDaysUtils.fromLuxonWeekday(dt.weekday);

        if (WeekDaysUtils.hasFlag(weekDayFlags, dayFlag)) {
          result.push(dt);
        }
      }
    });

    return result;
  }

  /**
   * Obtiene todos los días del año que NO coinciden con los días de la semana especificados.
   *
   * @param date Fecha utilizada para determinar el año a procesar.
   * @param weekDayFlags Banderas de días de la semana a excluir.
   * @returns Array de fechas que NO coinciden con los días especificados.
   *
   * @example
   * // Obtener todos los días que no son fin de semana.
   * const dates = WeekDaysUtils.nonWeekDaysFromYear(
   *   DateTime.now(),
   *   WeekDays.Saturday | WeekDays.Sunday
   * );
   */
  static nonWeekDaysFromYear(date: DateTime, weekDayFlags: WeekDay | number): DateTime[] {
    const invertedFlags = ~weekDayFlags & 0b1111111;

    return DateTimeUtils.weekDaysFromYear(date, invertedFlags);
  }

  /**
   * Obtener solo la fecha de un DateTime como string.
   *
   * @param date Fecha y hora a obtener solo el Date.
   */
  static dateOnly(date: DateTime | null): string {
    const result = date?.toFormat('yyyy-LL-dd') ?? '';

    return result;
  }
}
