import { Component, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ApiResult } from '../../../core/api-result/api-result';

@Component({
  selector: 'am-paginator',
  imports: [MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent<T> {
  readonly apiResult = input.required<ApiResult<T>>();
  readonly show = input(true);

  pageEventEmitter = output<PageEvent>();

  handlePageEvent(pageEvent: PageEvent): void {
    this.pageEventEmitter.emit(pageEvent);
  }
}
