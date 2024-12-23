import { Sort } from '@angular/material/sort';
import { OrderType } from '../enums/order-type';
import { PaginatedResultOrder } from './paginated-result-order';

describe('PaginatedResultOrder', () => {
  describe('constructor', () => {
    it('should create instance with provided values', () => {
      const order = new PaginatedResultOrder('name', OrderType.Ascending);

      expect(order.propertyName).toBe('name');
      expect(order.orderType).toBe(OrderType.Ascending);
    });
  });

  describe('fromSort', () => {
    it('should create from ascending sort', () => {
      const sort: Sort = {
        active: 'name',
        direction: 'asc',
      };

      const order = PaginatedResultOrder.fromSort(sort);

      expect(order).not.toBeNull();
      expect(order?.propertyName).toBe('name');
      expect(order?.orderType).toBe(OrderType.Ascending);
    });

    it('should create from descending sort', () => {
      const sort: Sort = {
        active: 'name',
        direction: 'desc',
      };

      const order = PaginatedResultOrder.fromSort(sort);

      expect(order).not.toBeNull();
      expect(order?.propertyName).toBe('name');
      expect(order?.orderType).toBe(OrderType.Descending);
    });

    it('should return null when sort has no direction', () => {
      const sort: Sort = {
        active: 'name',
        direction: '',
      };

      const order = PaginatedResultOrder.fromSort(sort);

      expect(order).toBeNull();
    });
  });

  describe('toString', () => {
    it('should return formatted string', () => {
      const order = new PaginatedResultOrder('name', OrderType.Ascending);

      expect(order.toString()).toBe('name ASC');
    });
  });
});
