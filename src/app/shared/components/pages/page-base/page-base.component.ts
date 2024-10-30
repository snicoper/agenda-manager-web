import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'am-page-base',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './page-base.component.html',
  styleUrl: './page-base.component.scss',
})
export class PageBaseComponent {}
