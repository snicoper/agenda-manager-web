import { LogicalOperator } from './enums/logical-operator';
import { OrderType } from './enums/order-type';
import { RelationalOperator } from './enums/relational-operator';
import { FilterOptions } from './interfaces/filter-options.interface';
import { PaginatedResultFilter } from './models/paginated-result-filter';
import { PaginatedResult } from './paginated-result';

interface TestModel {
  id: number;
  name: string;
}

describe('PaginatedResult', () => {
  let result: PaginatedResult<TestModel>;

  beforeEach(() => {
    result = new PaginatedResult<TestModel>();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(result.items).toEqual([]);
      expect(result.pageNumber).toBe(1);
      expect(result.pageSize).toBe(25);
      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(1);
      expect(result.filters).toEqual([]);
      expect(result.order).toBeUndefined();
    });
  });

  describe('order management', () => {
    it('should add order correctly', () => {
      result.addOrder('name', OrderType.Ascending);

      expect(result.order).toEqual({
        propertyName: 'name',
        orderType: OrderType.Ascending,
      });
    });

    it('should clean order', () => {
      result.addOrder('name', OrderType.Ascending);
      result.cleanOrder();

      expect(result.order).toBeUndefined();
    });
  });

  describe('pagination handling', () => {
    it('should handle page event correctly', () => {
      const pageEvent = { pageIndex: 1, pageSize: 10, length: 100 };

      result.handlePageEvent(pageEvent);

      expect(result.pageNumber).toBe(2);
      expect(result.pageSize).toBe(10);
    });
  });

  describe('filters management', () => {
    it('should add single filter correctly', () => {
      result.addFilter('name', RelationalOperator.EqualTo, 'John');

      expect(result.filters.length).toBe(1);
      expect(result.filters[0]).toEqual(
        new PaginatedResultFilter('name', RelationalOperator.EqualTo, 'John', LogicalOperator.None),
      );
    });

    it('should remove filter correctly', () => {
      result.addFilter('name', RelationalOperator.EqualTo, 'John');
      result.removeFilterByPropertyName('name');

      expect(result.filters.length).toBe(0);
    });

    it('should create filter from options', () => {
      const options: FilterOptions = {
        propertyName: 'name',
        operator: RelationalOperator.EqualTo,
        value: 'John',
        logicalOperator: LogicalOperator.And,
      };

      const filter = PaginatedResultFilter.create(options);

      expect(filter).toEqual(
        new PaginatedResultFilter('name', RelationalOperator.EqualTo, 'John', LogicalOperator.And),
      );
    });

    it('should handle multiple filters with logical operators', () => {
      result
        .addFilter('name', RelationalOperator.EqualTo, 'John')
        .addFilter('age', RelationalOperator.GreaterThan, '30', LogicalOperator.And);

      expect(result.filters.length).toBe(2);
      expect(result.filters[0].logicalOperator).toBe(LogicalOperator.None);
      expect(result.filters[1].logicalOperator).toBe(LogicalOperator.And);
    });

    it('should check if filter exists by property name', () => {
      result.addFilter('name', RelationalOperator.EqualTo, 'John');

      expect(result.hasFilterByPropertyName('name')).toBeTrue();
      expect(result.hasFilterByPropertyName('age')).toBeFalse();
    });

    it('should clean all filters', () => {
      result
        .addFilter('name', RelationalOperator.EqualTo, 'John')
        .addFilter('age', RelationalOperator.GreaterThan, '30', LogicalOperator.And);

      result.cleanFilters();

      expect(result.filters.length).toBe(0);
    });
  });
});
