import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavToolbarData } from '../../../shared/components/layout/nav-toolbar/models/nav-toolbar-data.model';
import { NavToolbarComponent } from '../../../shared/components/layout/nav-toolbar/nav-toolbar.component';
import { PageBaseComponent } from '../../../shared/components/layout/page-base/page-base.component';
import { PruebasComponent } from '../../pruebas/pruebas.component';

@Component({
  selector: 'am-home',
  imports: [CommonModule, PageBaseComponent, NavToolbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  navData: NavToolbarData = {
    tabs: [
      {
        index: 0,
        name: 'info',
        label: 'Información',
        icon: 'person',
        component: PruebasComponent,
        badge: {
          value: '1',
          color: 'accent',
        },
      },
    ],
  };
}
