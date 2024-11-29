import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({ name: 'dateTimeFormat' })
export class DateTimeFormatPipe implements PipeTransform {
  transform(value: DateTime | string | undefined, format = DateTime.DATE_MED): string {
    if (!value) {
      return '';
    }

    return value.toLocaleString(format);
  }
}
