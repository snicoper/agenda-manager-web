import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { PaginatedResultFilter } from './models/paginated-result-filter';
import { PaginatedResultOrder } from './models/paginated-result-order';
import { LogicalOperator } from './types/logical-operator';
import { OrderType } from './types/order-type';
import { RelationalOperator } from './types/relational-operator';

export class PaginatedResult<T> {
  items: T[] = [];
  pageNumber = 1;
  pageSize = 25;
  totalItems = 0;
  totalPages = 1;
  order: PaginatedResultOrder | undefined;
  filters: PaginatedResultFilter[] = [];

  constructor() {
    this.cleanFilters();
    this.cleanOrder();
  }

  static create<TModel>(paginatedResult: PaginatedResult<TModel>): PaginatedResult<TModel> {
    return Object.assign(new PaginatedResult<TModel>(), paginatedResult);
  }

  addFilter(propertyName: string, operator: RelationalOperator, value: string, concat = LogicalOperator.None): this {
    const filter = new PaginatedResultFilter(
      propertyName,
      operator,
      value,
      this.filters.length === 0 ? LogicalOperator.None : concat,
    );

    this.filters.push(filter);

    return this;
  }

  removeFilter(filter: PaginatedResultFilter): this {
    return this.removeFilterByPropertyName(filter.propertyName);
  }

  removeFilterByPropertyName(propertyName: string): this {
    const index = this.filters.findIndex((item) => item.propertyName === propertyName);

    if (index >= 0) {
      this.filters.splice(index, 1);
      this.logicalOperatorInFirstFilter();
    }

    return this;
  }

  hasFilterByPropertyName(propertyName: string): boolean {
    return this.filters.some((item) => item.propertyName === propertyName);
  }

  cleanFilters(): void {
    this.filters = [];
  }

  addOrder(propertyName: string, orderType: OrderType): this {
    this.order = { propertyName, orderType };

    return this;
  }

  handlePageEvent({ pageIndex, pageSize }: PageEvent): this {
    this.pageNumber = pageIndex + 1;
    this.pageSize = pageSize;

    return this;
  }

  handleSortChange({ active: propertyName, direction }: Sort): this {
    const upperDirection = direction.toUpperCase();

    if (upperDirection === OrderType.Ascending || upperDirection === OrderType.Descending) {
      this.addOrder(propertyName, upperDirection as OrderType);
    } else {
      this.cleanOrder();
    }

    this.pageNumber = 1;

    return this;
  }

  cleanOrder(): void {
    this.order = undefined;
  }

  private logicalOperatorInFirstFilter(): void {
    const [firstFilter] = this.filters;

    if (firstFilter?.logicalOperator !== LogicalOperator.None) {
      firstFilter.logicalOperator = LogicalOperator.None;
    }
  }
}
