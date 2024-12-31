import { LogicalOperator } from '../enums/logical-operator';
import { RelationalOperator } from '../enums/relational-operator';
import { FilterOptions } from './filter-options.model';

export class PaginatedResultFilter {
  constructor(
    readonly propertyName: string,
    readonly relationalOperator: RelationalOperator,
    readonly value: string,
    public logicalOperator: LogicalOperator = LogicalOperator.None,
  ) {}

  static create(options: FilterOptions): PaginatedResultFilter {
    return new PaginatedResultFilter(options.propertyName, options.operator, options.value, options.logicalOperator);
  }
}
