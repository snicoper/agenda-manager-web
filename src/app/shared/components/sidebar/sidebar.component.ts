import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'am-sidebar',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent { }
