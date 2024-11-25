import { Component, input } from '@angular/core';

@Component({
  selector: 'am-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  type = input<'success' | 'danger' | 'warning' | 'info' | undefined>();
}
