import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncateText' })
export class TruncateTextPipe implements PipeTransform {
  transform(value: string, limit: number, dots = true): string {
    const printDots = dots ? '...' : '';

    return value.length > limit ? `${value.substring(0, limit)}${printDots}` : value;
  }
}
