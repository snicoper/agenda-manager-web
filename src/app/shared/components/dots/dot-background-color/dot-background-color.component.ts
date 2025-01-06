import { Component, input } from '@angular/core';

@Component({
  selector: 'am-dot-background-color',
  imports: [],
  templateUrl: './dot-background-color.component.html',
  styleUrl: './dot-background-color.component.scss',
})
export class DotBackgroundColorComponent {
  readonly hexColor = input.required<string>();
  readonly size = input<string>('24px');
}
