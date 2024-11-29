import { Sort } from '@angular/material/sort';
import { OrderType } from './types/order-type';

export class ApiResultOrder {
  constructor(
    readonly propertyName: string,
    readonly orderType: OrderType,
  ) {}

  static fromSort(sort: Sort): ApiResultOrder | null {
    if (!sort.direction) {
      return null;
    }

    return new ApiResultOrder(sort.active, sort.direction.toUpperCase() as OrderType);
  }

  toString(): string {
    return `${this.propertyName} ${this.orderType}`;
  }
}
