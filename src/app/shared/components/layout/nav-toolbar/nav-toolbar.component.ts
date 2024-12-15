import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RequiredPermissionDirective } from '../../../directives/required-permission.directive';
import { RequiredRoleDirective } from '../../../directives/required-role.directive';
import { NavToolbarData } from './models/nav-toolbar-data.interface';

@Component({
  selector: 'am-nav-toolbar',
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatBadgeModule,
    RequiredRoleDirective,
    RequiredPermissionDirective,
  ],
  templateUrl: './nav-toolbar.component.html',
  styleUrl: './nav-toolbar.component.scss',
})
export class NavToolbarComponent {
  data = input.required<NavToolbarData>();
  selectedIndex = model<number>(0);

  readonly themePalette = 'primary';

  onSelectedIndexChange(index: number): void {
    this.selectedIndex.set(index);
  }
}
