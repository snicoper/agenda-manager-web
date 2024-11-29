import { LogicalOperator } from './types/logical-operator';
import { RelationalOperator } from './types/relational-operator';

export interface FilterOptions {
  propertyName: string;
  operator: RelationalOperator;
  value: string;
  logicalOperator?: LogicalOperator;
}

export class ApiResultFilter {
  constructor(
    readonly propertyName: string,
    readonly relationalOperator: RelationalOperator,
    readonly value: string,
    public logicalOperator: LogicalOperator = LogicalOperator.None,
  ) {}

  static create(options: FilterOptions): ApiResultFilter {
    return new ApiResultFilter(options.propertyName, options.operator, options.value, options.logicalOperator);
  }
}
