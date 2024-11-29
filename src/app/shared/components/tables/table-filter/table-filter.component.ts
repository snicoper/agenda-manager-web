import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ApiResult } from '../../../../core/api-result/api-result';
import { LogicalOperator } from '../../../../core/api-result/types/logical-operator';
import { RelationalOperator } from '../../../../core/api-result/types/relational-operator';

@Component({
  selector: 'am-table-filter',
  imports: [FormsModule, MatFormFieldModule, MatIcon, MatInputModule],
  templateUrl: './table-filter.component.html',
})
export class TableFilterComponent<T> {
  apiResult = input.required<ApiResult<T>>();
  fieldsFilter = input.required<string[]>();

  filterChange = output<ApiResult<T>>();

  term = '';

  /**
   * Elimina todos los filtros en base a fieldsFilter y genera unos nuevos
   * em base al valor de term.
   */
  handleFilterChange(event: Event): void {
    this.fieldsFilter().forEach((propertyName) => this.apiResult().removeFilterByPropertyName(propertyName));

    this.term = String(event);

    // Las búsquedas siempre lo hace desde la pagina 1.
    if (this.term.length > 0) {
      this.apiResult().pageNumber = 1;
    } else {
      this.filterChange.emit(this.apiResult());

      return;
    }

    this.fieldsFilter().forEach((element: string) => {
      this.apiResult().addFilter(element, RelationalOperator.Contains, this.term, LogicalOperator.Or);
    });

    this.filterChange.emit(this.apiResult());
  }
}
