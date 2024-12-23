import { Component, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, Subject } from 'rxjs';
import { logError } from '../../../../core/errors/debug-logger';
import { LogicalOperator } from '../../../paginated-result/enums/logical-operator';
import { RelationalOperator } from '../../../paginated-result/enums/relational-operator';
import { PaginatedResult } from '../../../paginated-result/paginated-result';

@Component({
  selector: 'am-table-filter',
  imports: [FormsModule, MatFormFieldModule, MatIcon, MatInputModule],
  templateUrl: './table-filter.component.html',
})
export class TableFilterComponent<T> {
  paginatedResult = input.required<PaginatedResult<T>>();
  fieldsFilter = input.required<string[]>();

  filterChange = output<PaginatedResult<T>>();

  term = '';

  private filterSubject = new Subject<string>();

  constructor() {
    this.filterSubject.pipe(debounceTime(300), takeUntilDestroyed()).subscribe({
      next: (term) => this.applyFilters(term),
      error: (error) => logError(error),
    });
  }

  handleFilterChange(event: Event): void {
    this.term = String(event);
    this.filterSubject.next(this.term);
  }

  private applyFilters(term: string): void {
    this.paginatedResult().cleanFilters();

    if (term.length === 0) {
      this.filterChange.emit(this.paginatedResult());

      return;
    }

    this.paginatedResult().pageNumber = 1;

    this.fieldsFilter().forEach((element: string) => {
      this.paginatedResult().addFilter(element, RelationalOperator.Contains, term, LogicalOperator.Or);
    });

    this.filterChange.emit(this.paginatedResult());
  }
}
