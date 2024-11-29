import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from '../../core/utils/date-utils';

@Pipe({ name: 'durationToTime' })
export class DurationToTimePipe implements PipeTransform {
  transform(value: number): string {
    const result = DateUtils.formatMinutesToTime(value);

    return result;
  }
}
