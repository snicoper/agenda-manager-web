import { Component, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginatedResult } from '../../../core/paginated-result/paginated-result';

@Component({
  selector: 'am-paginator',
  imports: [MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent<T> {
  readonly paginatedResult = input.required<PaginatedResult<T>>();
  readonly show = input(true);

  pageEvent = output<PageEvent>();

  handlePageEvent(pageEvent: PageEvent): void {
    this.pageEvent.emit(pageEvent);
  }
}
