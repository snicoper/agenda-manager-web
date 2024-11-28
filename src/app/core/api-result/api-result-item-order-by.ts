import { OrderType } from './types/order-type';

export class ApiResultItemOrderBy {
  propertyName: string;
  orderType: OrderType;

  constructor(propertyName: string, orderType: OrderType) {
    this.propertyName = propertyName;
    this.orderType = orderType;
  }
}
