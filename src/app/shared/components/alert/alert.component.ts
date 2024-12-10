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
  type = input.required<'success' | 'error' | 'warning' | 'info' | undefined>();
  dismissible = input(true);
  showIcon = input(true);

  show = model(false);

  eventClose = output<void>();

  handleClose(): void {
    this.show.update(() => false);
    this.eventClose.emit();
  }
}
