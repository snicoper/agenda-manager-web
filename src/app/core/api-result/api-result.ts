import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ApiResultFilter } from './api-result-filter';
import { ApiResultOrder } from './api-result-order';
import { PaginationInfo } from './pagination-info';
import { LogicalOperator } from './types/logical-operator';
import { OrderType } from './types/order-type';
import { RelationalOperator } from './types/relational-operator';

export class ApiResult<T> {
  pagination: PaginationInfo = {
    pageNumber: 1,
    pageSize: 25,
    totalItems: 0,
    totalPages: 1,
  };

  /** Items devueltos. */
  items: T[] = [];

  /** Ordenación. */
  order: ApiResultOrder | string = '';

  /** Filtros. */
  filters: ApiResultFilter[] = [];

  constructor() {
    this.cleanFilters();
    this.cleanOrder();
  }

  /**
   * Clonar un ApiResult<T>.
   *
   * @param apiResult ApiResult<T> a clonar.
   * @returns ApiResult<T>.
   */
  static clone<TModel>(apiResult: ApiResult<TModel>): ApiResult<TModel> {
    return Object.assign(new ApiResult<TModel>(), apiResult);
  }

  /**
   * Añade un nuevo filtro.
   * Si es el primer filtro que añade, concat lo cambiara por LogicalOperator.None
   * independientemente del valor en concat que se pase.
   *
   * @param propertyName Nombre de la propiedad.
   * @param operator Operador lógico.
   * @param value Valor del filtro.
   * @param concat Tipo de concatenación.
   * @returns ApiResult<T>.
   */
  addFilter(propertyName: string, operator: RelationalOperator, value: string, concat = LogicalOperator.None): this {
    if (this.filters.length === 0) {
      concat = LogicalOperator.None;
    }

    const filter = new ApiResultFilter(propertyName, operator, value, concat);
    this.filters.push(filter);

    return this;
  }

  /**
   * Elimina un filtro.
   *
   * @param filter Filtro a eliminar.
   * @returns ApiResult<T>.
   */
  removeFilter(filter: ApiResultFilter): this {
    const index = this.filters.findIndex((item) => item.propertyName === filter.propertyName);

    if (index >= 0) {
      this.filters.splice(index, 1);
    }

    this.logicalOperatorInFirstFilter();

    return this;
  }

  /**
   * Elimina un filtro por el propertyName.
   *
   * @param propertyName Nombre de la propiedad a eliminar.
   * @returns ApiResult<T>.
   */
  removeFilterByPropertyName(propertyName: string): this {
    const index = this.filters.findIndex((item) => item.propertyName === propertyName);

    if (index >= 0) {
      this.filters.splice(index, 1);
    }

    this.logicalOperatorInFirstFilter();

    return this;
  }

  /**
   * Comprueba si hay algún filtro por el nombre de la propiedad.
   *
   * @param propertyName Nombre de la propiedad a comprobar.
   * @returns true si existe, false en caso contrario.
   */
  hasFilterByPropertyName(propertyName: string): boolean {
    const index = this.filters.findIndex((item) => item.propertyName === propertyName);

    return index >= 0;
  }

  /** Limpiar filtros. */
  cleanFilters(): void {
    this.filters = [];
  }

  /**
   * Añade un orden de una propiedad.
   *
   * @param propertyName Nombre de la propiedad.
   * @param orderType Tipo de orden.
   * @returns ApiResult<T>.
   */
  addOrder(propertyName: string, orderType: OrderType): this {
    this.order = { propertyName: propertyName, orderType: orderType } as ApiResultOrder;

    return this;
  }

  /**
   * Wrapper al cambiar de pagina con MatPaginator.
   *
   * @param pageEvent PageEvent emitido por MatPaginator.
   * @returns ApiResult<T> con pagination aplicada.
   */
  handlePageEvent(pageEvent: PageEvent): this {
    this.pagination = {
      ...this.pagination,
      pageNumber: pageEvent.pageIndex + 1,
      pageSize: pageEvent.pageSize,
    };

    return this;
  }

  /**
   * Wrapper para añadir el filtro de order desde una table con MatSort.
   *
   * @param sortState Resultado del filtro MatSort.
   * @returns ApiResult<T> con el filtro aplicado.
   */
  handleSortChange(sortState: Sort): this {
    const propertyName = sortState.active;

    switch (sortState.direction.toUpperCase()) {
      case OrderType.Ascending:
        this.addOrder(propertyName, OrderType.Ascending);
        break;
      case OrderType.Descending:
        this.addOrder(propertyName, OrderType.Descending);
        break;
      default:
        this.cleanOrder();
    }

    this.pagination = {
      ...this.pagination,
      pageNumber: 1,
    };

    return this;
  }

  /** Limpiar order. */
  cleanOrder(): void {
    this.order = '';
  }

  /**
   * Comprueba si el primer elemento en los filtros tiene el LogicalOperator != None.
   */
  private logicalOperatorInFirstFilter(): void {
    if (this.filters.length === 0) {
      return;
    }

    const firstFilter = this.filters[0];

    if (firstFilter.logicalOperator !== LogicalOperator.None) {
      firstFilter.logicalOperator = LogicalOperator.None;
    }
  }
}
