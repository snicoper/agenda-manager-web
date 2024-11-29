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
  loading = input.required<boolean>();
  color = input('primary');
  icon = input<string>();
  btnText = input<string>();
  btnTextLoading = input<string>();
  spinnerColor = input('warn');
  btnType = input(BtnType.submit);
  styles = input('');
  disabled = input(false);

  eventClick = output<void>();

  handleClick(): void {
    this.eventClick.emit();
  }
}
