import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SidenavComponent } from '../../sidenav/sidenav.component';

@Component({
  selector: 'am-page-base',
  imports: [CommonModule, NavbarComponent, SidenavComponent],
  templateUrl: './page-base.component.html',
  styleUrl: './page-base.component.scss',
})
export class PageBaseComponent {}
