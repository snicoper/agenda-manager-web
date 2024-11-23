import { DateTime, Interval } from 'luxon';
import { WeekDay } from '../types/weekdays/weekday';

export abstract class DateTimeUtils {
  /**
   * Obtener un array con un intervalo de días desde start a end con DateTime.
   *
   * @param start Fecha de inicio.
   * @param end Fecha final.
   * @returns Un array de DateTime con el intervalo de días.
   */
  static dayDateTimeInterval(start: DateTime, end: DateTime): (DateTime | null)[] {
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
   * Obtener un DateTime como string UTC.
   *
   * @param dateTime DateTime a obtener como UTC.
   * @returns Un string con la hora pasada en UTC.
   */
  static toISOString(dateTime: DateTime): string {
    const result = dateTime.toUTC().toString();

    return result;
  }

  static weekDaysFromYear(date: DateTime, weekDay: WeekDay): DateTime[] {
    const result: DateTime[] = [];
    const start = date.startOf('year');
    const end = date.endOf('year');

    const interval = Interval.fromDateTimes(start, end);
    const subIntervals = interval.splitBy({ days: 1 });

    subIntervals.forEach((subInt) => {
      const d = subInt.start;

      if (d?.weekday === weekDay) {
        result.push(d!);
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
