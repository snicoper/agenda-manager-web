import { Pipe, PipeTransform } from '@angular/core';
import { CommonUtils } from '../utils/common/common.utils';

/** Pasar bytes a una medida legible según el size. */
@Pipe({ name: 'formatSizeUnit' })
export class FormatSizeUnitPipe implements PipeTransform {
  transform(size: number): string {
    return CommonUtils.formatSizeUnit(size);
  }
}
