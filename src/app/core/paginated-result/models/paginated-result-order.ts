import { Sort } from '@angular/material/sort';
import { OrderType } from '../types/order-type';

export class PaginatedResultOrder {
  constructor(
    readonly propertyName: string,
    readonly orderType: OrderType,
  ) {}

  static fromSort(sort: Sort): PaginatedResultOrder | null {
    if (!sort.direction) {
      return null;
    }

    return new PaginatedResultOrder(sort.active, sort.direction.toUpperCase() as OrderType);
  }

  toString(): string {
    return `${this.propertyName} ${this.orderType}`;
  }
}
