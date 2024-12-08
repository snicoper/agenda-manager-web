import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { ApiResult } from '../../../../core/api-result/api-result';
import { LogicalOperator } from '../../../../core/api-result/types/logical-operator';
import { RelationalOperator } from '../../../../core/api-result/types/relational-operator';

@Component({
  selector: 'am-table-filter',
  imports: [FormsModule, MatFormFieldModule, MatIcon, MatInputModule],
  templateUrl: './table-filter.component.html',
})
export class TableFilterComponent<T> {
  private destroyRef = inject(DestroyRef);

  private filterSubject = new Subject<string>();

  apiResult = input.required<ApiResult<T>>();
  fieldsFilter = input.required<string[]>();

  filterChange = output<ApiResult<T>>();

  term = '';

  constructor() {
    const destroy$ = new Subject<void>();
    this.destroyRef.onDestroy(() => {
      destroy$.next();
      destroy$.complete();
    });

    this.filterSubject.pipe(debounceTime(300), takeUntil(destroy$)).subscribe({
      next: (term) => this.applyFilters(term),
    });
  }

  handleFilterChange(event: Event): void {
    this.term = String(event);
    this.filterSubject.next(this.term);
  }

  private applyFilters(term: string): void {
    this.apiResult().cleanFilters();

    if (term.length === 0) {
      this.filterChange.emit(this.apiResult());

      return;
    }

    this.apiResult().pageNumber = 1;

    this.fieldsFilter().forEach((element: string) => {
      this.apiResult().addFilter(element, RelationalOperator.Contains, term, LogicalOperator.Or);
    });

    this.filterChange.emit(this.apiResult());
  }
}
