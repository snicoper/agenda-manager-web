import { LogicalOperator } from '../types/logical-operator';
import { RelationalOperator } from '../types/relational-operator';

export interface FilterOptions {
  propertyName: string;
  operator: RelationalOperator;
  value: string;
  logicalOperator?: LogicalOperator;
}

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
