import { CommonModule } from '@angular/common';
import { Component, input, model, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'am-alert',
  imports: [CommonModule, MatIcon],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  readonly type = input.required<'success' | 'error' | 'warning' | 'info' | undefined>();
  readonly dismissible = input(true);
  readonly showIcon = input(true);

  readonly eventClose = output<void>();

  readonly show = model(false);

  handleClose(): void {
    this.show.update(() => false);
    this.eventClose.emit();
  }
}
