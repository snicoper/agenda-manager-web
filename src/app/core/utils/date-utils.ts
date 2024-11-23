import { DateTime, Interval } from 'luxon';
import { WeekDay } from '../types/weekdays/weekday';

export abstract class DateUtils {
  /**
   * Obtener un array con un intervalo de días desde start a end con Date.
   *
   * @param start Fecha de inicio.
   * @param end Fecha final.
   * @returns Un array de Date con el intervalo de días.
   */
  static dayDateInterval(start: Date, end: Date): Date[] {
    const daysInterval: Date[] = [];

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      daysInterval.push(new Date(d));
    }

    return daysInterval;
  }

  /**
   * Formatear minutos a un string H:M.
   *
   * @param minutes Minutos totales a formatear.
   * @returns Tiempo H:M
   */
  static formatMinutesToTime(minutes: number): string {
    minutes = Math.floor(minutes);

    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      const rest = Math.floor(minutes % 60);

      return `${hours}h ${rest}m`;
    }

    return `${minutes}m`;
  }

  /**
   * Obtener las fechas del año de un día concreto de la semana.
   *
   * @param year Año al que obtener el día de la semana.
   * @param weekDay Numero del día de la semana a obtener (1-7).
   * @returns Array<Date> con los fechas del día de la semana del año concreto.
   */
  static weekDaysFromYear(year: number, weekDay: WeekDay): Date[] {
    const result: Date[] = [];
    const start = DateTime.fromObject({ year: year, month: 1, day: 1 });
    const end = DateTime.fromObject({ year: year, month: 12, day: 31 });

    const interval = Interval.fromDateTimes(start, end);
    const subIntervals = interval.splitBy({ days: 1 });

    for (const sub of subIntervals) {
      const day = sub.start;

      if (day?.weekday === weekDay) {
        result.push(day!.toJSDate());
      }
    }

    return result;
  }

  /**
   * Incrementa el offset de DateTime y Date a una fecha y hora pasada.
   * Si se omite time, el offset se incrementa a date.
   *
   * @param date Fecha a incrementar offset.
   * @param time Fecha/hora a incrementar offset.
   * @returns Nueva fecha añadido el offset.
   * @deprecated
   */
  static incrementOffset(date: Date, time?: Date): Date {
    // Lo importante si existe, es el time para obtener los offsets.
    time = time ?? date;
    const offset = new Date(time).getTimezoneOffset();
    const dtOffset = DateTime.fromJSDate(time).offset;
    const offsetDiff = offset + dtOffset;

    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes() + offsetDiff,
    );

    return newDate;
  }

  /**
   * Decrementa el offset de DateTime y Date a una fecha y hora pasada.
   * Si se omite time, el offset se decrementa a date.
   *
   * @param date Fecha a decrementar offset.
   * @param time Fecha/hora a decrementar offset.
   * @returns Nueva fecha el offset decrementado.
   * @deprecated
   */
  static decrementOffset(date: Date, time?: Date): Date {
    // Lo importante si existe, es el time para obtener los offsets.
    time = time ?? date;
    const offset = new Date(time).getTimezoneOffset();
    const dtOffset = DateTime.fromJSDate(time).offset;
    const offsetDiff = offset + dtOffset;

    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes() - offsetDiff,
    );

    return newDate;
  }

  /**
   * Calcular días de diferencia entre 2 fechas.
   *
   * @param start Fecha de inicio.
   * @param end Fecha Final.
   * @returns Diferencia entre las 2 fechas en días.
   */
  static intervalDays(start: Date, end: Date): number {
    const dateStart = DateTime.fromJSDate(start).startOf('day');
    const dateEnd = DateTime.fromJSDate(end).endOf('day');
    const diff = dateEnd.diff(dateStart, ['day']);
    const daysInterval = Math.abs(Math.round(diff.days));

    return daysInterval;
  }

  /**
   * Establecer un Date al inicio del día 00:00:00.
   *
   * @param date Fecha a establecer inicio del día.
   */
  static dateStartOfDay(date: Date): Date {
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return newDate;
  }

  /**
   * Establecer un Date al final del día 23:59:59.
   *
   * @param date Fecha a establecer inicio del día.
   */
  static dateEndOfDay(date: Date): Date {
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

    return newDate;
  }

  /**
   * Obtener un Date como string UTC.
   *
   * @param date Date a obtener como UTC.
   * @returns Un string con la hora pasada en UTC.
   */
  static toISOString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Obtener cantidad de días en un año concreto.
   *
   * @param year Año a comprobar.
   * @returns 365 o 366 según si es bisiesto o no.
   */
  static daysInYear(year: number): number {
    return (year % 4 === 0 && year % 100 > 0) || year % 400 === 0 ? 366 : 365;
  }
}
