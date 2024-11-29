import { Location } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'am-btn-back',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './btn-back.component.html',
})
export class BtnBackComponent {
  color = input('accent');
  icon = input('arrow_back_ios');
  text = input('Volver');

  private readonly location = inject(Location);

  handleClick(): void {
    this.location.back();
  }
}
