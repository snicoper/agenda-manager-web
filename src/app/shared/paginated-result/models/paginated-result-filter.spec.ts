import { LogicalOperator } from '../enums/logical-operator';
import { RelationalOperator } from '../enums/relational-operator';
import { FilterOptions } from '../interfaces/filter-options.interface';
import { PaginatedResultFilter } from './paginated-result-filter';

describe('PaginatedResultFilter', () => {
  describe('constructor', () => {
    it('should create with required values and default logical operator', () => {
      const filter = new PaginatedResultFilter('name', RelationalOperator.EqualTo, 'John');

      expect(filter.propertyName).toBe('name');
      expect(filter.relationalOperator).toBe(RelationalOperator.EqualTo);
      expect(filter.value).toBe('John');
      expect(filter.logicalOperator).toBe(LogicalOperator.None);
    });

    it('should create with custom logical operator', () => {
      const filter = new PaginatedResultFilter('name', RelationalOperator.EqualTo, 'John', LogicalOperator.And);

      expect(filter.propertyName).toBe('name');
      expect(filter.relationalOperator).toBe(RelationalOperator.EqualTo);
      expect(filter.value).toBe('John');
      expect(filter.logicalOperator).toBe(LogicalOperator.And);
    });
  });

  describe('create static method', () => {
    it('should create from filter options with required values', () => {
      const options: FilterOptions = {
        propertyName: 'age',
        operator: RelationalOperator.GreaterThan,
        value: '18',
      };

      const filter = PaginatedResultFilter.create(options);

      expect(filter.propertyName).toBe('age');
      expect(filter.relationalOperator).toBe(RelationalOperator.GreaterThan);
      expect(filter.value).toBe('18');
      expect(filter.logicalOperator).toBe(LogicalOperator.None);
    });

    it('should create from filter options with logical operator', () => {
      const options: FilterOptions = {
        propertyName: 'age',
        operator: RelationalOperator.GreaterThan,
        value: '18',
        logicalOperator: LogicalOperator.Or,
      };

      const filter = PaginatedResultFilter.create(options);

      expect(filter.propertyName).toBe('age');
      expect(filter.relationalOperator).toBe(RelationalOperator.GreaterThan);
      expect(filter.value).toBe('18');
      expect(filter.logicalOperator).toBe(LogicalOperator.Or);
    });
  });
});
