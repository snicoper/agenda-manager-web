import { LogicalOperator } from '../enums/logical-operator';
import { RelationalOperator } from '../enums/relational-operator';

export interface FilterOptions {
  propertyName: string;
  operator: RelationalOperator;
  value: string;
  logicalOperator?: LogicalOperator;
}
