import { DateTime, Interval } from 'luxon';
import { WeekDaysFlags } from '../../core/types/weekday-flags';

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

  static weekDaysFromYear(date: DateTime, weekDayFlags: number): DateTime[] {
    const result: DateTime[] = [];
    const start = date.startOf('year');
    const end = date.endOf('year');

    const interval = Interval.fromDateTimes(start, end);
    const subIntervals = interval.splitBy({ days: 1 });

    subIntervals.forEach((subInt) => {
      const d = subInt.start;

      if (d) {
        const dayFlag = WeekDaysFlags.fromLuxonWeekday(d.weekday);

        if (WeekDaysFlags.hasFlag(weekDayFlags, dayFlag)) {
          result.push(d);
        }
      }
    });

    return result;
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
