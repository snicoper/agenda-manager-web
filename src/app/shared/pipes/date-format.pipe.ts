import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | undefined, format = DateTime.DATE_MED): string {
    if (!value) {
      return '';
    }

    return DateTime.fromJSDate(new Date(value)).toLocaleString(format);
  }
}
