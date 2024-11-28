import { Sort } from '@angular/material/sort';
import { OrderType } from './types/order-type';

export class Order {
  constructor(
    readonly propertyName: string,
    readonly orderType: OrderType,
  ) {}

  static fromSort(sort: Sort): Order | null {
    if (!sort.direction) {
      return null;
    }

    return new Order(sort.active, sort.direction.toUpperCase() as OrderType);
  }

  toString(): string {
    return `${this.propertyName} ${this.orderType}`;
  }
}
