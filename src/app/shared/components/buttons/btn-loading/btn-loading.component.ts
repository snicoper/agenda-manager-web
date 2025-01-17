import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { BtnType } from './btn-type';

@Component({
  selector: 'am-btn-loading',
  imports: [NgClass, MatProgressSpinner, MatButtonModule, MatIcon],
  templateUrl: './btn-loading.component.html',
})
export class BtnLoadingComponent {
  readonly isLoading = input.required<boolean>();
  readonly color = input('primary');
  readonly icon = input<string>();
  readonly btnText = input<string>();
  readonly btnTextLoading = input<string>();
  readonly spinnerColor = input('warn');
  readonly btnType = input(BtnType.submit);
  readonly styles = input('');
  readonly disabled = input(false);

  readonly eventClick = output<void>();

  handleClick(): void {
    this.eventClick.emit();
  }
}
